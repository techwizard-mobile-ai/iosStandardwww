function Station() {
    "use strict";

    var stationName = "",
        stationID = "";

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
