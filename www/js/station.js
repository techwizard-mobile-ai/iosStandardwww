function Station(name, id) {
    "use strict";

    var stationName = name,
        stationID = id;

    Object.defineProperties(this, {
        "stationName": {
            get: function () {
                return stationName;
            },
            set: function (newName) {
                stationName = newName;
            }
        },
        "stationID": {
            get: function () {
                return stationID;
            },
            set: function (newID) {
                stationID = newID;
            }
        }
    });

}
