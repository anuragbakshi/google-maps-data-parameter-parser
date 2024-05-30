"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/gmdp.ts
var gmdp_exports = {};
__export(gmdp_exports, {
  Gmdp: () => Gmdp,
  GmdpPoint: () => GmdpPoint,
  GmdpRoute: () => GmdpRoute,
  GmdpWaypoint: () => GmdpWaypoint
});
module.exports = __toCommonJS(gmdp_exports);

// src/basic-node.ts
var BasicNode = class {
  constructor(val) {
    this.val = val;
    this.children = [];
  }
  /**
   * Sets the parent node of this node.
   */
  setParentNode(node) {
    this.parent = node;
    node.children[node.children.length] = this;
  }
  /**
   * Gets the parent node of this node.
   */
  getParentNode() {
    return this.parent;
  }
  /**
   * Adds a child node of this node.
   */
  addChild(node) {
    node.parent = this;
    this.children[this.children.length] = node;
  }
  /**
   * Gets the array of child nodes of this node.
   */
  getChildren() {
    return this.children;
  }
  /**
   * Removes all the children of this node.
   */
  removeChildren() {
    for (let child of this.children) {
      delete child.parent;
    }
    this.children = [];
  }
  /**
   * Recursively counts the number of all descendants, from children down, and
   * returns the total number.
   */
  getTotalDescendantCount() {
    let count = 0;
    for (let child of this.children) {
      count += child.getTotalDescendantCount();
    }
    return count + this.children.length;
  }
};

// src/prbufnode.ts
var PrBufNode = class _PrBufNode extends BasicNode {
  constructor(id, type, value) {
    super({ id, type, value });
  }
  id() {
    return this.val.id;
  }
  type() {
    return this.val.type;
  }
  value() {
    return this.val.value;
  }
  /**
   * Compares the number of descendants with the value specified in the map element.
   * If all the children have not yet been added, we continue adding to this element.
   */
  findLatestIncompleteNode() {
    if (this.val.type === "m" && Number(this.val.value) > this.getTotalDescendantCount() || void 0 === this.parent) {
      return this;
    } else {
      return this.parent.findLatestIncompleteNode();
    }
  }
  /**
   * Parses the input URL 'data' protocol buffer parameter into a tree
   */
  static create(urlToParse) {
    let rootNode = null;
    let re = /data=!([^?&]+)/;
    let dataArray = urlToParse.match(re);
    if (!dataArray || dataArray.length < 1) {
      re = /mv:!([^?&]+)/;
      dataArray = urlToParse.match(re);
    }
    if (dataArray && dataArray.length >= 1) {
      rootNode = new _PrBufNode(0, "root", "root");
      let workingNode = rootNode;
      let elemArray = dataArray[1].split("!");
      for (let i = 0; i < elemArray.length; i++) {
        const elemRe = /^([0-9]+)([a-z])(.+)$/;
        const elemValsArray = elemArray[i].match(elemRe);
        if (elemValsArray && elemValsArray.length > 3) {
          const elemNode = new _PrBufNode(
            parseInt(elemValsArray[1]),
            elemValsArray[2],
            elemValsArray[3]
          );
          workingNode.addChild(elemNode);
          workingNode = elemNode.findLatestIncompleteNode();
        }
      }
    }
    return rootNode;
  }
};

// src/gmdp-point.ts
var GmdpPoint = class {
  constructor(lat, lng) {
    this.lat = Number(lat);
    this.lng = Number(lng);
  }
};

// src/gmdp-waypoint.ts
var GmdpWaypoint = class {
  constructor(lat, lng, primary) {
    this.primary = primary;
    if (lat !== void 0) {
      this.lat = Number(lat);
    }
    if (lng !== void 0) {
      this.lng = Number(lng);
    }
  }
};

