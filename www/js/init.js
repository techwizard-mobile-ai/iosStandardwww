/*global $:false, document:false */
$(document).ready(function () {

    var jsonController = new JSONController(),
        formController = new FormController(jsonController);   
    
    formController.enableSetup();
    formController.showMenu();
    
});
