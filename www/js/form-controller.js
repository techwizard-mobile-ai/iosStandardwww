/*global $:false, document:false, console:false, alert:false, FormGenerator:false, DBController:false, SubStation:false, JSONController:false */

/**
 * This class controls form generation for substations
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the form controller class.
 */
var FormController = function (db_controller, json_controller, form_generator, current_date) {
    
    var that = this,
        navigation_controller;

    /**
     * Mutator for navigation controller
     * @param {Object} controller
     */
    this.setNavigationController = function(controller) {
        navigation_controller = controller;
    };

    /**
     * Open the specified substation form
     * @param {Event} event
     */
    this.openForm = function (event) {
        form_generator.clearMainMenu();
        //form_generator.clearButtonWrapper();

        form_generator.drawForm(event, current_date);

        db_controller.getEntry('regulator_list', event.data.id, drawRegulatorForms);
        db_controller.getEntry('breaker_list', event.data.id, drawBreakerForms);

        setTimeout(function() {
            form_generator.addBackButton(navigation_controller.showButtons);
            form_generator.addSubmitButton(submitForm);
            form_generator.addSendButton(sendForm);
        }, 500);

        if (event.data.reading) {
            setTimeout(function() {
                db_controller.getEntry('station_readings', event.data.reading, showReading);
            }, 1000);
        }
    };

    var showReading = function(reading) {
        for (var property in reading) {
            if(reading.hasOwnProperty(property)) {
                $('#' + property).val(reading[property]);
            }
        }
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
        navigation_controller.showButtons();
    };

    var sendForm = function () {
        if (that.checkConnection() === true) {
            json_controller.submitReading();
            navigation_controller.showButtons();
        } else {
            alert("Connection Unavailable: Please Try Again");
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