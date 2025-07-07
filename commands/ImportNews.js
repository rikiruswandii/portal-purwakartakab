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
const mrmime_1 = require("mrmime");
const News_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/News"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const helpers_1 = require("@poppinss/utils/build/helpers");
const standalone_1 = require("@adonisjs/core/build/standalone");
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class ImportNews extends standalone_1.BaseCommand {
    async run() {
        const request = Helpers_1.default.axios({
            baseURL: 'https://purwakartakab.go.id',
            params: { key: 'kucingKeren22@' },
        });
        const { data: { data }, } = await request.get('api/export_berita');
        const category = await Categories_1.default.query()
            .select('uuid')
            .where('slug', 'news-uncategorized')
            .first();
        const enhancer = await Users_1.default.first();
        for await (const index of Object.keys(data)) {
            const item = data[index];
            if (item.title.trim() === '')
                continue;
            const { pathname } = new URL(item.thumbnail);
            const extname = path.extname(pathname).replace('.', '');
            const mimeType = (0, mrmime_1.lookup)(extname);
            const name = `news/${(0, helpers_1.cuid)()}.${extname}`;
            let size = null;
            try {
                const image = await request.get(item.thumbnail.replace('https://purwakartakab.go.id/', ''), { responseType: 'stream' });
                await Drive_1.default.putStream(name, image.data);
                const stats = await Drive_1.default.getStats(name);
                size = stats.size;
            }
            catch (error) { }
            await News_1.default.create({
                title: item.title,
                thumbnail: size !== null
                    ? AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({ name, extname, size, mimeType }))
                    : null,
                type: 'internal',
                content: item.content,
                category: category.uuid,
                enhancer: enhancer.uuid,
                createdAt: item.created_at,
            });
            this.logger.info(item.title);
        }
        this.logger.info('success');
    }
}
exports.default = ImportNews;
ImportNews.commandName = 'import:news';
ImportNews.description = 'Impor data berita dari website lama';
ImportNews.settings = { loadApp: true, stayAlive: false };
//# sourceMappingURL=ImportNews.js.map