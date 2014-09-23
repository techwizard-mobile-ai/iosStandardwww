/**
 * This file contains all the model objects used by the IndexedDB to store
 * substation information when an internet connection is not available
 */

var SubStation = function (id, name) {
    this.id = id;
    this.name = name;
};