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
     * Adds click event handler to the main buttons
     * @return none
     */
    this.enableButtons = function () {
        $('#setup').bind('click', enableSetup);
        enableNew();
        enableView();
    };

    var enableSetup = function () {
        //hideButtons();
        alert("SETTING UP DB");
        setupDB();

    };

    var enableNew = function () {
        $('#show-stations').click(function () {
            hideButtons();
            showMainMenu();
            showStationList();
        });
    };

    var enableView = function () {
        $('#view-readings').click(function () {
            hideButtons();
            showMainMenu();
            db_controller.getEntries('station_readings', listReadings);
        });
    };

    var hideButtons = function () {
        $('#setup').removeClass('visible');
        $('#setup').addClass('hidden');
        $('#show-stations').removeClass('visible');
        $('#show-stations').addClass('hidden');
        $('#view-readings').removeClass('visible');
        $('#view-readings').addClass('hidden');
    };

    var showButtons = function () {
        form_generator.clearMainMenu();
        $('#setup').removeClass('hidden');
        $('#setup').addClass('visible');
        $('#show-stations').removeClass('hidden');
        $('#show-stations').addClass('visible');
        $('#view-readings').removeClass('hidden');
        $('#view-readings').addClass('visible');
    };

    var showMainMenu = function () {
        form_generator.clearMainMenu();
        $('#main-menu').removeClass('hidden');
        $('#main-menu').addClass('visible');
    };

    /**
     * Builds the database when starting up the application
     * @return none
     */
    var setupDB = function () {
        if (that.checkConnection() === true) {
            json_controller.getStationList(addStationComponentsToDB);
        } else {
            alert("Connection Unavailable: Please Try Again");
        }
    };

    /**
     * Queries the JSONController instance for a list of available substations
     * and generates the html to display them for the user
     */
	var showStationList = function () {

        db_controller.getEntries('substation_list', generateStationButtons);
    };
    
    var drawBreakerForms = function (breaker_list) {
        breaker_list.breaker_list.forEach(function (breaker) {
            db_controller.getEntry('breaker_info', breaker, form_generator.drawBreakerForms);
        });
    };
    
    var drawRegulatorForms = function (regulator_list) {
        regulator_list.regulator_list.forEach(function (regulator) {
            db_controller.getEntry('regulator_info', regulator, form_generator.drawRegulatorForms);
        });
    };
    
	var submitForm = function () {
        var hidden = $('#station-form').find(':hidden'),
            station_read = $('#station-form').serializeObject();
        
        hidden.show();

        db_controller.addEntry(station_read, 'station_readings');

        hidden.hide();
        $("br").css("display", "block");
        alert("Reading Saved to Local Storage");
        showButtons();
    };

    var sendForm = function () {
        if (that.checkConnection() === true) {
            json_controller.submitReading();
            showButtons();
        } else {
            alert("Connection Unavailable: Please Try Again");
        }

    };

    var openForm = function (event) {
        form_generator.clearMainMenu();
        form_generator.drawForm(event, current_date);

        db_controller.getEntry('regulator_list', event.data.id, drawRegulatorForms);
        db_controller.getEntry('breaker_list', event.data.id, drawBreakerForms);

        form_generator.addBackButton(showButtons);
        form_generator.addSubmitButton(submitForm);
        form_generator.addSendButton(sendForm);
        if (event.data.reading) {
            setTimeout(function() {
                db_controller.getEntry('station_readings', event.data.reading, showReading);
            }, 1000);
        }
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
        $('#main-menu').append("<div class='button float-left' id='back'>Back</div>");
        $('#back').click(showButtons);
    };
    
    var listReadings = function(readings) {
        form_generator.clearMainMenu();
        form_generator.drawViewHeaders();
        readings.forEach(function(reading) {   
            var reading_id = reading.station_name.replace(' ', '') + reading.date;
            $('.table-wrapper').append('<div class="row" id="' + reading_id + '"></div>');
            $('#' + reading_id).append('<div class="column">' + reading.station_name + '</div>');
            $('#' + reading_id).append('<div class="column">' + reading.date + '</div>');
            $('#' + reading_id).append('<div class="column" id="edit' + reading_id + '">Edit</div>');
            $('#' + reading_id).append('<div class="column" id="delete' + reading_id + '">Delete</div>');
            addViewActions(reading_id, reading);
        });
        $('#main-menu').append('<input type="button" class="button-dark" id="back" name="back" value="BACK" />');
        $('#back').click(showButtons);
    };

    var addViewActions = function(reading_id, reading) {
        $('#edit' + reading_id).click({
            id: reading["station-id"],
            name: reading.station_name,
            reading: reading.read_id
        }, openForm);

        $('#delete' + reading_id).click({
            id: reading["station-id"],
            name: reading.station_name,
            reading: reading.read_id
        }, deleteReading);
    };

    var deleteReading = function(event) {
        console.log(event.data);
        db_controller.deleteEntry(event.data.reading, "station_readings");
        alert("Reading Deleted");
        showButtons();
    };

    var showReading = function(reading) {
         for (var property in reading) {
             if(reading.hasOwnProperty(property)) {
                 $('#' + property).val(reading[property]);
             }
         }
    };

    var addStationComponentsToDB = function(stations) {
        stations.forEach(function (station) {
            db_controller.addEntry({station_id: station.station_id, station_name: station.station_name}, 'substation_list');
        });
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