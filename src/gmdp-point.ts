export class GmdpPoint {
    lat: number;
    lng: number;

    constructor(lat: number | string, lng: number | string) {
        this.lat = Number(lat);
        this.lng = Number(lng);
    }
}
