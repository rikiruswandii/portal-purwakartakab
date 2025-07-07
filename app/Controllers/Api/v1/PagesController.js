"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pages"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class PagesController {
    async detail(ctx) {
        const slug = ctx.request.param('slug');
        return await Adonis_Cache_1.default.remember(`api:pages/${slug}`, cache_1.ONE_MONTH, async () => {
            const page = await Pages_1.default.query()
                .whereNull('deleted_at')
                .where('active', true)
                .where('slug', slug)
                .first();
            if (!page) {
                throw new NotFoundException_1.default();
            }
            const content = Helpers_1.default.parseJson(page.content);
            return {
                uuid: page.uuid,
                title: page.title,
                subtitle: page.subtitle,
                thumbnail: Helpers_1.default.getAttachmentUrl(page.thumbnail),
                content: typeof content === 'string' ? content.replace(/(\r\n|\n|\r)/gm, '') : content,
                createdAt: page.createdAt,
                updatedAt: page.updatedAt,
            };
        });
    }
}
exports.default = PagesController;
//# sourceMappingURL=PagesController.js.map