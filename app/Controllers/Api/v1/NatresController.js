"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Natres_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Natres"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class NatresController {
    async index(ctx) {
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const natreses = await Natres_1.default.query()
            .select('natres.*')
            .select('articles.slug')
            .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(articles.created_at) AS month'))
            .leftJoin('articles', 'articles.uuid', 'natres.article')
            .whereNull('natres.deleted_at')
            .orderBy('natres.created_at', 'asc')
            .groupBy('natres.uuid')
            .paginate(page, limit);
        const data = natreses.all().map((item) => {
            const natres = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: natres.uuid,
                title: natres.title,
                image: Helpers_1.default.getAttachmentUrl(natres.image),
                caption: natres.caption,
                slug: natres.slug,
                year: natres.year,
                month: natres.month,
                createdAt: natres.createdAt,
                updatedAt: natres.updatedAt,
            };
        });
        return { data, meta: natreses.getMeta() };
    }
}
exports.default = NatresController;
//# sourceMappingURL=NatresController.js.map