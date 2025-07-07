"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const he_1 = __importDefault(require("he"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Services_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Services"));
class ServicesController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const services = await Services_1.default.query()
            .select('services.uuid')
            .select('services.name')
            .select('services.slug')
            .select('services.caption')
            .select('services.alias')
            .select('services.logo')
            .select('services.url')
            .select('services.created_at')
            .select('governments.slug AS government')
            .select('governments.alias AS government_alias')
            .select('governments.name AS government_name')
            .join('governments', function () {
            this.on('governments.uuid', 'services.government').onNull('governments.deleted_at');
        })
            .whereNull('services.deleted_at')
            .where((table) => {
            table
                .orWhereRaw(q ? `services.name LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `services.caption LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .orderBy('services.sort', 'asc')
            .paginate(page, limit);
        const data = services.all().map((service) => ({
            uuid: service.uuid,
            name: service.name,
            alias: service.alias,
            slug: service.slug,
            caption: he_1.default.decode(service.caption),
            logo: Helpers_1.default.getAttachmentUrl(service.logo),
            url: service.url,
            government: service.government,
            governmentName: service.$extras.government_name,
            governmentAlias: service.$extras.government_alias,
            createdAt: service.createdAt,
        }));
        return { data, meta: services.getMeta() };
    }
}
exports.default = ServicesController;
//# sourceMappingURL=ServicesController.js.map