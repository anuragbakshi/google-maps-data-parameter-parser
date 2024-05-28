import { PrBufNode } from "./prbufnode";
import { GmdpPoint } from "./gmdp-point";
import { GmdpWaypoint } from "./gmdp-waypoint";
const GmdpRoute = require("./gmdp-route");

import { GmdpException } from "./gmdp-exception";

/**
 * Represents a google maps data parameter, constructed from the passed URL.
 *
 * Utility methods defined below allow the user to easily extract interesting
 * information from the data parameter.
 */
const Gmdp = function (url) {
    let localSearchMapChildren;
    let child;
    this.prBufRoot = PrBufNode.create(url);
    this.mapType = "map";
    this.pins = [];

    if (this.prBufRoot == null) {
        throw new GmdpException("no parsable data parameter found");
    }

    //the main top node for routes is 4m; other urls (eg. streetview) feature 3m etc.
    let routeTop = null;
    let streetviewTop = null;

    for (child of this.prBufRoot.getChildren()) {
        if (child.id() === 1 && child.type() === "m") {
            localSearchMapChildren = child.getChildren();
        } else if (child.id() === 3 && child.type() === "m") {
            let mapTypeChildren = child.getChildren();
            if (mapTypeChildren && mapTypeChildren.length >= 1) {
                if (
                    mapTypeChildren[0].id() === 1 &&
                    mapTypeChildren[0].type() === "e"
                ) {
                    switch (mapTypeChildren[0].value()) {
                        case "1":
                            this.mapType = "streetview";
                            streetviewTop = child;
                            break;
                        case "3":
                            this.mapType = "earth";
                            break;
                    }
                }
            }
        } else if (child.id() === 4 && child.type() === "m") {
            routeTop = child;
        }
    }
    let pinData = null;
    let directions = null;
    let oldDirections = null;
    if (routeTop) {
        for (child of routeTop.getChildren()) {
            if (child.id() === 3 && child.type() === "m") {
                pinData = child;
            } else if (child.id() === 4 && child.type() === "m") {
                directions = child;
            } else if (child.id() === 1 && child.type() === "m") {
                //1m_ indicates the old route, pin, or search location
                //it seems that there can't be both a current route and an old route, for example
                //so we can treat its children as regular pins or directions
                for (let grandchild of child.getChildren()) {
                    if (grandchild.id() === 3 && grandchild.type() === "m") {
                        if (!pinData) {
                            pinData = grandchild;
                        }
                    } else if (
                        grandchild.id() === 4 &&
                        grandchild.type() === "m"
                    ) {
                        if (!directions) {
                            oldDirections = grandchild;
                        }
                    }
                }
            }
        }
    }
    if (pinData) {
        let pinPoint = this.parsePin(pinData);
        if (pinPoint) {
            this.pushPin(pinPoint);
        }
    }
    if (directions) {
        this.route = this.parseRoute(directions);
    } else if (oldDirections) {
        this.oldRoute = this.parseRoute(oldDirections);
    }
    if (streetviewTop) {
        let streetviewChildren = streetviewTop.getChildren();
        for (let streetviewChild of streetviewChildren) {
            if (streetviewChild.id() === 3 && streetviewChild.type() === "m") {
                let svInfos = streetviewChild.getChildren();
                for (let svInfo of svInfos) {
                    if (svInfo.id() === 2 && svInfo.type() === "e") {
                        if (svInfo.value() === "4") {
                            //!2e4!3e11 indicates a photosphere, rather than standard streetview
                            //but the 3e11 doesn't seem to matter too much (?)
                            this.mapType = "photosphere";
                        }
                    }
                    if (svInfo.id() === 6 && svInfo.type() === "s") {
                        this.svURL = decodeURIComponent(svInfo.value());
                    }
                }
            }
        }
    }
    if (localSearchMapChildren && localSearchMapChildren.length >= 1) {
        let lsmLat = undefined;
        let lsmLng = undefined;
        let lsmResolution = undefined;
        for (let field of localSearchMapChildren) {
            if (field.type() === "d") {
                switch (field.id()) {
                    case "1":
                        lsmResolution = field.value();
                        break;
                    case "2":
                        lsmLng = field.value();
                        break;
                    case "3":
                        lsmLat = field.value();
                        break;
                }
            }
        }
        if (
            lsmLat !== undefined &&
            lsmLng !== undefined &&
            lsmResolution !== undefined
        ) {
            this.localSearchMap = {
                centre: new GmdpPoint(lsmLat, lsmLng),
                resolution: lsmResolution,
            };
        }
    }
};

Gmdp.prototype.parsePin = function (pinNode) {
    let pinPoint = null;
    for (let primaryChild of pinNode.getChildren()) {
        if (primaryChild.id() === 8 && primaryChild.type() === "m") {
            const coordNodes = primaryChild.getChildren();
            if (
                coordNodes &&
                coordNodes.length >= 2 &&
                coordNodes[0].id() === 3 &&
                coordNodes[0].type() === "d" &&
                coordNodes[1].id() === 4 &&
                coordNodes[1].type() === "d"
            ) {
                pinPoint = new GmdpPoint(
                    coordNodes[0].value(),
                    coordNodes[1].value()
                );
            }
        }
    }
    return pinPoint;
};

