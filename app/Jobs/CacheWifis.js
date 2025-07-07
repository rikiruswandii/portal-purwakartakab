"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wifis_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Wifis"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const WifiType_1 = global[Symbol.for('ioc.use')]("App/Enums/WifiType");
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
class CacheWifis {
    constructor() {
        this.key = 'cache:wifis';
    }
    async handle(_job) {
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
        await Adonis_Cache_1.default.update('api:gis:wifis', data, cache_1.ONE_MONTH);
    }
}
exports.default = CacheWifis;
//# sourceMappingURL=CacheWifis.js.map