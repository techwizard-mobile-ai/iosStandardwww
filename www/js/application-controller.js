/*global $:false, document:false, console:false, alert:false, FormGenerator:false, DBController:false, SubStation:false, JSONController:false */

/**
 * Created by cwilson on 12/18/2014.
 */

var ApplicationController = function () {
    var db_controller = new DBController(),
        json_controller = new JSONController(),
        form_generator = new FormGenerator(),
        current_date = new Date(),
        navigation_controller = new NavigationController(db_controller, json_controller, form_generator),
        form_controller = new FormController(db_controller, json_controller, form_generator, current_date),
        browse_controller = new BrowseController(db_controller, form_generator);

    var init = function () {
        navigation_controller.setFormController(form_controller);
        navigation_controller.setBrowseController(browse_controller);
        form_controller.setNavigationController(navigation_controller);
        browse_controller.setNavigationController(navigation_controller);
        browse_controller.setFormController(form_controller);
    };

    this.run = function () {
        init();
        navigation_controller.enableButtons();
    };

};