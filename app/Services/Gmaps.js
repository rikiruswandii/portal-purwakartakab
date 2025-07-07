"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("./Helpers"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class Gmaps {
    constructor() {
        this.axios = Helpers_1.default.axios({
            baseURL: 'https://maps.googleapis.com/maps/api',
            params: { key: Env_1.default.get('GMAPS_APIKEY') },
            cache: {
                maxAge: 15 * 60 * 1000,
            },
        });
    }
    async lookup(address) {
        const { data } = await this.axios.get('geocode/json', { params: { address, sensor: 'false' } });
        if (data.status !== 'OK') {
            return { latitude: null, longitude: null };
        }
        const { location } = data.results[0].geometry;
        return { latitude: location.lat, longitude: location.lng };
    }
    async reverse(latitude, longitude, plain = false) {
        const latlng = [latitude, longitude].join(',');
        const { data } = await this.axios.get('geocode/json', { params: { latlng, sensor: 'false' } });
        if (data.status !== 'OK') {
            return { address: null };
        }
        return plain ? data.results[0] : data.results[0].formatted_address;
    }
    async nearby(keyword) {
        const radius = 50000;
        const coords = `${Env_1.default.get('GMAPS_LATITUDE')}, ${Env_1.default.get('GMAPS_LONGITUDE')}`;
        const { data } = await this.axios.get('place/nearbysearch/json', {
            params: { keyword, location: coords, radius },
        });
        if (data.status !== 'OK') {
            return { latitude: null, longitude: null };
        }
        const { location } = data.results[0].geometry;
        return { latitude: location.lat, longitude: location.lng };
    }
}
exports.default = new Gmaps();
//# sourceMappingURL=Gmaps.js.map