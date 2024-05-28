import { GmdpWaypoint } from "./gmdp-waypoint";
/**
 * Represents a basic route, comprised of an ordered list of
 * GmdpWaypoint objects.
 */
export class GmdpRoute {
    route: GmdpWaypoint[] = [];
    transportation?: string;
    unit?: "km" | "miles";
    routePref?: "best route" | "fewer transfers" | "less walking";
    arrDepTimeType?: "depart at" | "arrive by" | "last available";
    transitModePref: ("bus" | "subway" | "train" | "tram / light rail")[] = [];

    constructor() {}

    /**
     * Pushes a GmdpWaypoint on to the end of this GmdpRoute.
     */
    pushWaypoint(wpt: GmdpWaypoint) {
        if (wpt instanceof GmdpWaypoint) {
            this.route.push(wpt);
        }
    }

    /**
     * Sets the mode of transportation.
     * If the passed parameter represents one of the integers normally used by Google Maps,
     * it will be interpreted as the relevant transport mode, and set as a string:
     * "car", "bike", "foot", "transit", "flight"
     */
    setTransportation(transportation: string) {
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
    }

    /**
     * Returns the mode of transportation (if any) for the route.
     */
    getTransportation() {
        return this.transportation;
    }

    setUnit(unit: string) {
        switch (unit) {
            case "0":
                this.unit = "km";
                break;
            case "1":
                this.unit = "miles";
                break;
        }
    }

    getUnit() {
        return this.unit;
    }

    setRoutePref(routePref: string) {
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
    }

    getRoutePref() {
        return this.routePref;
    }

    setArrDepTimeType(arrDepTimeType: string) {
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
    }

    getArrDepTimeType() {
        return this.arrDepTimeType;
    }

    addTransitModePref(transitModePref: string) {
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
    }

    /**
     *
     * @returns {string[]}
     */
    getTransitModePref() {
        return this.transitModePref;
    }

    /**
     * Returns the list of all waypoints belonging to this route.
     * @returns {GmdpWaypoint[]}
     */
    getAllWaypoints() {
        return this.route;
    }
}
