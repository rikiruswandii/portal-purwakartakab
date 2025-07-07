"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const GovType_1 = global[Symbol.for('ioc.use')]("App/Enums/GovType");
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class GovernmentsController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const type = ctx.request.input('type');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const governments = await Governments_1.default.query()
            .whereNull('deleted_at')
            .where((table) => {
            table
                .orWhereRaw(q ? `name LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `alias LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .whereRaw(type ? 'type LIKE ?' : 'true = ?', [type || true])
            .orderBy('type', 'desc')
            .orderBy('name', 'asc')
            .paginate(page, limit);
        const data = governments.all().map((item) => {
            const government = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: government.uuid,
                name: government.name,
                slug: government.slug,
                logo: Helpers_1.default.getAttachmentUrl(government.logo),
                alias: government.alias,
                address: government.address,
                email: government.email,
                phone: government.phone,
                fax: government.fax,
                url: government.url,
                type: GovType_1.GovTypeDesc[government.type],
                createdAt: government.createdAt,
            };
        });
        return { data, meta: governments.getMeta() };
    }
    async page(ctx) {
        const pages = ['announcements', 'services', 'officers'];
        const page = ctx.request.param('page');
        if (!pages.includes(page)) {
            throw new NotFoundException_1.default();
        }
        const governments = await Governments_1.default.query()
            .select('governments.*')
            .join(page, function () {
            this.on(`${page}.government`, `governments.uuid`);
            this.onNull(`${page}.deleted_at`);
            if (['announcements', 'officers'].includes(page)) {
                this.onVal(`${page}.active`, true);
            }
        })
            .whereNull('governments.deleted_at')
            .groupBy('governments.uuid')
            .orderBy('governments.created_at', 'asc');
        return governments.map((government) => ({
            uuid: government.uuid,
            name: government.name,
            slug: government.slug,
            logo: Helpers_1.default.getAttachmentUrl(government.logo),
            alias: government.alias,
            address: government.address,
            email: government.email,
            phone: government.phone,
            fax: government.fax,
            url: government.url,
            type: GovType_1.GovTypeDesc[government.type],
            createdAt: government.createdAt,
        }));
    }
}
exports.default = GovernmentsController;
//# sourceMappingURL=GovernmentsController.js.map