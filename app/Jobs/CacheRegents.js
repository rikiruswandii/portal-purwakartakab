"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Regents_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Regents"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
class CacheRegents {
    constructor() {
        this.key = 'cache:regents';
    }
    async handle(_job) {
        const regents = await Regents_1.default.query().whereNull('deleted_at').orderBy('start', 'desc');
        const data = regents.map((regent) => ({
            uuid: regent.uuid,
            chief: regent.chief,
            chiefPhoto: Helpers_1.default.getAttachmentUrl(regent.chiefPhoto),
            deputy: regent.deputy,
            deputyPhoto: Helpers_1.default.getAttachmentUrl(regent.deputyPhoto),
            start: Number(DateTime.fromJSDate(regent.start).toFormat('yyyy')),
            end: Number(DateTime.fromJSDate(regent.end).toFormat('yyyy')),
            caption: regent.description,
        }));
        if (data[0]) {
            await Adonis_Cache_1.default.update('api:regents/current', data[0], cache_1.ONE_YEAR);
        }
        await Adonis_Cache_1.default.update('api:regents', data, cache_1.ONE_YEAR);
    }
}
exports.default = CacheRegents;
//# sourceMappingURL=CacheRegents.js.map