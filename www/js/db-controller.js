/*global $:false, document:false, console:false, alert:false, window:false, indexedDB:false */

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
    
    var isSupported = checkSupport(),
        openRequest = setOpenRequest(),
        db;
            
    /**
     * This method checks to see if there is a connection to the internet available
     * @param none
     * @return {Boolean}
     */
    this.checkConnection = function () {
        if (window.navigator.onLine === true) {
            console.log("ONLINE");
            return true;
        }
        else {
            console.log("OFFLINE");
            return false;
        }
    };    
    
    function checkSupport () {
        if ("indexedDB" in window) {
            return true;
        } else {
            return false;
        }
    }
    
    function setOpenRequest () {
        if (isSupported) {
            openRequest = indexedDB.open("test", 1);

            openRequest.onupgradeneeded = function(event) {
                console.log("Upgrading...");
            };

            openRequest.onsuccess = function(event) {
                console.log("Success!");
                db = event.target.result;
            };

            openRequest.onerror = function(event) {
                console.log("Error");
                console.dir(event);
            };
        } else {
            openRequest = null;
            console.log("IndexedDB not supported");
        }
    }
    
    
};