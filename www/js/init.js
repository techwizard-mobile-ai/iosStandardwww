/*global $:false, document:false, JSONController:false, FormController:false, console:false, window:false */

/**
 * Set up controller classes and begin application flow
 * @author Christopher Wilson
 * @version 9/16/2014
 */
$(document).ready(function () {

    var formController = new FormController();   
    
    formController.enableSetup();
    formController.showMenu();
    
});

//Check if IndexedDB is available
document.addEventListener("DOMContentLoaded", function () {
    if ("indexedDB" in window) {
        console.log("IndexedDB Available");
    } else {
        console.log("IndexedDB Unavailable");
    }
});