// src/gmdp-route.ts
var GmdpRoute = class {
  constructor() {
    this.route = [];
    this.transitModePref = [];
    this.avoidHighways = false;
    this.avoidTolls = false;
    this.avoidFerries = false;
  }
  /**
   * Pushes a GmdpWaypoint on to the end of this GmdpRoute.
   */
  pushWaypoint(wpt) {
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
  setTransportation(transportation) {
    switch (transportation) {
      case "0":
        this.transportation = "DRIVE";
        break;
      case "1":
        this.transportation = "BICYCLE";
        break;
      case "2":
        this.transportation = "WALK";
        break;
      case "3":
        this.transportation = "TRANSIT";
        break;
      case "4":
        this.transportation = "FLY";
        break;
      default:
        this.transportation = { other: transportation };
        break;
    }
  }
  /**
   * Returns the mode of transportation (if any) for the route.
   */
  getTransportation() {
    return this.transportation;
  }
  setUnit(unit) {
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
  setRoutePref(routePref) {
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
  setArrDepTimeType(arrDepTimeType) {
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
  addTransitModePref(transitModePref) {
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
};

// src/gmdp-exception.ts
var GmdpException = class _GmdpException extends Error {
  constructor(message) {
    super(message);
    this.name = "GmdpException";
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, _GmdpException);
    }
  }
};

// src/gmdp.ts
var Gmdp = class {
  constructor(url) {
    this.pins = [];
    let localSearchMapChildren;
    let child;
    this.prBufRoot = PrBufNode.create(url);
    this.mapType = "map";
    if (this.prBufRoot == null) {
      throw new GmdpException("no parsable data parameter found");
    }
    let routeTop = null;
    let streetviewTop = null;
    for (child of this.prBufRoot.getChildren()) {
      if (child.id() === 1 && child.type() === "m") {
        localSearchMapChildren = child.getChildren();
      } else if (child.id() === 3 && child.type() === "m") {
        let mapTypeChildren = child.getChildren();
        if (mapTypeChildren && mapTypeChildren.length >= 1) {
          if (mapTypeChildren[0].id() === 1 && mapTypeChildren[0].type() === "e") {
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
          for (let grandchild of child.getChildren()) {
            if (grandchild.id() === 3 && grandchild.type() === "m") {
              if (!pinData) {
                pinData = grandchild;
              }
            } else if (grandchild.id() === 4 && grandchild.type() === "m") {
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
      let lsmLat = void 0;
      let lsmLng = void 0;
      let lsmResolution = void 0;
      for (let field of localSearchMapChildren) {
        if (field.type() === "d") {
          switch (field.id()) {
            case 1:
              lsmResolution = field.value();
              break;
            case 2:
              lsmLng = field.value();
              break;
            case 3:
              lsmLat = field.value();
              break;
          }
        }
      }
      if (lsmLat !== void 0 && lsmLng !== void 0 && lsmResolution !== void 0) {
        this.localSearchMap = {
          centre: new GmdpPoint(lsmLat, lsmLng),
          resolution: lsmResolution
        };
      }
    }
  }
  parsePin(pinNode) {
    let pinPoint = null;
    for (let primaryChild of pinNode.getChildren()) {
      if (primaryChild.id() === 8 && primaryChild.type() === "m") {
        const coordNodes = primaryChild.getChildren();
        if (coordNodes && coordNodes.length >= 2 && coordNodes[0].id() === 3 && coordNodes[0].type() === "d" && coordNodes[1].id() === 4 && coordNodes[1].type() === "d") {
          pinPoint = new GmdpPoint(
            coordNodes[0].value(),
            coordNodes[1].value()
          );
        }
      }
    }
    return pinPoint;
  }
  parseRoute(directionsNode) {
    const route = new GmdpRoute();
    route.arrDepTimeType = "leave now";
    route.avoidHighways = false;
    route.avoidTolls = false;
    route.avoidFerries = false;
    route.transitModePref = [];
    for (let primaryChild of directionsNode.getChildren()) {
      if (primaryChild.id() === 1 && primaryChild.type() === "m") {
        if (primaryChild.value() === "0") {
          route.pushWaypoint(
            new GmdpWaypoint(void 0, void 0, true)
          );
        } else {
          let addedPrimaryWpt = false;
          const wptNodes = primaryChild.getChildren();
          for (let wptNode of wptNodes) {
            if (wptNode.id() === 2) {
              const coordNodes = wptNode.getChildren();
              if (coordNodes && coordNodes.length >= 2 && coordNodes[0].id() === 1 && coordNodes[0].type() === "d" && coordNodes[1].id() === 2 && coordNodes[1].type() === "d") {
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
              if (!addedPrimaryWpt) {
                route.pushWaypoint(
                  new GmdpWaypoint(void 0, void 0, true)
                );
                addedPrimaryWpt = true;
              }
              const secondaryWpts = wptNode.getChildren();
              if (secondaryWpts && secondaryWpts.length > 1) {
                const coordNodes = secondaryWpts[0].getChildren();
                if (coordNodes && coordNodes.length >= 2 && coordNodes[0].id() === 1 && coordNodes[0].type() === "d" && coordNodes[1].id() === 2 && coordNodes[1].type() === "d") {
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
                new GmdpWaypoint(void 0, void 0, true)
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
          } else if (routeOption.id() === 2 && routeOption.type() === "b") {
            route.avoidTolls = true;
          } else if (routeOption.id() === 3 && routeOption.type() === "b") {
            route.avoidFerries = true;
          } else if (routeOption.id() === 4 && routeOption.type() === "e") {
            route.setRoutePref(routeOption.value());
          } else if (routeOption.id() === 5 && routeOption.type() === "e") {
            route.addTransitModePref(routeOption.value());
          } else if (routeOption.id() === 6 && routeOption.type() === "e") {
            route.setArrDepTimeType(routeOption.value());
          }
          if (routeOption.id() === 8 && routeOption.type() === "j") {
            route.arrDepTime = routeOption.value();
          }
        }
      } else if (primaryChild.id() === 3 && primaryChild.type() === "e") {
        route.setTransportation(primaryChild.value());
      } else if (primaryChild.id() === 4 && primaryChild.type() === "e") {
        route.setUnit(primaryChild.value());
      }
    }
    return route;
  }
  pushPin(wpt) {
    if (wpt instanceof GmdpPoint) {
      this.pins.push(wpt);
    }
  }
  /**
   * Returns the route defined by this data parameter.
   * @returns {GmdpRoute}
   */
  getRoute() {
    return this.route;
  }
  /**
   * Returns the route defined by this data parameter.
   */
  getOldRoute() {
    return this.oldRoute;
  }
  /**
   * Returns the main map type ("map", "earth").
   */
  getMapType() {
    return this.mapType;
  }
  /**
   * Returns the main map type ("map", "earth").
   */
  getStreetviewURL() {
    return this.svURL;
  }
  /**
   * Returns the pinned location.
   */
  getPins() {
    return this.pins;
  }
  /**
   * Returns local search map data.
   */
  getLocalSearchMap() {
    return this.localSearchMap;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Gmdp,
  GmdpPoint,
  GmdpRoute,
  GmdpWaypoint
});
//!2e4!3e11 indicates a photosphere, rather than standard streetview
//# sourceMappingURL=gmdp.js.map