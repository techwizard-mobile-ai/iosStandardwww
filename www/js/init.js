/*global $:false, document:false, JSONController:false, FormController:false */
$(document).ready(function () {

    var jsonController = new JSONController(),
        formController = new FormController(jsonController);   
    
    formController.enableSetup();
    formController.showMenu();
    
});
