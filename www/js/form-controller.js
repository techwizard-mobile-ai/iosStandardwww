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
     * Adds click event handler to the setup button
     * @return none
     */
	this.enableSetup = function () {
        $('#setup').click(function () {
            $('#main-menu').removeClass('hidden');
            $('#main-menu').addClass('visible');
            $('#setup').addClass('hidden');
        });
    };
    
    /**
     * Queries the JSONController instance for a list of available substations
     * and generates the html to display them for the user
     */
	this.showMenu = function () { //unused event param removed
        form_generator.clearMainMenu();
        
        if (db_controller.checkConnection() === true) {
            json_controller.getStationList(generateStationButtons);
        } else {
            db_controller.getStationList(generateStationButtons);
        }        
    };
    
    var drawBreakerForms = function (breaker_list) {
        breaker_list.forEach(function (breaker) { 
            var breaker_info = json_controller.getBreakerInfo(breaker); 
            form_generator.drawBreakerForms(breaker_info);        
        });
    };
    
    var drawRegulatorForms = function (regulator_list) { 
        regulator_list.forEach(function (regulator) { 
            var regulator_info = json_controller.getRegulatorInfo(regulator);
            form_generator.drawRegulatorForms(regulator_info);
        });
    };
    
	var submitForm = function () { //unused event param removed
        var hidden = $('#station-form').find(':hidden'),
            station_read = $('#station-form').serializeObject();
        
        hidden.show();
        
        console.log(station_read);
        
        //db_controller.addEntry(station_read, 'station_readings');
        db_controller.getReadings(listReadings);
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
        var regulator_list = json_controller.getRegulatorList(event),
            breaker_list = json_controller.getBreakerList(event);

        form_generator.clearMainMenu();

        drawStationForm(event.data, regulator_list, breaker_list);
    };
    
    //MVC WOES: Move this eventually
	var drawStationForm = function (station, regulator_list, breaker_list) {
        var form_string = '<form id="station-form" action = "#" method = "post"></form>';
        $('#main-menu').append(form_string);
        $('#station-form').append('<div class="nav-wrapper" id="nav-wrapper"></div > ');
        $('#nav-wrapper').append('<div class="inner-banner" id="read-info">Station: ' + station.name + '&nbsp;<br></div>');
        form_generator.drawDateForm(current_date);
        $('#station-form').append('<div class="table-wrapper"></div>');
        drawRegulatorForms(regulator_list);
        drawBreakerForms(breaker_list);
        $('.table-wrapper').append('<input type="button" class="button-dark" id="back" name="back" value="BACK" />');
        $('.table-wrapper').append('<input type="button" class="button-dark-right" id="submit" name="submit" value="SUBMIT" />');
        $('#station-form').append('<input type="hidden" name="station-id" value="' + station.id + '"></input>');
        $('#station-form').append('<input type="hidden" name="station_name" value="' + station.name + '"></input>');
        $('#station-form').append('<input type="hidden" name="date" value="' + getReadDate() + '"></input>');
        $('#back').click(that.showMenu);
        $('#submit').click(submitForm);
        showReading(station.reading);
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
                reading: []
            }, openForm);

            var sub_station = {station_id: station.station_id, station_name: station.station_name};
            db_controller.addEntry(sub_station, 'substation_list');
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
            var reading_id = reading.station_name + reading.date;
            $('.table-wrapper').append('<div class="row" id="' + reading_id + '"></div>');
            $('#' + reading_id).append('<div class="column">' + reading.station_name + '</div>');
            $('#' + reading_id).append('<div class="column">' + reading.date + '</div>');

            $('#' + reading_id).click({
                id: reading["station-id"],
                name: reading.station_name,
                reading: reading
            }, openForm);
        });
        console.log(readings);
    };

    var showReading = function(reading) {
        for (property in reading) {
            var field_id = property,
                field_value = reading[property];

            $('#' + field_id).val(field_value);
        }
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