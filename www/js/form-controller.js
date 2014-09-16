/*global $:false, document:false, console:false, alert:false, FormGenerator:false */

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
var FormController = function (json_controller) {
    
    var form_generator = new FormGenerator();
    
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
		var stations = json_controller.getStationList();

		$("#main-menu").html("");

		stations.rows.forEach(function (station) {
            var id = '#' + station.station_id,
            station_name = "<div class='button float-left' id='" + station.station_id + "'>" + station.station_name + "</div>";
            $('#main-menu').append(station_name);
            $(id).click({
                id: station.station_id,
                name: station.station_name
            }, openForm);
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
            breaker_list = json_controller.getBreakerList(event),
            regulator_ids = regulator_list.rows,
            breaker_ids = breaker_list.rows;

        form_generator.clearMainMenu();

        drawStationForm(event.data.id, event.data.name, regulator_ids, breaker_ids);
    };

	var drawStationForm = function (station_id, station_name, regulator_list, breaker_list) {
        var form_string = '<form id="station-form" action = "#" method = "post"></form>';
        $('#main-menu').append(form_string);
        $('#station-form').append('<div id="nav-wrapper"></div > ');
        $('#nav-wrapper').append('<div class="inner-banner" id="station-select"></div>');
        $('#station-form').append('<input type="hidden" name="station-id" value="' + station_id + '"></input>');
        $('#station-form').append('<div class="table-wrapper"></div>');
        $('#station-form').append('<input type="hidden" name="station_name" value="' + station_name + '"></input>');
        $('#station-form').append('<input type="hidden" name="date" value="' + getReadDate() + '"></input>');
        $('#station-form').append('<input type="hidden" name="year" value="' + getReadYear() + '"></input>');
        $('#station-form').append('<input type="hidden" name="month" value="' + getReadMonth() + '"></input>');
        $('#station-form').append('<input type="hidden" name="day" value="' + getReadDay() + '"></input>');
        drawRegulatorForms(regulator_list);
        drawBreakerForms(breaker_list);
        $('.table-wrapper').append('<input type="button" id="back" name="back" value="BACK" />');
        $('.table-wrapper').append('<input type="button" id="submit" name="submit" value="SUBMIT" />');
        $('#back').click(FormController.showMenu);
        $('#submit').click(submitForm);

    };

    var drawRegulatorForms = function (regulator_list) {
        regulator_list.forEach(function (regulator) {
            var regulator_info = json_controller.getRegulatorInfo(regulator);

            form_generator.drawRegulatorFormHeader(regulator_info);
            form_generator.drawRegulatorAForms(regulator.regulator_id);
            form_generator.drawRegulatorBForms(regulator.regulator_id);
            form_generator.drawRegulatorCForms(regulator.regulator_id);
        });
    };

    var drawBreakerForms = function (breaker_list) {
        breaker_list.forEach(function (breaker) {
            var breaker_info = json_controller.getBreakerInfo(breaker);

            form_generator.drawBreakerFormHeader(breaker_info);
            form_generator.drawBreakerCountForms(breaker.breaker_id);
            if (breaker_info.rows.breaker_has_mult !== 0) {
                form_generator.drawBreakerMultForms(breaker.breaker_id);
            }
            if (breaker_info.rows.breaker_has_amp !== 0) {
                form_generator.drawBreakerAmpForms(breaker.breaker_id);
            }
        });
    };

    //All these get date functions need refactoring. this is lazy.
    var getReadDate = function () {
        var date_string = "";
        var d = new Date();
        date_string = date_string + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return date_string;
    };

    var getReadYear = function () {
        var d = new Date();
        return d.getFullYear();
    };

    var getReadMonth = function () {
        var d = new Date();
        return d.getMonth() + 1;
    };

    var getReadDay = function () {
        var d = new Date();
        return d.getDate();
    };

};