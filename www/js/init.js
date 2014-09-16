/*global $:false, document:false, JSONController:false, FormController:false */

/**
 * Set up controller classes and begin application flow
 * @author Christopher Wilson
 * @version 9/16/2014
 */
$(document).ready(function () {

    var jsonController = new JSONController(),
        formController = new FormController(jsonController);   
    
    formController.enableSetup();
    formController.showMenu();
    
});
