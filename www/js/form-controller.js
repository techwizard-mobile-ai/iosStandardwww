/*global $:false, document:false, console:false, alert:false, FormGenerator:false, DBController:false, SubStation:false, JSONController:false */

/**
 * This class controls form generation for substations
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the form controller class.
 */
var FormController = function () {
    
    var json_controller = new JSONController(),
        db_controller = new DBController(),
        form_generator = new FormGenerator(),
        current_date = new Date(),
        that = this;

    /**
     * This method checks to see if there is a connection to the internet available
     * @return {Boolean}
     */
    this.checkConnection = function () {
        return window.navigator.onLine;
    };

    /**
     * Adds click event handler to the setup button
     * @return none
     */
	this.enableSetup = function () {
        $('#setup').click(function () {
            $('#main-menu').removeClass('hidden');
            $('#main-menu').addClass('visible');
            $('#setup').addClass('hidden');
        });
        that.setupDB();
    };

    /**
     * Builds the database when starting up the application
     * @return none
     */
    this.setupDB = function () {
        if (that.checkConnection() === true) {
            json_controller.getStationList(addStationComponentsToDB);
        }
    };

    /**
     * Queries the JSONController instance for a list of available substations
     * and generates the html to display them for the user
     */
	this.showMenu = function () {
        form_generator.clearMainMenu();
        db_controller.getEntries('substation_list', generateStationButtons);
    };
    
    var drawBreakerForms = function (breaker_list) {
        console.log('called drawBreakerForms');
        breaker_list.breaker_list.forEach(function (breaker) {
            db_controller.getEntry('breaker_info', breaker, form_generator.drawBreakerForms);
        });
    };
    
    var drawRegulatorForms = function (regulator_list) {
        console.log('called drawRegulatorForms');
        regulator_list.regulator_list.forEach(function (regulator) {
            db_controller.getEntry('regulator_info', regulator, form_generator.drawRegulatorForms);
        });
    };
    
	var submitForm = function () { //unused event param removed
        var hidden = $('#station-form').find(':hidden'),
            station_read = $('#station-form').serializeObject();
        
        hidden.show();

        //db_controller.addEntry(station_read, 'station_readings');

        db_controller.getEntries('station_readings', listReadings);
/*
        $.post("http://127.0.0.1/cemc_apparatus/view/login.php", {
            "username": "cemc",
            "password": "cemc"
        });
        $.post("http://127.0.0.1/cemc_apparatus/view/processread.php", $('#station-form').serialize(), function (ret) {
            if (ret !== "") {
                alert("SUCCESS");
            }
        });
*/
        hidden.hide();
        $("br").css("display", "block");
    };

    var openForm = function (event) {
        var form_string = '<form id="station-form" action = "#" method = "post"></form>',
            read_date = getReadDate();

        form_generator.clearMainMenu();

        $('#main-menu').append(form_string);
        $('#station-form').append('<div class="nav-wrapper" id="nav-wrapper"></div > ');
        $('#nav-wrapper').append('<div class="inner-banner" id="read-info">Station: ' + event.data.name + '&nbsp;<br></div>');
        form_generator.drawDateForm(current_date);
        $('#station-form').append('<div class="table-wrapper"></div>');
        db_controller.getEntry('regulator_list', event.data.id, drawRegulatorForms);
        db_controller.getEntry('breaker_list', event.data.id, drawBreakerForms);

        form_generator.addHiddenFields(event, read_date);
        form_generator.addBackButton(that.showMenu);
        form_generator.addSubmitButton(submitForm);
        if (event.data.reading) {
            setTimeout(function() {
                db_controller.getEntry('station_readings', event.data.reading, showReading);
            }, 1000);
        }
    };

    var getReadDate = function () {
        var date_string = "";
        date_string = date_string + current_date.getFullYear() + "-" + (current_date.getMonth() + 1) + "-" + current_date.getDate();
        return date_string;
    };

    var generateStationButtons = function (stations) {
        stations.forEach(function(station) {
            var id = '#' + station.station_id,
            station_name = "<div class='button float-left' id='" + station.station_id + "'>" + station.station_name + "</div>";
            $('#main-menu').append(station_name);
            $(id).click({
                id: station.station_id,
                name: station.station_name,
                reading: null
            }, openForm);
        });
    };
    
    var listReadings = function(readings) {
        form_generator.clearMainMenu();
        $('#main-menu').append('<div class="nav-wrapper" id="nav-wrapper"></div>');
        $('#main-menu').append('<div class="table-wrapper"></div>');
        $('.table-wrapper').append('<div class="row-dark"></div>');
        $('.row-dark').append('<div class="column-header">Station Name: </div>');
        $('.row-dark').append('<div class="column-header">Date:</div>');
        readings.forEach(function(reading) {   
            var reading_id = reading.station_name.replace(' ', '') + reading.date;
            console.log(reading.station_name.trim());
            $('.table-wrapper').append('<div class="row" id="' + reading_id + '"></div>');
            $('#' + reading_id).append('<div class="column">' + reading.station_name + '</div>');
            $('#' + reading_id).append('<div class="column">' + reading.date + '</div>');

            $('#' + reading_id).click({
                id: reading["station-id"],
                name: reading.station_name,
                reading: reading.read_id
            }, openForm);
        });

    };

    var showReading = function(reading) {
         for (var property in reading) {
             if(reading.hasOwnProperty(property)) {
                 $('#' + property).val(reading[property]);
             }
         }
    };

    var addStationComponentsToDB = function(stations) {
        addRegulatorListToDB(stations);
        addBreakerListToDB(stations);
    };

    var addRegulatorListToDB = function(stations) {
        stations.forEach(function (station) {
            var regulator_list = json_controller.getRegulatorList({data: {id: station.station_id}}),
                regulator_ids = [];

            regulator_list.forEach(function (regulator){
                var regulator_info = json_controller.getRegulatorInfo(regulator);

                db_controller.addEntry(regulator_info, 'regulator_info');
                regulator_ids.push(regulator.regulator_id);
            });

            db_controller.addEntry({station_id: station.station_id, regulator_list: regulator_ids}, 'regulator_list');
        });
    };

    var addBreakerListToDB = function(stations) {
        stations.forEach(function (station) {
            var breaker_list = json_controller.getBreakerList({data: {id: station.station_id}}),
                breaker_ids = [];

            breaker_list.forEach(function (breaker){
                var breaker_info = json_controller.getBreakerInfo(breaker);

                db_controller.addEntry(breaker_info, 'breaker_info');
                breaker_ids.push(breaker.breaker_id);
            });

            db_controller.addEntry({station_id: station.station_id, breaker_list: breaker_ids}, 'breaker_list');
        });
    };
    
    $.fn.serializeObject = function()
    {
        var object = {};
        var array = this.serializeArray();
        $.each(array, function() {
            if (object[this.name] !== undefined) {
                if (!object[this.name].push) {
                    object[this.name] = [object[this.name]];
                }
                object[this.name].push(this.value || '');
            }
            else {
                object[this.name] = this.value || '';
            }
        });
        return object;
    };

};