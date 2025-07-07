"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Articles_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Articles"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
class CacheArticles {
    constructor() {
        this.key = 'cache:articles';
    }
    async handle(job) {
        const article = await Articles_1.default.query()
            .select('articles.uuid')
            .select('articles.title')
            .select('articles.slug')
            .select('articles.thumbnail')
            .select('articles.content')
            .select('articles.category')
            .select('articles.created_at')
            .select('articles.updated_at')
            .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(articles.created_at) AS month'))
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('users', function () {
            this.on('users.uuid', 'articles.enhancer').onNull('users.deleted_at');
        })
            .whereNull('articles.deleted_at')
            .where('articles.active', true)
            .where('articles.slug', job.data)
            .first();
        if (!article)
            return;
        const category = await Categories_1.default.find(article.category);
        const data = {
            uuid: article.uuid,
            title: article.title,
            slug: article.slug,
            year: article.$extras.year,
            month: article.$extras.month,
            thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
            category: category.slug.replace(/^articles-/, ''),
            categoryName: category.name,
            content: article.content,
            author: article.$extras.author,
            authorName: article.$extras.author_name,
            authorAvatar: article.$extras.author_avatar,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
        };
        await Adonis_Cache_1.default.update(`api:articles/${job.data}`, data, cache_1.ONE_MONTH);
    }
}
exports.default = CacheArticles;
//# sourceMappingURL=CacheArticles.js.map