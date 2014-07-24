/* global $ */
/* global Station */

function StationController() {
    "use strict";

    var stationList = [];

    this.getStationList = function () {
        //get our raw json
        var station_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "station_list"
            },
            dataType: "json",
            async: false
        }).responseText,
            stations,
            station_name;

        //Convert JSON to JS object
        stations = JSON.parse(station_json);

        stations.rows.forEach(function (station) {
            var currentStation = new Station(station.station_name, station.station_id);
            this.stationList.push(currentStation);
        });

    };

    this.showMenu = function () {
        $("#main-menu").html("");
        this.stationList.forEach(function (station) {
            var id = '#' + station.stationID,
                station_html = "<div class='button float-left' id='" + station.stationID + "'>" + station.stationName + "</div>";
            $('#main-menu').append(station_html);
            $(id).click({
                id: station.stationID,
                name: station.stationName
            }, this.openForm);
        });
    };

    //main ajax call to build station forms
    this.openForm = function (event) {
        $('#main-menu').html("");
        var station_json = $.ajax({
            url: "http://127.0.0.1/cemc_apparatus/controller/RestController.php",
            type: "POST",
            data: {
                "request": "build_forms",
                "station_id": event.data.id
            },
            dataType: "json",
            async: false
        }).responseText,
            station_info,
            regulator_list,
            breaker_list;

        station_info = JSON.parse(station_json);
        regulator_list = station_info.rows[0];
        breaker_list = station_info.rows[1];
        drawStationForm(event.data.id, event.data.name, regulator_list, breaker_list);
    };



}
