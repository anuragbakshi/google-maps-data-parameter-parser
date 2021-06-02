/**
 * Represents a basic waypoint, with latitude and longitude.
 *
 * If both are not specified, the waypoint is considered to be valid
 * but empty waypoint (these can exist in the data parameter, where
 * the coordinates have been specified in the URL path.
 */
const GmdpWaypoint = function(lat, lng, primary) {
    this.lat = lat;
    this.lng = lng;
    this.primary = !!primary;
}

module.exports = GmdpWaypoint;
