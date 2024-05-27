const GmdpWaypoint = require("./gmdp-waypoint");
/**
 * Represents a basic route, comprised of an ordered list of
 * GmdpWaypoint objects.
 */
var GmdpRoute = function () {
    this.route = [];
};

/**
 * Pushes a GmdpWaypoint on to the end of this GmdpRoute.
 */
GmdpRoute.prototype.pushWaypoint = function (wpt) {
    if (wpt instanceof GmdpWaypoint) {
        this.route.push(wpt);
    }
};

/**
 * Sets the mode of transportation.
 * If the passed parameter represents one of the integers normally used by Google Maps,
 * it will be interpreted as the relevant transport mode, and set as a string:
 * "car", "bike", "foot", "transit", "flight"
 */
GmdpRoute.prototype.setTransportation = function (transportation) {
    switch (transportation) {
        case "0":
            this.transportation = "car";
            break;
        case "1":
            this.transportation = "bike";
            break;
        case "2":
            this.transportation = "foot";
            break;
        case "3":
            this.transportation = "transit";
            break;
        case "4":
            this.transportation = "flight";
            break;
        default:
            this.transportation = transportation;
            break;
    }
};

/**
 * Returns the mode of transportation (if any) for the route.
 */
GmdpRoute.prototype.getTransportation = function () {
    return this.transportation;
};

GmdpRoute.prototype.setUnit = function (unit) {
    switch (unit) {
        case "0":
            this.unit = "km";
            break;
        case "1":
            this.unit = "miles";
            break;
    }
};

GmdpRoute.prototype.getUnit = function () {
    return this.unit;
};

GmdpRoute.prototype.setRoutePref = function (routePref) {
    switch (routePref) {
        case "0":
        case "1":
            this.routePref = "best route";
            break;
        case "2":
            this.routePref = "fewer transfers";
            break;
        case "3":
            this.routePref = "less walking";
            break;
    }
};

/**
 *
 * @returns {string|*}
 */
GmdpRoute.prototype.getRoutePref = function () {
    return this.routePref;
};

GmdpRoute.prototype.setArrDepTimeType = function (arrDepTimeType) {
    switch (arrDepTimeType) {
        case "0":
            this.arrDepTimeType = "depart at";
            break;
        case "1":
            this.arrDepTimeType = "arrive by";
            break;
        case "2":
            this.arrDepTimeType = "last available";
            break;
    }
};

/**
 *
 * @returns {string|*}
 */
GmdpRoute.prototype.getArrDepTimeType = function () {
    return this.arrDepTimeType;
};

GmdpRoute.prototype.addTransitModePref = function (transitModePref) {
    //there can be multiple preferred transit modes, so we store them in an array
    //we assume there will be no duplicate values, but it probably doesn't matter
    //even if there are
    switch (transitModePref) {
        case "0":
            this.transitModePref.push("bus");
            break;
        case "1":
            this.transitModePref.push("subway");
            break;
        case "2":
            this.transitModePref.push("train");
            break;
        case "3":
            this.transitModePref.push("tram / light rail");
            break;
    }
};

/**
 *
 * @returns {string[]}
 */
GmdpRoute.prototype.getTransitModePref = function () {
    return this.transitModePref;
};

/**
 * Returns the list of all waypoints belonging to this route.
 * @returns {GmdpWaypoint[]}
 */
GmdpRoute.prototype.getAllWaypoints = function () {
    return this.route;
};

module.exports = GmdpRoute;
