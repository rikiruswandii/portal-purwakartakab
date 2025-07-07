"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Regents_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Regents"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class RegentsController {
    async index(_ctx) {
        return await Adonis_Cache_1.default.remember('api:regents', cache_1.ONE_YEAR, async () => {
            const regents = await Regents_1.default.query().whereNull('deleted_at').orderBy('start', 'desc');
            return regents.map((regent) => ({
                uuid: regent.uuid,
                chief: regent.chief,
                chiefPhoto: Helpers_1.default.getAttachmentUrl(regent.chiefPhoto),
                deputy: regent.deputy,
                deputyPhoto: Helpers_1.default.getAttachmentUrl(regent.deputyPhoto),
                start: Number(luxon_1.DateTime.fromJSDate(regent.start).toFormat('yyyy')),
                end: Number(luxon_1.DateTime.fromJSDate(regent.end).toFormat('yyyy')),
                caption: regent.description,
            }));
        });
    }
    async current(_ctx) {
        return await Adonis_Cache_1.default.remember('api:regents/current', cache_1.ONE_YEAR, async () => {
            const regent = await Regents_1.default.query().whereNull('deleted_at').orderBy('start', 'desc').first();
            if (!regent) {
                throw new NotFoundException_1.default();
            }
            return {
                uuid: regent.uuid,
                chief: regent.chief,
                chiefPhoto: Helpers_1.default.getAttachmentUrl(regent.chiefPhoto),
                deputy: regent.deputy,
                deputyPhoto: Helpers_1.default.getAttachmentUrl(regent.deputyPhoto),
                start: Number(luxon_1.DateTime.fromJSDate(regent.start).toFormat('yyyy')),
                end: Number(luxon_1.DateTime.fromJSDate(regent.end).toFormat('yyyy')),
                caption: regent.description,
            };
        });
    }
}
exports.default = RegentsController;
//# sourceMappingURL=RegentsController.js.map