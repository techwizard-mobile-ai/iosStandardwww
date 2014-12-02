/*global $:false, document:false, console:false, alert:false, window:false, indexedDB:false */

/**
 * This class controls local file storage in the event that the main app server cannot be reached
 * @author Christopher Wilson
 * @version 9/14/2014
 */

/**
 * Constructor for the DBController class
 * @return none
 */
var DBController = function () {
    
    //CONSTANTS (TODO: conform to best practices yada yada yada)
    var DB_NAME = 'test6',
        DB_VERSION = 1;
    
    
    var isSupported = checkSupport(),
        openRequest = setOpenRequest(),
        db;
            
    /**
     * This method checks to see if there is a connection to the internet available
     * @return {Boolean}
     */
    this.checkConnection = function () {
        return window.navigator.onLine;
    };    
    
    /**
     * This method adds an entry to the specified indexedDB object store
     * @param entry the item to add
     * @param store_name the name of the object store
     * @return none
     */
    this.addEntry = function(entry, store_name) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function (event) {
            console.log('Error', event.target.error.name);
        };

        request.onsuccess = function(event) {
            var db = event.target.result,
                transaction = db.transaction(store_name, 'readwrite'),
                objectStore = transaction.objectStore(store_name);
                objectStore.add(entry);
        };
    };
    
    /**
     * This method returns a list of sub_stations to the form_controller
     * when an internet connection is not available
     * @param {Function} callback
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
    
    /**
     * This method returns a list of readings to the form_controller
     * that are stored in the local database waiting to be uploaded
     * @param {Function} callback
     * @return {Array} the list of readings
     */
    this.getReadings = function (callback) {
        var readings = [];
        if (isSupported) {
            var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
            
            openRequest.onsuccess = function(event) {
                var db =  event.target.result,
                    transaction = db.transaction(['station_readings'], 'readonly'),
                    objectStore = transaction.objectStore('station_readings'),
                    cursor = objectStore.openCursor();
                
                cursor.onsuccess = function(event) {
                    var result = event.target.result;
                    
                    if (result) {
                        readings.push(result.value);
                        result.continue();
                    } else {
                        callback(readings);
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
        return ('indexedDB' in window);
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
                    objectStore.createIndex('station_name', 'station_name', { unique : true });
                }

                if (!db.objectStoreNames.contains('breaker_list')) {
                    objectStore = db.createObjectStore('breaker_list', { keyPath: 'station_id', autoIncrement: false });
                }

                if (!db.objectStoreNames.contains('breaker_info')) {
                    objectStore = db.createObjectStore('breaker_info', { keyPath: 'breaker_id', autoIncrement: false });
                }

                if (!db.objectStoreNames.contains('regulator_list')) {
                    objectStore = db.createObjectStore('regulator_list', { keyPath: 'station_id', autoIncrement: true });
                }

                if (!db.objectStoreNames.contains('regulator_info')) {
                    objectStore = db.createObjectStore('regulator_info', { keyPath: 'regulator_id', autoIncrement: false });
                }
                
                if (!db.objectStoreNames.contains('station_readings')) {
                    objectStore =  db.createObjectStore('station_readings', { keyPath: 'read_id', autoIncrement : true });
                    objectStore.createIndex('station_read', ['station_name', 'date'] , { unique : true });
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
            
        req.onsuccess = function () { //unused event param removed
            console.log('object store cleared');
        };
        req.onerror = function (event) {
            console.error('clearObjectStore:', event.target.errorCode);
        };
    }
    
};