/*global $:false, document:false, console:false, alert:false, window:false */

/**
 * This class controls local file storage in the event that the main app server cannot be reached
 * @author Christopher Wilson
 * @version 9/14/2014
 */

/**
 * Constructor for the DBController class
 * @param none
 * @return none
 */
var DBController = function () {
    
    this.checkConnection = function () {
        if (window.navigator.onLine === true) {
            console.log("ONLINE");
        }
        else {
            console.log("OFFLINE");
        }
    };
};