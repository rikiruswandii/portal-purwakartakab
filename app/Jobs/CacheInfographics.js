"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const Infographics_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Infographics"));
class CacheInfographics {
    constructor() {
        this.key = 'cache:infographics';
    }
    async handle(_job) {
        const pinned = await Infographics_1.default.query()
            .whereNull('deleted_at')
            .where('active', true)
            .where('is_popup', true)
            .orderBy('created_at', 'desc')
            .first();
        if (pinned) {
            const popup = {
                uuid: pinned.uuid,
                title: pinned.title,
                image: Helpers_1.default.getAttachmentUrl(pinned.image),
                action: pinned.href,
                createdAt: pinned.createdAt,
                updatedAt: pinned.updatedAt,
            };
            await Adonis_Cache_1.default.update('api:infographics:pinned', popup, cache_1.ONE_WEEK);
        }
        else {
            await Adonis_Cache_1.default.delete('api:infographics:pinned');
        }
    }
}
exports.default = CacheInfographics;
//# sourceMappingURL=CacheInfographics.js.map