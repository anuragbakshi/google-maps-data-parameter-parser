declare class BasicNode<T> {
    val: T;
    children: this[];
    parent?: this;
    constructor(val: T);
    /**
     * Sets the parent node of this node.
     */
    setParentNode(node: this): void;
    /**
     * Gets the parent node of this node.
     */
    getParentNode(): this | undefined;
    /**
     * Adds a child node of this node.
     */
    addChild(node: this): void;
    /**
     * Gets the array of child nodes of this node.
     */
    getChildren(): this[];
    /**
     * Removes all the children of this node.
     */
    removeChildren(): void;
    /**
     * Recursively counts the number of all descendants, from children down, and
     * returns the total number.
     */
    getTotalDescendantCount(): number;
}

/**
 * Protocol Buffer implementation, which extends the functionality of Node
 * while specifically typing the stored value
 */
declare class PrBufNode extends BasicNode<{
    id: number;
    type: string;
    value: string;
}> {
    constructor(id: number, type: string, value: string);
    id(): number;
    type(): string;
    value(): string;
    /**
     * Compares the number of descendants with the value specified in the map element.
     * If all the children have not yet been added, we continue adding to this element.
     */
    findLatestIncompleteNode(): this;
    /**
     * Parses the input URL 'data' protocol buffer parameter into a tree
     */
    static create(urlToParse: string): PrBufNode | null;
}

declare class GmdpPoint {
    lat: number;
    lng: number;
    constructor(lat: number | string, lng: number | string);
}

/**
 * Represents a basic waypoint, with latitude and longitude.
 *
 * If both are not specified, the waypoint is considered to be valid
 * but empty waypoint (these can exist in the data parameter, where
 * the coordinates have been specified in the URL path.
 */
declare class GmdpWaypoint {
    primary: boolean;
    lat?: number;
    lng?: number;
    constructor(lat: number | string | undefined, lng: number | string | undefined, primary: boolean);
}

/**
 * Represents a basic route, comprised of an ordered list of
 * GmdpWaypoint objects.
 */
declare class GmdpRoute {
    route: GmdpWaypoint[];
    transportation?: "DRIVE" | "TRANSIT" | "BICYCLE" | "WALK" | "FLY" | {
        other: string;
    };
    unit?: "METRIC" | "IMPERIAL";
    arrDepTimeType?: "depart at" | "arrive by" | "last available" | "leave now";
    arrDepTime?: number;
    routePref?: "BEST_ROUTE" | "FEWER_TRANSFERS" | "LESS_WALKING";
    transitModePref: ("bus" | "subway" | "train" | "tram / light rail")[];
    avoidHighways: boolean;
    avoidTolls: boolean;
    avoidFerries: boolean;
    constructor();
    /**
     * Pushes a GmdpWaypoint on to the end of this GmdpRoute.
     */
    pushWaypoint(wpt: GmdpWaypoint): void;
    /**
     * Sets the mode of transportation.
     * If the passed parameter represents one of the integers normally used by Google Maps,
     * it will be interpreted as the relevant transport mode, and set as a string:
     * "car", "bike", "foot", "transit", "flight"
     */
    setTransportation(transportation: string): void;
    /**
     * Returns the mode of transportation (if any) for the route.
     */
    getTransportation(): "DRIVE" | "TRANSIT" | "BICYCLE" | "WALK" | "FLY" | {
        other: string;
    } | undefined;
    setUnit(unit: string): void;
    getUnit(): "METRIC" | "IMPERIAL" | undefined;
    setRoutePref(routePref: string): void;
    getRoutePref(): "BEST_ROUTE" | "FEWER_TRANSFERS" | "LESS_WALKING" | undefined;
    setArrDepTimeType(arrDepTimeType: string): void;
    getArrDepTimeType(): "depart at" | "arrive by" | "last available" | "leave now" | undefined;
    addTransitModePref(transitModePref: string): void;
    /**
     *
     * @returns {string[]}
     */
    getTransitModePref(): ("bus" | "subway" | "train" | "tram / light rail")[];
    /**
     * Returns the list of all waypoints belonging to this route.
     * @returns {GmdpWaypoint[]}
     */
    getAllWaypoints(): GmdpWaypoint[];
}

/**
 * Represents a google maps data parameter, constructed from the passed URL.
 *
 * Utility methods defined below allow the user to easily extract interesting
 * information from the data parameter.
 */
declare class Gmdp {
    prBufRoot: PrBufNode | null;
    mapType: "map" | "streetview" | "earth" | "photosphere";
    pins: GmdpPoint[];
    route?: GmdpRoute;
    oldRoute?: GmdpRoute;
    svURL?: string;
    localSearchMap?: {
        centre: GmdpPoint;
        resolution: string;
    };
    constructor(url: string);
    parsePin(pinNode: PrBufNode): GmdpPoint | null;
    parseRoute(directionsNode: PrBufNode): GmdpRoute;
    pushPin(wpt: GmdpPoint): void;
    /**
     * Returns the route defined by this data parameter.
     * @returns {GmdpRoute}
     */
    getRoute(): GmdpRoute | undefined;
    /**
     * Returns the route defined by this data parameter.
     */
    getOldRoute(): GmdpRoute | undefined;
    /**
     * Returns the main map type ("map", "earth").
     */
    getMapType(): "map" | "streetview" | "earth" | "photosphere";
    /**
     * Returns the main map type ("map", "earth").
     */
    getStreetviewURL(): string | undefined;
    /**
     * Returns the pinned location.
     */
    getPins(): GmdpPoint[];
    /**
     * Returns local search map data.
     */
    getLocalSearchMap(): {
        centre: GmdpPoint;
        resolution: string;
    } | undefined;
}

export { Gmdp, GmdpPoint, GmdpRoute, GmdpWaypoint };
