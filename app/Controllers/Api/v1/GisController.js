"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wifis_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Wifis"));
const Gmaps_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Gmaps"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Pariwisata_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Pariwisata"));
const WifiType_1 = global[Symbol.for('ioc.use')]("App/Enums/WifiType");
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class GisController {
    async wifis(_ctx) {
        return await Adonis_Cache_1.default.remember('api:gis:wifis', cache_1.ONE_MONTH, async () => {
            const wifis = await Wifis_1.default.query().whereNull('deleted_at').where('active', true);
            const data = wifis.map((item) => ({
                uuid: item.uuid,
                name: item.name,
                thumbnail: Helpers_1.default.getAttachmentUrl(item.image),
                type: WifiType_1.WifiTypeDesc[item.type],
                description: item.description,
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                address: item.address,
                district: item.district,
            }));
            return data;
        });
    }
    async hotels(_ctx) {
        return await Adonis_Cache_1.default.remember('api:gis:hotels', cache_1.ONE_MONTH, async () => {
            const hotels = await Pariwisata_1.default.hotel();
            const data = hotels.map((item) => ({
                id: Number(item.id),
                name: item.nama,
                description: item.deskripsi.trim() || null,
                thumbnail: item.image
                    ? `https://pariwisata.purwakartakab.go.id/assets/upload/hotel/${item.image}`
                    : null,
                address: item.alamat.trim() || null,
                url: Helpers_1.default.appendHttp(item.website || ''),
                phone: item.no_telp.trim() || null,
                latitude: Number(item.latitude) || null,
                longitude: Number(item.longitude) || null,
                openHour: item.jam_buka.trim() || null,
                closeHour: item.jam_tutup.trim() || null,
            }));
            return data;
        });
    }
    async tourism(_ctx) {
        return await Adonis_Cache_1.default.remember('api:gis:tourism', cache_1.ONE_MONTH, async () => {
            const tourism = await Pariwisata_1.default.wisata();
            const data = tourism.map((item) => ({
                id: Number(item.id),
                name: item.nama,
                description: item.deskripsi.trim() || null,
                thumbnail: item.image
                    ? `https://pariwisata.purwakartakab.go.id/assets/upload/wisata/${item.image}`
                    : null,
                address: item.alamat.trim() || null,
                url: Helpers_1.default.appendHttp(item.website || ''),
                phone: item.no_telp.trim() || null,
                latitude: Number(item.latitude) || null,
                longitude: Number(item.longitude) || null,
                openHour: item.jam_buka.trim() || null,
                closeHour: item.jam_tutup.trim() || null,
            }));
            return data;
        });
    }
    async culinaries(_ctx) {
        return await Adonis_Cache_1.default.remember('api:gis:culinaries', cache_1.ONE_MONTH, async () => {
            const culinaries = await Pariwisata_1.default.kuliner();
            const data = culinaries.map((item) => ({
                id: Number(item.id),
                name: item.nama,
                description: item.deskripsi.trim() || null,
                thumbnail: item.image
                    ? `https://pariwisata.purwakartakab.go.id/assets/upload/kuliner/${item.image}`
                    : null,
                address: item.alamat.trim() || null,
                url: Helpers_1.default.appendHttp(item.website || ''),
                phone: item.no_telp.trim() || null,
                latitude: Number(item.latitude) || null,
                longitude: Number(item.longitude) || null,
                openHour: item.jam_buka.trim() || null,
                closeHour: item.jam_tutup.trim() || null,
            }));
            return data;
        });
    }
    async minibuses(_ctx) {
        return await Adonis_Cache_1.default.remember('api:gis:minibuses', cache_1.ONE_MONTH, async () => {
            const minibuses = await Pariwisata_1.default.angkot();
            const data = minibuses.map((item) => ({
                id: Number(item.id),
                image: item.gambar
                    ? `https://pariwisata.purwakartakab.go.id/assets/upload/angkot/${item.gambar}`
                    : null,
                route: item.trayek || null,
                carCode: item.kode_mobil || null,
                track: item.lintasan || null,
            }));
            for (const { id, track } of data) {
                await Redis_1.default.set(`gis:minibuses:${id}`, track);
            }
            return data;
        });
    }
    async minibus(ctx) {
        const { id } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:gis:minibuses/${id}`, cache_1.ONE_MONTH, async () => {
            const track = await Redis_1.default.get(`gis:minibuses:${id}`);
            if (!track) {
                throw new NotFoundException_1.default();
            }
            const waypoints = [];
            const points = track.split('-').map((point) => point.trim());
            for await (const point of points) {
                const waypoint = await Gmaps_1.default.nearby(point + ' Purwakarta');
                if (!waypoint.latitude || !waypoint.longitude) {
                    continue;
                }
                waypoints.push(waypoint);
            }
            return waypoints;
        });
    }
}
exports.default = GisController;
//# sourceMappingURL=GisController.js.map