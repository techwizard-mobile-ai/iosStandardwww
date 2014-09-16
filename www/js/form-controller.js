/*global $:false, document:false, console:false, alert:false */

/**
 * This class controls form generation for substations
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the form controller class.
 * @param {Object} jsoncontroller
 *      the JSONController instance to use
 */
var FormController = function (jsoncontroller) {
    
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
		var stations = jsoncontroller.getStationList();

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
                alert(ret);
            }
        });

        hidden.hide();
    };

    var openForm = function (event) {
        var regulator_list = jsoncontroller.getRegulatorList(event),
            breaker_list = jsoncontroller.getBreakerList(event),
            regulator_ids = regulator_list.rows,
            breaker_ids = breaker_list.rows;

        $("#main-menu").html("");

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
            var regulator_info = jsoncontroller.getRegulatorInfo(regulator);

            drawRegulatorFormHeader(regulator_info);
            drawRegulatorAForms(regulator.regulator_id);
            drawRegulatorBForms(regulator.regulator_id);
            drawRegulatorCForms(regulator.regulator_id);
        });
    };

    var drawRegulatorFormHeader = function (regulator_info) {
        var regulator_name = regulator_info.rows.regulator_name,
            id = "regulator" + regulator_name + "header",
            jquery_id = "#" + id;

        console.log(regulator_name);

        $('.table-wrapper').append("<div class='row-top-header' id='" + id + "'></div>");
        $(jquery_id).append("<div class='column-header-small'>" + regulator_name + "</div>");
        $(jquery_id).append("<div class='column-header'>Count</div>");
        $(jquery_id).append("<div class='column-header'>Raise</div>");
        $(jquery_id).append("<div class='column-header'>Lower</div>");
        $(jquery_id).append("<div class='column-header'>AMP</div>");
        $(jquery_id).append("<div class='column-header'>High Voltage</div>");
        $(jquery_id).append("<div class='column-header'>Low Voltage</div>");
        $(jquery_id).append("<div class='column-header'>Comments</div>");
    };

    var drawRegulatorAForms = function (regulator_id) {
        var jquery_id = "#a" + regulator_id;

        $('.table-wrapper').append("<div class='row' id='a" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>A</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_comments' value='' /></div>");
    };

    var drawRegulatorBForms = function (regulator_id) {
        var jquery_id = "#b" + regulator_id;

        $('.table-wrapper').append("<div class='row' id='b" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>B</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_comments' value='' /></div>");
    };

    var drawRegulatorCForms = function (regulator_id) {
        var jquery_id = "#c" + regulator_id;

        $('.table-wrapper').append("<div class='row' id='c" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>C</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_comments' value='' /></div>");
    };

    var drawBreakerForms = function (breaker_list) {
        breaker_list.forEach(function (breaker) {
            var breaker_info = jsoncontroller.getBreakerInfo(breaker);

            drawBreakerFormHeader(breaker_info);
            drawBreakerCountForms(breaker.breaker_id);
            if (breaker_info.rows.breaker_has_mult !== 0) {
                //TODO Dont forget to check for if it has amps
                drawBreakerMultForms(breaker.breaker_id);
            }
            if (breaker_info.rows.breaker_has_amp !== 0) {
                drawBreakerAmpForms(breaker.breaker_id);
            }
        });
    };

    var drawBreakerFormHeader = function (breaker_info) {
        var breaker_name = breaker_info.rows.breaker_name,
            id = "header" + breaker_name,
            jquery_id = "#" + id;

        $('.table-wrapper').append("<div class='row-header' id='" + id + "'></div>");
        $(jquery_id).append("<div class='column-header-small'>" + breaker_name + "</div>");
        $(jquery_id).append("<div class='column-header'>Count</div>");
        $(jquery_id).append("<div class='column-header'>A</div>");
        $(jquery_id).append("<div class='column-header'>B</div>");
        $(jquery_id).append("<div class='column-header'>C</div>");
        $(jquery_id).append("<div class='column-header'>N</div>");
        $(jquery_id).append("<div class='column-header'>Battery</div>");
        $(jquery_id).append("<div class='column-header'>Comments</div>");
    };

    var drawBreakerCountForms = function (breaker_id) {
        var jquery_id = "#breaker" + breaker_id;

        $('.table-wrapper').append("<div class='row' id='breaker" + breaker_id + "'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "n_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "battery' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "comments' value='' /></div>");
    };

    var drawBreakerMultForms = function (breaker_id) {
        var jquery_id = "#breaker" + breaker_id + "mult";

        $('.table-wrapper').append("<div class='row' id='breaker" + breaker_id + "mult'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column-bold'>Mult</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
    };

    var drawBreakerAmpForms = function (breaker_id) {
        var jquery_id = "#breaker" + breaker_id + "amp";

        $('.table-wrapper').append("<div class='row' id='breaker" + breaker_id + "amp'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column-bold'>Amps</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
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