Gmdp.prototype.parseRoute = function (directionsNode) {
    const route = new GmdpRoute();
    route.arrDepTimeType = "leave now"; //default if no value is specified
    route.avoidHighways = false;
    route.avoidTolls = false;
    route.avoidFerries = false;
    route.transitModePref = [];

    for (let primaryChild of directionsNode.getChildren()) {
        if (primaryChild.id() === 1 && primaryChild.type() === "m") {
            if (primaryChild.value() === "0") {
                route.pushWaypoint(
                    new GmdpWaypoint(undefined, undefined, true)
                );
            } else {
                let addedPrimaryWpt = false;
                const wptNodes = primaryChild.getChildren();
                for (let wptNode of wptNodes) {
                    if (wptNode.id() === 2) {
                        //this is the primary wpt, add coords
                        const coordNodes = wptNode.getChildren();
                        if (
                            coordNodes &&
                            coordNodes.length >= 2 &&
                            coordNodes[0].id() === 1 &&
                            coordNodes[0].type() === "d" &&
                            coordNodes[1].id() === 2 &&
                            coordNodes[1].type() === "d"
                        ) {
                            route.pushWaypoint(
                                new GmdpWaypoint(
                                    coordNodes[1].value(),
                                    coordNodes[0].value(),
                                    true
                                )
                            );
                        }
                        addedPrimaryWpt = true;
                    } else if (wptNode.id() === 3) {
                        //this is a secondary (unnamed) wpt
                        //
                        //but first, if we haven't yet added the primary wpt,
                        //then the coordinates are apparently not specified,
                        //so we should add an empty wpt
                        if (!addedPrimaryWpt) {
                            route.pushWaypoint(
                                new GmdpWaypoint(undefined, undefined, true)
                            );
                            addedPrimaryWpt = true;
                        }

                        //now proceed with the secondary wpt itself
                        const secondaryWpts = wptNode.getChildren();
                        if (secondaryWpts && secondaryWpts.length > 1) {
                            const coordNodes = secondaryWpts[0].getChildren();
                            if (
                                coordNodes &&
                                coordNodes.length >= 2 &&
                                coordNodes[0].id() === 1 &&
                                coordNodes[0].type() === "d" &&
                                coordNodes[1].id() === 2 &&
                                coordNodes[1].type() === "d"
                            ) {
                                route.pushWaypoint(
                                    new GmdpWaypoint(
                                        coordNodes[1].value(),
                                        coordNodes[0].value(),
                                        false
                                    )
                                );
                            }
                        }
                    } else if (wptNode.id() === 4 && wptNode.type() === "e") {
                        route.pushWaypoint(
                            new GmdpWaypoint(undefined, undefined, true)
                        );
                        addedPrimaryWpt = true;
                    }
                }
            }
        } else if (primaryChild.id() === 2 && primaryChild.type() === "m") {
            const routeOptions = primaryChild.getChildren();
            for (let routeOption of routeOptions) {
                if (routeOption.id() === 1 && routeOption.type() === "b") {
                    route.avoidHighways = true;
                } else if (
                    routeOption.id() === 2 &&
                    routeOption.type() === "b"
                ) {
                    route.avoidTolls = true;
                } else if (
                    routeOption.id() === 3 &&
                    routeOption.type() === "b"
                ) {
                    route.avoidFerries = true;
                } else if (
                    routeOption.id() === 4 &&
                    routeOption.type() === "e"
                ) {
                    route.setRoutePref(routeOption.value());
                } else if (
                    routeOption.id() === 5 &&
                    routeOption.type() === "e"
                ) {
                    route.addTransitModePref(routeOption.value());
                } else if (
                    routeOption.id() === 6 &&
                    routeOption.type() === "e"
                ) {
                    route.setArrDepTimeType(routeOption.value());
                }
                if (routeOption.id() === 8 && routeOption.type() === "j") {
                    route.arrDepTime = routeOption.value(); //as a unix timestamp
                }
            }
        } else if (primaryChild.id() === 3 && primaryChild.type() === "e") {
            route.setTransportation(primaryChild.value());
        } else if (primaryChild.id() === 4 && primaryChild.type() === "e") {
            route.setUnit(primaryChild.value());
        }
    }

    return route;
};

Gmdp.prototype.pushPin = function (wpt) {
    if (wpt instanceof GmdpPoint) {
        this.pins.push(wpt);
    }
};

/**
 * Returns the route defined by this data parameter.
 * @returns {GmdpRoute}
 */
Gmdp.prototype.getRoute = function () {
    return this.route;
};

/**
 * Returns the route defined by this data parameter.
 */
Gmdp.prototype.getOldRoute = function () {
    return this.oldRoute;
};

/**
 * Returns the main map type ("map", "earth").
 */
Gmdp.prototype.getMapType = function () {
    return this.mapType;
};

/**
 * Returns the main map type ("map", "earth").
 */
Gmdp.prototype.getStreetviewURL = function () {
    return this.svURL;
};

/**
 * Returns the pinned location.
 */
Gmdp.prototype.getPins = function () {
    return this.pins;
};

/**
 * Returns local search map data.
 */
Gmdp.prototype.getLocalSearchMap = function () {
    return this.localSearchMap;
};

module.exports = Gmdp;
