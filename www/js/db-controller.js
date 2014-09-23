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
    
    /**
     * This method adds a substation to the IndexedDB station list backup
     * @param {Object} sub_station
     * @return none
     */
    this.addSubStation = function(sub_station) {
        var request = indexedDB.open("test1", 1);
        
        request.onerror = function (event) {
            console.log("Error", event.target.error.name);
        };
        
        request.onsuccess = function (event) {
            var db = event.target.result,
                objectStore = db.transaction("substation_list", "readwrite").objectStore("substation_list");
                objectStore.add(sub_station);
                console.log("Record added.");                
        };
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
            openRequest = indexedDB.open("test1", 1);

            openRequest.onupgradeneeded = function(event) {
                console.log("Upgrading...");
                db = event.target.result;
                
                if (!db.objectStoreNames.contains("substation_list")) {
                    var objectStore = db.createObjectStore("substation_list", { autoIncrement : true });
                    objectStore.createIndex("id", "id", {unique:true});
                    objectStore.createIndex("name", "name", {unique:true});
                }
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