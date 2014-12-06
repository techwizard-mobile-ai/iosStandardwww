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
    var url = "http://programmedby.me/cemc_apparatus/controller/RestController.php",
        that = this;

    var request = function (request) {
        var request_json,
            response;
        request_json = $.ajax({
            url: url,
            type: "POST",
            data: request,
            dataType: "json",
            async: false
        }).responseText;

        response = JSON.parse(request_json);
        return response;
    };

    /**
     * Request the list of substations from the app server
     * @param {Function} callback
     * @return none
     */
    this.getStationList = function (callback) {
        callback(request({"request": "station_list"}));
    };

    /*
    this.getStationList = function (callback) {
    	var station_json,
    		stations;

    	station_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "station_list"
            },
            dataType: "json",
            async: false
        }).responseText;

        stations = JSON.parse(station_json);

        callback(stations);
    };
    */
    
    /**
     * Request a list of breakers from the selected substation
     * @param {Object} event
     * @return {Object} breaker_list
     */
    this.getBreakerList = function (event) {
        return request({"request": "get_breakers", "station_id": event.data.id});
    };

    /*
    this.getBreakerList = function (event) {
    	var breaker_json,
    		breaker_list;

    	breaker_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "get_breakers",
                "station_id": event.data.id
            },
            dataType: "json",
            async: false
        }).responseText;

        breaker_list = JSON.parse(breaker_json);

        return breaker_list;
    };
    */
    
    /**
     * Request information on a specific breaker
     * @param {Object} breaker
     * @return {Object} breaker_info
     */
    this.getBreakerInfo = function (breaker) {
        return request({ "request" : "build_breaker", "breaker_id" : breaker.breaker_id });
    };

    /*
    this.getBreakerInfo = function (breaker) {
    	var breaker_json,
            breaker_info;

        breaker_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "build_breaker",
                "breaker_id": breaker.breaker_id
            },
            dataType: "json",
            async: false
        }).responseText;

        breaker_info = JSON.parse(breaker_json);
        return breaker_info;
    };
    */

    /**
     * Request a list of regulators for the selected substation
     * @param {Object} event
     * @return {Object} regulator_list
     */
    this.getRegulatorList = function (event) {
        return request({ "request" : "get_regulators", "station_id" : event.data.id });
    };

    /*
    this.getRegulatorList = function (event) {
    	var regulator_json,
    		regulator_list;

    	regulator_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "get_regulators",
                "station_id": event.data.id
            },
            dataType: "json",
            async: false
        }).responseText;

        regulator_list = JSON.parse(regulator_json);

        return regulator_list;
    };
    */

    /**
     * Request information for a specific regulator
     * @param {Object} regulator
     * @return {Object} regulator information
     */
    this.getRegulatorInfo = function (regulator) {
        return request({ "request" : "build_regulator", "regulator_id" : regulator.regulator_id });
    };

    /*
    this.getRegulatorInfo = function (regulator) {
    	var regulator_json,
            regulator_info;

        regulator_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "build_regulator",
                "regulator_id": regulator.regulator_id
            },
            dataType: "json",
            async: false
        }).responseText;

        regulator_info = JSON.parse(regulator_json);

        return regulator_info;
    };
    */

};