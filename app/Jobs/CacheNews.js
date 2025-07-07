"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const News_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/News"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
class CacheNews {
    constructor() {
        this.key = 'cache:news';
    }
    async handle(job) {
        const article = await News_1.default.query()
            .select('news.uuid')
            .select('news.title')
            .select('news.slug')
            .select('news.thumbnail')
            .select('news.type')
            .select('news.content')
            .select('news.category')
            .select('news.created_at')
            .select('news.updated_at')
            .select(Database_1.default.raw('YEAR(news.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(news.created_at) AS month'))
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('users', function () {
            this.on('users.uuid', 'news.enhancer').onNull('users.deleted_at');
        })
            .whereNull('news.deleted_at')
            .where('news.active', true)
            .where('news.slug', job.data)
            .first();
        if (!article)
            return;
        const category = await Categories_1.default.find(article.category);
        const isExternal = article.type === 'external';
        const data = {
            uuid: article.uuid,
            title: article.title,
            slug: article.slug,
            year: article.$extras.year,
            month: article.$extras.month,
            thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
            isExternal,
            category: category.slug.replace(/^news-/, ''),
            categoryName: category.name,
            content: article.content,
            author: article.$extras.author,
            authorName: article.$extras.author_name,
            authorAvatar: article.$extras.author_avatar,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
        };
        await Adonis_Cache_1.default.update(`api:news/${job.data}`, data, cache_1.ONE_MONTH);
    }
}
exports.default = CacheNews;
//# sourceMappingURL=CacheNews.js.map