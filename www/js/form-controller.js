/*global $:false, document:false, console:false, alert:false, FormGenerator:false, DBController:false, SubStation:false, JSONController:false */

/**
 * This class controls form generation for substations
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the form controller class.
 * @param {Object} json_controller
 *      the JSONController instance to use
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
	this.showMenu = function (event) {
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
    
	var submitForm = function (event) {
        var hidden = $('#station-form').find(':hidden');
        hidden.show();

        console.log($('#station-form').serialize());
        $.post("http://127.0.0.1/cemc_apparatus/view/login.php", {
            "username": "cemc",
            "password": "cemc"
        });
        $.post("http://127.0.0.1/cemc_apparatus/view/processread.php", $('#station-form').serialize(), function (ret) {
            if (ret !== "") {
                alert("SUCCESS");
            }
        });

        hidden.hide();
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
        $('#nav-wrapper').append('<div class="inner-banner" id="read-info">Station: ' + station.name + '</div>');
        form_generator.drawDateForm(current_date);
        $('#station-form').append('<input type="hidden" name="station-id" value="' + station.id + '"></input>');
        $('#station-form').append('<div class="table-wrapper"></div>');
        $('#station-form').append('<input type="hidden" name="station_name" value="' + station.name + '"></input>');
        $('#station-form').append('<input type="hidden" name="date" value="' + getReadDate() + '"></input>');
        $('#station-form').append('<input type="hidden" name="year" value="' + current_date.getFullYear() + '"></input>');
        $('#station-form').append('<input type="hidden" name="month" value="' + (current_date.getMonth() + 1) + '"></input>');
        $('#station-form').append('<input type="hidden" name="day" value="' + current_date.getDate() + '"></input>');
        drawRegulatorForms(regulator_list);
        drawBreakerForms(breaker_list);
        $('.table-wrapper').append('<input type="button" class="button-dark" id="back" name="back" value="BACK" />');
        $('.table-wrapper').append('<input type="button" class="button-dark-right" id="submit" name="submit" value="SUBMIT" />');
        $('#back').click(that.showMenu);
        $('#submit').click(submitForm);
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
                name: station.station_name
            }, openForm);

            db_controller.addSubStation(station.station_id, station.station_name);
        });
    };

};