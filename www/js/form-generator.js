/*global $:false, document:false, console:false, window:false */

/**
 * This class handles view rendering for form data received from the FormController class
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the FormGenerator class
 * @returns none
 */
var FormGenerator = function () {

    var nav_wrapper = $('#nav-wrapper'),
        content = $('#content');

    /**
     * draw form fields for each regulator
     * @param {Object} regulator
     * @return none
     */
    this.drawRegulatorForms = function (regulator) {
        drawRegulatorFormHeader(regulator); 
        drawRegulatorAForms(regulator.regulator_id);
        drawRegulatorBForms(regulator.regulator_id);
        drawRegulatorCForms(regulator.regulator_id);        
    };
    
    /**
     * draw form fields for each breaker
     * @param {Object} breaker
     * @return none
     */
    this.drawBreakerForms = function (breaker) {
        drawBreakerFormHeader(breaker); 
        drawBreakerCountForms(breaker.breaker_id); 
        if (breaker.breaker_has_mult !== 0) { 
            drawBreakerMultForms(breaker.breaker_id);
        }
        if (breaker.breaker_has_amp !== 0) {
            drawBreakerAmpForms(breaker.breaker_id);
        }
    };

    /**
     * Draw Top Level Form Elements
     * @param {Event} event
     * @param {Date} current_date
     * @return none
     */
    this.drawForm = function(event, current_date) {
        var form_string = '<form id="station-form" action = "#" method = "post"></form>';

        content.append(form_string);
        nav_wrapper.append('<div class="inner-banner" id="read-info">Station: ' + event.data.name + '&nbsp;<br></div>');

        drawDateForm(current_date);
        drawHiddenFields(event, getReadDate(current_date));
    };

    this.addSubmitButton = function(callback) {
        content.append('<input type="button" class="button-dark-right" id="submit" name="submit" value="SUBMIT" />');
        $('#submit').click(callback);
    };

    this.addSendButton = function(callback) {
        content.append('<input type="button" class="button-dark-right" id="send" name="send" value="SEND" />');
        $('#send').click(callback);
    };

    this.addBackButton = function(callback) {
        content.append('<input type="button" class="button-dark" id="back" name="back" value="BACK" />');
        $('#back').click(callback);
    };

    this.drawViewHeaders = function() {
        content.append('<div class="row-top-header"></div>');
        $('.row-top-header').append('<div class="column-header">Station Name: </div>');
        $('.row-top-header').append('<div class="column-header">Date:</div>');
        $('.row-top-header').append('<div class="column-header">Actions:</div>');
    };

    var drawDateForm = function (current_date) {
        $('#read-info').append("Date: ");
        drawMonthForm(current_date.getMonth());
        drawDayForm(current_date.getDate());
        drawYearForm(current_date.getFullYear());
    };

    var getReadDate = function (current_date) {
        var date_string = "";
        date_string = date_string + current_date.getFullYear() + "-" + (current_date.getMonth() + 1) + "-" + current_date.getDate();
        return date_string;
    };

    var drawHiddenFields = function(event, read_date) {
        $('#station-form').append('<input type="hidden" name="station-id" value="' + event.data.id + '"></input>');
        $('#station-form').append('<input type="hidden" name="station_name" value="' + event.data.name + '"></input>');
        $('#station-form').append('<input type="hidden" name="date" value="' + read_date + '"></input>');
    };
    
    var drawRegulatorFormHeader = function (regulator) {
        var regulator_name = regulator.regulator_name,
            id,
            jquery_id;
        
            if (regulator_name === null) {
                regulator_name = '';
            }
        
            id = "regulator" + regulator_name + "header";
            jquery_id = "#" + id;

        content.append("<div class='row-top-header' id='" + id + "'></div>");
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

        content.append("<div class='row' id='a" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>A</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_count' id='r" + regulator_id + "a_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_raise' id='r" + regulator_id + "a_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_lower' id='r" + regulator_id + "a_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_amp' id='r" + regulator_id + "a_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_high_voltage' id='r" + regulator_id + "a_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_low_voltage' id='r" + regulator_id + "a_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "a_comments' id='r" + regulator_id + "a_comments' value='' /></div>");
    };

    var drawRegulatorBForms = function (regulator_id) {
        var jquery_id = "#b" + regulator_id;

        content.append("<div class='row' id='b" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>B</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_count' id='r" + regulator_id + "b_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_raise' id='r" + regulator_id + "b_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_lower' id='r" + regulator_id + "b_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_amp' id='r" + regulator_id + "b_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_high_voltage' id='r" + regulator_id + "b_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_low_voltage' id='r" + regulator_id + "b_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "b_comments' id='r" + regulator_id + "b_comments' value='' /></div>");
    };

    var drawRegulatorCForms = function (regulator_id) {
        var jquery_id = "#c" + regulator_id;

        content.append("<div class='row' id='c" + regulator_id + "'></div>");
        $(jquery_id).append("<div class='column-small'>C</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_count' id='r" + regulator_id + "c_count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_raise' id='r" + regulator_id + "c_raise' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_lower' id='r" + regulator_id + "c_lower' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_amp' id='r" + regulator_id + "c_amp' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_high_voltage' id='r" + regulator_id + "c_high_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_low_voltage' id='r" + regulator_id + "c_low_voltage' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='r" + regulator_id + "c_comments' id='r" + regulator_id + "c_comments' value='' /></div>");
    };
    
    var drawBreakerFormHeader = function (breaker) {
        var breaker_name = breaker.breaker_name,
            id = "header" + breaker_name,
            jquery_id = "#" + id;

        content.append("<div class='row-header' id='" + id + "'></div>");
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

        content.append("<div class='row' id='breaker" + breaker_id + "'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "count' id='b" + breaker_id + "count' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_flag' id='b" + breaker_id + "a_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_flag' id='b" + breaker_id + "b_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_flag' id='b" + breaker_id + "c_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "n_flag' id='b" + breaker_id + "n_flag' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "battery' id='b" + breaker_id + "battery' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "comments' id='b" + breaker_id + "comments' value='' /></div>");
    };

    var drawBreakerMultForms = function (breaker_id) {
        var jquery_id = "#breaker" + breaker_id + "mult";

        content.append("<div class='row' id='breaker" + breaker_id + "mult'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column-bold'>Mult</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_mult' id='b" + breaker_id + "a_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_mult' id='b" + breaker_id + "b_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_mult' id='b" + breaker_id + "c_mult' value='' /></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
    };

    var drawBreakerAmpForms = function (breaker_id) {
        var jquery_id = "#breaker" + breaker_id + "amp";

        content.append("<div class='row' id='breaker" + breaker_id + "amp'></div>");
        $(jquery_id).append("<div class='column-small'></div>");
        $(jquery_id).append("<div class='column-bold'>Amps</div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "a_amps' id='b" + breaker_id + "a_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "b_amps' id='b" + breaker_id + "b_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'><input type='text' class='text-box' name='b" + breaker_id + "c_amps' id='b" + breaker_id + "c_amps' value='' /></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
        $(jquery_id).append("<div class='column'></div>");
    };
        
    var drawMonthForm = function (current_month) {
        $('#read-info').append("<div class='select-wrapper' id='month-select-wrapper'></div>");
        $('#month-select-wrapper').append("<select name='month' id='month-select-form' class='select-custom'></select>");
        for (var i = 1; i < 13; i++) {
            if (i == (current_month + 1)) {
                $('#month-select-form').append("<option value='" + i + "' selected='selected'>" + i + "</option>");
            }
            else {
                $('#month-select-form').append("<option value='" + i + "'>" + i + "</option>");
            }
        }
        $('#read-info').append("&nbsp;");
    };
    
    var drawDayForm = function (current_day) {
        $('#read-info').append("<div class='select-wrapper' id='day-select-wrapper'></div>");
        $('#day-select-wrapper').append("<select name='day' id='day-select-form' class='select-custom'></select>");
        for (var i = 1; i < 32; i++) {
            if (i == current_day) {
                $('#day-select-form').append("<option value='" + i + "' selected='selected'>" + i + "</option>");
            } 
            else {
                $('#day-select-form').append("<option value='" + i + "'>" + i + "</option>");
            }
        }
        $('#read-info').append("&nbsp;");
    };
    
    var drawYearForm = function (current_year) {
        $('#read-info').append("<div class='select-wrapper' id='year-select-wrapper'></div>");
        $('#year-select-wrapper').append("<select name='year' id='year-select-form' class='select-custom'></select>");
        for (var i = 2000; i < current_year + 1 ; i++) {
            if (i == current_year) {
                $('#year-select-form').append("<option value='" + i + "' selected='selected'>" + i + "</option>");
            } 
            else {
                $('#year-select-form').append("<option value='" + i + "'>" + i + "</option>");
            }
        }
        $('#read-info').append("&nbsp;");
    };

};