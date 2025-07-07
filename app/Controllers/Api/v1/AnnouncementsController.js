"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const Files_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Files"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Visitors_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Visitors"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const route_model_binding_1 = require("@adonisjs/route-model-binding");
const Announcements_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Announcements"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class AnnouncementsController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const year = ctx.request.param('year');
        const month = ctx.request.param('month');
        const announcements = await Announcements_1.default.query()
            .select('announcements.uuid')
            .select('announcements.title')
            .select('announcements.slug')
            .select(Database_1.default.raw('YEAR(announcements.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(announcements.created_at) AS month'))
            .select('governments.slug AS government')
            .select('governments.alias AS government_alias')
            .select('governments.name AS government_name')
            .count('files.uuid', 'total_documents')
            .select('files.name AS top_name')
            .select('announcements.created_at')
            .join('governments', function () {
            this.on('governments.uuid', 'announcements.government').onNull('governments.deleted_at');
        })
            .join('files', function () {
            this.on('files.announcement', 'announcements.uuid').onNull('files.deleted_at');
        })
            .whereNull('announcements.deleted_at')
            .where('announcements.active', true)
            .whereRaw(year ? `YEAR(announcements.created_at) = ?` : `true = ?`, [year || true])
            .whereRaw(month ? `MONTH(announcements.created_at) = ?` : `true = ?`, [month || true])
            .where((table) => {
            table
                .orWhereRaw(q ? `announcements.title LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `announcements.description LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .orderBy('announcements.created_at', 'desc')
            .groupBy('announcements.uuid')
            .paginate(page, limit);
        const data = announcements.all().map((item) => {
            const announcement = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: announcement.uuid,
                title: announcement.title,
                slug: announcement.slug,
                year: announcement.year,
                month: announcement.month,
                government: announcement.government,
                governmentName: announcement.government_name,
                governmentAlias: announcement.government_alias,
                totalDocuments: announcement.total_documents,
                ext: path.extname(announcement.top_name),
                createdAt: announcement.createdAt,
            };
        });
        return { data, meta: announcements.getMeta() };
    }
    async archives(_ctx) {
        return await Adonis_Cache_1.default.remember('api:announcements:archives', cache_1.ONE_YEAR, async () => {
            const archives = await Announcements_1.default.query()
                .select(Database_1.default.raw("DISTINCT DATE_FORMAT(created_at, '%Y-%m') AS archive_date"))
                .whereNull('deleted_at')
                .where('active', true)
                .orderBy('archive_date', 'desc');
            return archives.map((archive) => archive.$extras.archive_date);
        });
    }
    async gov(ctx, government) {
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const announcements = await Announcements_1.default.query()
            .select('announcements.uuid')
            .select('announcements.title')
            .select('announcements.slug')
            .select(Database_1.default.raw('YEAR(announcements.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(announcements.created_at) AS month'))
            .select('governments.slug AS government')
            .select('governments.alias AS government_alias')
            .select('governments.name AS government_name')
            .count('files.uuid', 'total_documents')
            .select('files.name AS top_name')
            .select('announcements.created_at')
            .join('governments', function () {
            this.on('governments.uuid', 'announcements.government').onNull('governments.deleted_at');
        })
            .join('files', function () {
            this.on('files.announcement', 'announcements.uuid').onNull('files.deleted_at');
        })
            .whereNull('announcements.deleted_at')
            .where('announcements.active', true)
            .where('announcements.government', government.uuid)
            .orderBy('announcements.created_at', 'desc')
            .groupBy('announcements.uuid')
            .paginate(page, limit);
        const data = announcements.all().map((item) => {
            const announcement = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: announcement.uuid,
                title: announcement.title,
                slug: announcement.slug,
                year: announcement.year,
                month: announcement.month,
                government: announcement.government,
                governmentName: announcement.government_name,
                governmentAlias: announcement.government_alias,
                totalDocuments: announcement.total_documents,
                ext: path.extname(announcement.top_name),
                createdAt: announcement.createdAt,
            };
        });
        return { data, meta: announcements.getMeta() };
    }
    async detail(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:announcements/${slug}`, cache_1.ONE_MONTH, async () => {
            const announcement = await Announcements_1.default.query()
                .select('announcements.uuid')
                .select('announcements.title')
                .select('announcements.slug')
                .select('announcements.description')
                .select('announcements.created_at')
                .select('announcements.updated_at')
                .select(Database_1.default.raw('YEAR(announcements.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(announcements.created_at) AS month'))
                .select('governments.slug AS government')
                .select('governments.alias AS government_alias')
                .select('governments.name AS government_name')
                .join('governments', function () {
                this.on('governments.uuid', 'announcements.government').onNull('governments.deleted_at');
            })
                .whereNull('announcements.deleted_at')
                .where('announcements.active', true)
                .whereRaw('YEAR(announcements.created_at) = ?', [year])
                .whereRaw('MONTH(announcements.created_at) = ? ', [month])
                .where('announcements.slug', slug)
                .first();
            if (!announcement) {
                throw new NotFoundException_1.default();
            }
            const files = await Files_1.default.query()
                .whereNull('deleted_at')
                .where('announcement', announcement.uuid)
                .orderBy('created_at', 'asc');
            const documents = files.map((file) => ({
                uuid: file.uuid,
                name: file.name,
                ext: path.extname(file.name),
                download: Helpers_1.default.getAttachmentUrl(file.file),
                size: file.file.size,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
            }));
            return {
                uuid: announcement.uuid,
                title: announcement.title,
                slug: announcement.slug,
                year: announcement.$extras.year,
                month: announcement.$extras.month,
                description: announcement.description,
                government: announcement.government,
                governmentName: announcement.$extras.government_name,
                governmentAlias: announcement.$extras.government_alias,
                documents,
                createdAt: announcement.createdAt,
                updatedAt: announcement.updatedAt,
            };
        });
    }
    async count(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:announcements/${slug}:count`, cache_1.ONE_DAY / 2, async () => {
            const announcement = await Announcements_1.default.query()
                .select('shared')
                .whereNull('deleted_at')
                .where('active', true)
                .whereRaw('YEAR(created_at) = ?', [year])
                .whereRaw('MONTH(created_at) = ? ', [month])
                .where('slug', slug)
                .first();
            if (!announcement) {
                throw new NotFoundException_1.default();
            }
            const views = await Visitors_1.default.query()
                .count('uuid', 'views')
                .where('page', `/pengumuman/${year}/${month}/${slug}`)
                .first();
            return { shared: announcement.shared, views: views.$extras.views };
        });
    }
    async share(ctx) {
        const { year, month, slug } = ctx.request.params();
        const announcement = await Announcements_1.default.query()
            .whereNull('deleted_at')
            .where('active', true)
            .whereRaw('YEAR(created_at) = ?', [year])
            .whereRaw('MONTH(created_at) = ? ', [month])
            .where('slug', slug)
            .first();
        if (!announcement) {
            throw new NotFoundException_1.default();
        }
        const shared = announcement.shared + 1;
        announcement.shared = shared;
        await announcement.save();
        return { shared };
    }
    async related(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:announcements/${slug}:related`, cache_1.ONE_MONTH / 2, async () => {
            const announcement = await Announcements_1.default.query()
                .whereNull('deleted_at')
                .where('active', true)
                .whereRaw('YEAR(created_at) = ?', [year])
                .whereRaw('MONTH(created_at) = ? ', [month])
                .where('slug', slug)
                .first();
            if (!announcement) {
                throw new NotFoundException_1.default();
            }
            const related = await Announcements_1.default.query()
                .select('others.uuid')
                .select('others.title')
                .select('others.slug')
                .select(Database_1.default.raw('YEAR(others.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(others.created_at) AS month'))
                .select('governments.slug AS government')
                .select('governments.alias AS government_alias')
                .select('governments.name AS government_name')
                .count('files.uuid', 'total_documents')
                .select('files.name AS top_name')
                .select('others.created_at')
                .select(Database_1.default.raw(`MATCH(others.title, others.description) AGAINST('${announcement.title}' IN BOOLEAN MODE) AS relevance`))
                .join('announcements AS others', function () {
                this.onVal('others.uuid', '<>', announcement.uuid)
                    .onNull('others.deleted_at')
                    .onVal('others.active', true);
            })
                .join('governments', function () {
                this.on('governments.uuid', 'others.government').onNull('governments.deleted_at');
            })
                .join('files', function () {
                this.on('files.announcement', 'others.uuid').onNull('files.deleted_at');
            })
                .whereRaw(`MATCH(others.title, others.description) AGAINST('${announcement.title}' IN BOOLEAN MODE)`)
                .where('announcements.uuid', announcement.uuid)
                .groupBy('others.uuid')
                .orderBy('relevance', 'desc')
                .limit(5);
            return related.map((item) => {
                const announcement = { ...item.toJSON(), ...item.$extras };
                return {
                    uuid: announcement.uuid,
                    title: announcement.title,
                    slug: announcement.slug,
                    year: announcement.year,
                    month: announcement.month,
                    government: announcement.government,
                    governmentName: announcement.government_name,
                    governmentAlias: announcement.government_alias,
                    totalDocuments: announcement.total_documents,
                    ext: path.extname(announcement.top_name),
                    createdAt: announcement.createdAt,
                };
            });
        });
    }
}
__decorate([
    (0, route_model_binding_1.bind)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Governments_1.default]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "gov", null);
exports.default = AnnouncementsController;
//# sourceMappingURL=AnnouncementsController.js.map