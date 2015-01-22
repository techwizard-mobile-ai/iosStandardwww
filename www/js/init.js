/*global $:false, document:false, JSONController:false, FormController:false, console:false, window:false */

/**
 * Set up controller classes and begin application flow
 * @author Christopher Wilson
 * @version 9/16/2014
 */
$(document).ready(function () {

    var applicationController = new ApplicationController();
    
    applicationController.run();
    
});

//fastclick initialize
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

//Check if IndexedDB is available
document.addEventListener("DOMContentLoaded", function () {
    if ("indexedDB" in window) {
        console.log("IndexedDB Available");
    } else {
        console.log("IndexedDB Unavailable");
    }
});
