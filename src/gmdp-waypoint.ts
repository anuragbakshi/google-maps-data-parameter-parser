/**
 * Represents a basic waypoint, with latitude and longitude.
 *
 * If both are not specified, the waypoint is considered to be valid
 * but empty waypoint (these can exist in the data parameter, where
 * the coordinates have been specified in the URL path.
 */
export class GmdpWaypoint {
    constructor(
        private lat: number,
        private lng: number,
        private primary: boolean
    ) {}
}
