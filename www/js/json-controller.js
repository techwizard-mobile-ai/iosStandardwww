/*global $:false, document:false, console:false, alert:false */
var JSONController = function () {

    this.getStationList = function () {
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
        console.log(stations);

        return stations;
    };

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
        console.log(breaker_list);

        return breaker_list;
    };

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
        console.log(breaker_info);

        return breaker_info;
    };

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
        console.log(regulator_list);

        return regulator_list;
    };

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
        console.log(regulator_info);

        return regulator_info;
    };

};