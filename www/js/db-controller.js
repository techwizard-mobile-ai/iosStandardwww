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
            console.log('ONLINE');
            return true;
        }
        else {
            console.log('OFFLINE');
            return false;
        }
    };    
    
    /**
     * This method adds a substation to the IndexedDB station list backup
     * @param {Object} sub_station
     * @return none
     */
    this.addSubStation = function(id, name) {
        var sub_station = {station_id: id, station_name: name},
            request = indexedDB.open('test5', 1);
        
        request.onerror = function (event) {
            console.log('Error', event.target.error.name);
        };
        
        request.onsuccess = function (event) {
            var db = event.target.result,
                objectStore = db.transaction('substation_list', 'readwrite').objectStore('substation_list');
                console.log(sub_station);
                objectStore.add(sub_station);
                console.log('Record added.');                
        };
    };
    
    /**
     * This method returns a list of sub_stations to the form_controller
     * when an internet connection is not available
     * @param none
     * @return {Array} the list of stations
     */
    this.getStationList = function () {
        if (isSupported) {
            var stations = [],
                openRequest = indexedDB.open('test5', 1);
            
            openRequest.onsuccess = function(event) {
               var db = event.target.result,
                   objectStore = db.transaction(['substation_list'], 'readonly').objectStore('substation_list'),
                   cursor = objectStore.openCursor();
                
                cursor.onsuccess = function(event) {
                    var result = event.target.result;                        
                    
                    if (result) {
                        console.log('station_name: ', result.value.station_name, 'station_id: ', result.value.station_id);
                        stations.push(result.value);
                        result.continue();
                    } else {
                        console.log(stations);
                    }
                };                    
            };
            
            openRequest.onerror = function(event) {
                console.log('Error');
                console.dir(event);
            };           
            return stations;
        } else {
            return [];
        }
    };
    
    function checkSupport () {
        if ('indexedDB' in window) {
            return true;
        } else {
            return false;
        }
    }
    
    function setOpenRequest () {
        if (isSupported) {
            openRequest = indexedDB.open('test5', 1);

            openRequest.onupgradeneeded = function(event) {
                console.log('Upgrading...');
                db = event.target.result;
                
                if (!db.objectStoreNames.contains('substation_list')) {
                    var objectStore = db.createObjectStore('substation_list', { keyPath: 'station_id', autoIncrement : false });
                    //objectStore.createIndex('station_id', 'station_id', {unique : true});
                    objectStore.createIndex('station_name', 'station_name', {unique : true});
                }
            };

            openRequest.onsuccess = function(event) {
                console.log('Success!');
                db = event.target.result;
            };

            openRequest.onerror = function(event) {
                console.log('Error');
                console.dir(event);
            };
        } else {
            openRequest = null;
            console.log('IndexedDB not supported');
        }
    }
    
    
};