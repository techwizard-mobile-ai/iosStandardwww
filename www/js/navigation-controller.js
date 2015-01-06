/*global $:false, document:false, console:false, alert:false, FormGenerator:false, DBController:false, SubStation:false, JSONController:false */

/**
 * Created by cwilson on 12/18/2014.
 */

var NavigationController = function (db_controller, json_controller, form_generator) {

    var form_controller,
        browse_controller,
        main_menu = $('#main-menu'),
        setup = $('#setup'),
        show_stations = $('#show-stations'),
        view_readings = $('#view-readings');
        that = this;

    /**
     * Mutator for form controller
     * @param {Object} controller
     */
    this.setFormController = function (controller) {
        form_controller = controller;
    };

    /**
     * Mutator for browse controller
     * @param {Object} controller
     */
    this.setBrowseController = function (controller) {
        browse_controller = controller;
    };

    /**
     * This method checks to see if there is a connection to the internet available
     * @return {Boolean}
     */
    this.checkConnection = function () {
        return window.navigator.onLine;
    };

    /**
     * Adds click event handler to the main buttons
     * @return none
     */
    this.enableButtons = function () {
        console.log('enabling buttons...');
        setup.bind('click', enableSetup);
        show_stations.bind('click', enableNew);
        view_readings.bind('click', enableView);
    };

    /**
     * Show navigation buttons
     * @return none
     */
    this.toggleButtons = function () {
        setup.toggle();
        show_stations.toggle();
        view_readings.toggle();
        main_menu.toggle();
    };

    var enableSetup = function () {
        console.log('update local db button clicked...');
        status.toggle();
        setupDB();
    };

    var enableNew = function () {
        console.log('new reading button clicked...');
        that.toggleButtons();
        toggleMainMenu();
        showStationList();
    };

    var enableView = function () {
        that.toggleButtons();
        form_generator.clearMainMenu();
        toggleMainMenu();
        db_controller.getEntries('station_readings', browse_controller.listReadings);
    };

    var toggleMainMenu = function () {
        form_generator.clearMainMenu();

    };

    /**
     * Builds the database when starting up the application
     * @return none
     */
    var setupDB = function () {
        if (that.checkConnection() === true) {
            json_controller.getStationList(addStationComponentsToDB);
        } else {
            $('#status').append("Connection Unavailable: Please Try Again <br />");
        }
    };

    var addStationComponentsToDB = function(stations) {
        stations.forEach(function (station) {
            db_controller.addEntry({station_id: station.station_id, station_name: station.station_name}, 'substation_list');
        });
        addRegulatorListToDB(stations);
        addBreakerListToDB(stations);
    };

    var addRegulatorListToDB = function(stations) {
        stations.forEach(function (station) {
            var regulator_list = json_controller.getRegulatorList({data: {id: station.station_id}}),
                regulator_ids = [];

            regulator_list.forEach(function (regulator){
                var regulator_info = json_controller.getRegulatorInfo(regulator);

                db_controller.addEntry(regulator_info, 'regulator_info');
                regulator_ids.push(regulator.regulator_id);
            });

            db_controller.addEntry({station_id: station.station_id, regulator_list: regulator_ids}, 'regulator_list');
        });
    };

    var addBreakerListToDB = function(stations) {
        stations.forEach(function (station) {
            var breaker_list = json_controller.getBreakerList({data: {id: station.station_id}}),
                breaker_ids = [];

            breaker_list.forEach(function (breaker){
                var breaker_info = json_controller.getBreakerInfo(breaker);

                db_controller.addEntry(breaker_info, 'breaker_info');
                breaker_ids.push(breaker.breaker_id);
            });

            db_controller.addEntry({station_id: station.station_id, breaker_list: breaker_ids}, 'breaker_list');
        });
    };

    /**
     * Queries the JSONController instance for a list of available substations
     * and generates the html to display them for the user
     */
    var showStationList = function () {
        db_controller.getEntries('substation_list', generateStationButtons);
    };

    var generateStationButtons = function (stations) {
        stations.forEach(function(station) {
            var id = '#' + station.station_id,
                station_name = "<div class='button float-left' id='" + station.station_id + "'>" + station.station_name + "</div>";
            main_menu.append(station_name);
            $(id).click({
                id: station.station_id,
                name: station.station_name,
                reading: null
            }, form_controller.openForm);
        });
        main_menu.append("<div class='button float-left' id='back'>Back</div>");
        $('#back').click(that.toggleButtons);

    };

};