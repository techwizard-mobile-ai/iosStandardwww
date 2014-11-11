/*global $:false, document:false, console:false, window:false */

/**
 * This class handles view rendering for form data received from the FormController class
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the FormGenerator class
 * @param {Object} json_controller
 * @returns none
 */
var FormGenerator = function () {
    
    /**
     * Clears the MainMenu div
     * @param none
     * @returns none
     */
    this.clearMainMenu = function () {
        $("#main-menu").html("");
    };
    
    /**
     * draw date select boxes for readings
     * @param {date} date
     * @returns none
     */
    this.drawDateForm = function (current_date) {
        $('#read-info').append("<br>Date: ");
        drawMonthForm(current_date.getMonth);
        drawDayForm(current_date.getDate());
        drawYearForm(current_date.getFullYear());
    };
    
    /**
     * draw form fields for each regulator
     * @param {Object} regulator_list
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
     * @param {Object} breaker_list
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
    
    var drawRegulatorFormHeader = function (regulator) { //TODO REFACTOR
        var regulator_name = regulator.regulator_name,
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
    
    var drawBreakerFormHeader = function (breaker) { //TODO REFACTOR
        var breaker_name = breaker.breaker_name,
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
        
    var drawMonthForm = function (current_month) {
        $('#read-info').append("<div class='select-wrapper' id='month-select-wrapper'></div>");
        $('#month-select-wrapper').append("<select name='start_month' id='month-select-form' class='select-custom'></select>");
        for (var i = 1; i < 13; i++) {
            $('#month-select-form').append("<option value='" + i + "'>" + i + "</option>");
        }
        $('#read-info').append("&nbsp;");
    };
    
    var drawDayForm = function (current_day) {
        $('#read-info').append("<div class='select-wrapper' id='day-select-wrapper'></div>");
        $('#day-select-wrapper').append("<select name='start_day' id='day-select-form' class='select-custom'></select>");
        for (var i = 1; i < 32; i++) {
            $('#day-select-form').append("<option value='" + i + "'>" + i + "</option>");
        }
         $('#read-info').append("&nbsp;");
    };
    
    var drawYearForm = function (current_year) {
        $('#read-info').append("<div class='select-wrapper' id='year-select-wrapper'></div>");
        $('#year-select-wrapper').append("<select name='start_year' id='year-select-form' class='select-custom'></select>");
        for (var i = 2000; i < current_year + 1 ; i++) {
            $('#year-select-form').append("<option value='" + i + "'>" + i + "</option>");
        }
         $('#read-info').append("&nbsp;");
    };
    
    
};