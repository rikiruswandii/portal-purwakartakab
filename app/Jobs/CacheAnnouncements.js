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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const Files_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Files"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const Announcements_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Announcements"));
class CacheAnnouncements {
    constructor() {
        this.key = 'cache:announcements';
    }
    async handle(job) {
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
            .where('announcements.slug', job.data)
            .first();
        if (!announcement)
            return;
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
        const data = {
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
        await Adonis_Cache_1.default.update(`api:announcements/${job.data}`, data, cache_1.ONE_MONTH);
    }
}
exports.default = CacheAnnouncements;
//# sourceMappingURL=CacheAnnouncements.js.map