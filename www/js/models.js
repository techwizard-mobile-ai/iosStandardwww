/**
 * This file contains all the model objects used by the IndexedDB to store
 * substation information when an internet connection is not available
 */

var SubStation = function (id, name) {
    this.station_id = id;
    this.station_name = name;
};