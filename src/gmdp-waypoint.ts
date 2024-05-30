/**
 * Represents a basic waypoint, with latitude and longitude.
 *
 * If both are not specified, the waypoint is considered to be valid
 * but empty waypoint (these can exist in the data parameter, where
 * the coordinates have been specified in the URL path.
 */
export class GmdpWaypoint {
    lat?: number;
    lng?: number;

    constructor(
        lat: number | string | undefined,
        lng: number | string | undefined,
        private primary: boolean
    ) {
        if (lat !== undefined) {
            this.lat = Number(lat);
        }

        if (lng !== undefined) {
            this.lng = Number(lng);
        }
    }
}
