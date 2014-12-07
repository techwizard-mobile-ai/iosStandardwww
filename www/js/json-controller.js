/*global $:false, document:false, console:false, alert:false, DBController:false */

/**
 * This class controls JSON requests to and from the main app server
 * @author Christopher Wilson
 * @version 9/16/2014
 */

/**
 * Constructor for the JSONController class
 * @return none
 */
var JSONController = function () {
    var rest_url = "http://programmedby.me/cemc_apparatus/controller/RestController.php",
        login_url = "http://programmedby.me/cemc_apparatus/view/login.php",
        submit_url = "http://programmedby.me/cemc_apparatus/view/processread.php",
        that = this;



    this.submitReading = function() {
        sendLogin();
        $.post(submit_url, $('#station-form').serialize(), function (ret) {
            if (ret !== "") {
                alert("SUCCESS");
            }
        });
    };

    /**
     * Request the list of substations from the app server
     * @param {Function} callback
     * @return none
     */
    this.getStationList = function (callback) {
        callback(request({"request": "station_list"}));
    };
    
    /**
     * Request a list of breakers from the selected substation
     * @param {Object} event
     * @return {Object} breaker_list
     */
    this.getBreakerList = function (event) {
        return request({"request": "get_breakers", "station_id": event.data.id});
    };
    
    /**
     * Request information on a specific breaker
     * @param {Object} breaker
     * @return {Object} breaker_info
     */
    this.getBreakerInfo = function (breaker) {
        return request({ "request" : "build_breaker", "breaker_id" : breaker.breaker_id });
    };

    /**
     * Request a list of regulators for the selected substation
     * @param {Object} event
     * @return {Object} regulator_list
     */
    this.getRegulatorList = function (event) {
        return request({ "request" : "get_regulators", "station_id" : event.data.id });
    };

    /**
     * Request information for a specific regulator
     * @param {Object} regulator
     * @return {Object} regulator information
     */
    this.getRegulatorInfo = function (regulator) {
        return request({ "request" : "build_regulator", "regulator_id" : regulator.regulator_id });
    };

    var request = function (request) {
        var request_json,
            response;
        request_json = $.ajax({
            url: rest_url,
            type: "POST",
            data: request,
            dataType: "json",
            async: false
        }).responseText;

        response = JSON.parse(request_json);
        return response;
    };

    var sendLogin = function() {
        $.post(login_url, {
            "username": "cemc",
            "password": "cemc"
        });
    };

};