"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const Infographics_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Infographics"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class InfographicsController {
    async index(ctx) {
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const infographics = await Infographics_1.default.query()
            .whereNull('deleted_at')
            .where('active', true)
            .where('is_popup', false)
            .orderBy('created_at', 'desc')
            .paginate(page, limit);
        const data = infographics.all().map((announcement) => ({
            uuid: announcement.uuid,
            title: announcement.title,
            image: Helpers_1.default.getAttachmentUrl(announcement.image),
            createdAt: announcement.createdAt,
            updatedAt: announcement.updatedAt,
        }));
        return { data, meta: infographics.getMeta() };
    }
    async pinned(_ctx) {
        return await Adonis_Cache_1.default.remember('api:infographics:pinned', cache_1.ONE_WEEK, async () => {
            const announcement = await Infographics_1.default.query()
                .whereNull('deleted_at')
                .where('active', true)
                .where('is_popup', true)
                .orderBy('created_at', 'desc')
                .first();
            if (!announcement) {
                throw new NotFoundException_1.default();
            }
            return {
                uuid: announcement.uuid,
                title: announcement.title,
                image: Helpers_1.default.getAttachmentUrl(announcement.image),
                action: announcement.href,
                createdAt: announcement.createdAt,
                updatedAt: announcement.updatedAt,
            };
        });
    }
}
exports.default = InfographicsController;
//# sourceMappingURL=InfographicsController.js.map