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
    
    //CONSTANTS (TODO: conform to best practices yada yada yada)
    var DB_NAME = 'test5',
        DB_VERSION = 2;
    
    
    var isSupported = checkSupport(),
        openRequest = setOpenRequest(),
        db;
            
    /**
     * This method checks to see if there is a connection to the internet available
     * @param none
     * @return {Boolean}
     */
    this.checkConnection = function () {
        return window.navigator.onLine;
    };    
    
    /**
     * This method adds a substation to the IndexedDB station list backup
     * @param {Object} sub_station
     * @return none
     */
    this.addSubStation = function(id, name) {
        var sub_station = {station_id: id, station_name: name},
            request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function (event) {
            console.log('Error', event.target.error.name);
        };
        
        request.onsuccess = function (event) {
            var db = event.target.result,
                objectStore = db.transaction('substation_list', 'readwrite').objectStore('substation_list');
                objectStore.add(sub_station);
        };
    };
    
    /**
     * This method adds a substation reading (converted to a serialized object) to
     * the indexedDB when internet access is unavailable
     * @param {Object} station_read
     * @return none
     */
    this.addReading = function(station_read) {
        var request =  indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function (event) {
            console.log('Error', event.target.error.name);
        };
        
        request.onsuccess = function(event) {
            var db = event.target.result,
                transaction = db.transaction('station_readings', 'readwrite'),
                objectStore = transaction.objectStore('station_readings');
                objectStore.add(station_read);
        };
    };
    
    /**
     * This method returns a list of sub_stations to the form_controller
     * when an internet connection is not available
     * @param none
     * @return {Array} the list of stations
     */
    this.getStationList = function (callback) {
        var stations = [];
        if (isSupported) {
            var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
            
            openRequest.onsuccess = function(event) {
               var db = event.target.result,
                   transaction = db.transaction(['substation_list'], 'readonly'),
                   objectStore = transaction.objectStore('substation_list'),
                   cursor = objectStore.openCursor();
                
                cursor.onsuccess = function(event) {
                    var result = event.target.result;                        
                    
                    if (result) {
                        stations.push(result.value);
                        result.continue();
                    } else {
                        callback(stations);
                    }
                };                    
            };
            
            openRequest.onerror = function(event) {
                console.log('Error');
                console.dir(event);
            };
            
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
            openRequest = indexedDB.open(DB_NAME, DB_VERSION);

            openRequest.onupgradeneeded = function(event) {
                console.log('Upgrading...');
                db = event.target.result;
                
                var objectStore;
                
                if (!db.objectStoreNames.contains('substation_list')) {
                    objectStore = db.createObjectStore('substation_list', { keyPath: 'station_id', autoIncrement : false });
                    objectStore.createIndex('station_name', 'station_name', {unique : true});
                }
                
                if (!db.objectStoreNames.contains('station_readings')) {
                    objectStore =  db.createObjectStore('station_readings', { keyPath: 'read_id', autoIncrement : true });
                    objectStore.createIndex('station_name', 'station_name', {unique : false});
                    objectStore.createIndex('date', 'date', {unique : false});
                }
                    
            };

            openRequest.onsuccess = function(event) {
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
    
    function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }
    
    function clearObjectStore (store_name) {
        var store = getObjectStore(store_name, 'readwrite'),
            req = store.clear();
            
        req.onsuccess = function (event) {
            console.log('object store cleared');
        };
        req.onerror = function (event) {
            console.error('clearObjectStore:', event.target.errorCode);
        };
    }
    
};