"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const News_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/News"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Visitors_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Visitors"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const route_model_binding_1 = require("@adonisjs/route-model-binding");
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class NewsController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const year = ctx.request.param('year');
        const month = ctx.request.param('month');
        const news = await News_1.default.query()
            .select('news.uuid')
            .select('news.title')
            .select('news.slug')
            .select('news.thumbnail')
            .select('news.type')
            .select('news.created_at')
            .select(Database_1.default.raw('YEAR(news.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(news.created_at) AS month'))
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^news-", "") AS category'))
            .select('categories.name AS category_name')
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('categories', function () {
            this.on('categories.uuid', 'news.category').onNull('categories.deleted_at');
        })
            .join('users', function () {
            this.on('users.uuid', 'news.enhancer').onNull('users.deleted_at');
        })
            .whereNull('news.deleted_at')
            .where('news.active', true)
            .whereRaw(year ? `YEAR(news.created_at) = ?` : `true = ?`, [year || true])
            .whereRaw(month ? `MONTH(news.created_at) = ?` : `true = ?`, [month || true])
            .where((table) => {
            table
                .orWhereRaw(q ? `news.title LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `news.content LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .orderBy('news.created_at', 'desc')
            .paginate(page, limit);
        const data = news.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            const isExternal = article.type === 'external';
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                isExternal,
                category: article.category,
                categoryName: article.category_name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: news.getMeta() };
    }
    async categories(_ctx) {
        const categories = await Categories_1.default.query()
            .select('categories.uuid')
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^news-", "") AS slug'))
            .select('categories.name AS name')
            .count(`news.uuid`, 'total_articles')
            .select('categories.created_at')
            .leftJoin('news', function () {
            this.on('news.category', 'categories.uuid')
                .onNull('news.deleted_at')
                .onVal('news.active', true);
        })
            .where((group) => {
            group.whereNull('categories.deleted_at').where('categories.type', 'news');
        })
            .orderBy('total_articles', 'desc')
            .orderBy('categories.name', 'asc')
            .groupBy('categories.uuid');
        return categories.map((category) => ({
            uuid: category.uuid,
            name: category.name,
            slug: category.slug,
            totalArticles: category.$extras.total_articles,
            createdAt: category.createdAt,
        }));
    }
    async archives(_ctx) {
        return await Adonis_Cache_1.default.remember('api:articles:archives', cache_1.ONE_YEAR, async () => {
            const archives = await News_1.default.query()
                .select(Database_1.default.raw("DISTINCT DATE_FORMAT(created_at, '%Y-%m') AS archive_date"))
                .whereNull('deleted_at')
                .where('active', true)
                .orderBy('archive_date', 'desc');
            return archives.map((archive) => archive.$extras.archive_date);
        });
    }
    async category(ctx) {
        const slug = ctx.request.param('slug');
        const category = await Categories_1.default.query()
            .whereNull('deleted_at')
            .where('slug', `news-${slug}`)
            .where('type', 'news')
            .first();
        if (!category) {
            throw new NotFoundException_1.default();
        }
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const news = await News_1.default.query()
            .select('news.uuid')
            .select('news.title')
            .select('news.slug')
            .select('news.thumbnail')
            .select('news.type')
            .select('news.created_at')
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
            .where('news.category', category.uuid)
            .orderBy('news.created_at', 'desc')
            .paginate(page, limit);
        const data = news.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            const isExternal = article.type === 'external';
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                isExternal,
                category: category.slug.replace(/^news-/, ''),
                categoryName: category.name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: news.getMeta() };
    }
    async author(ctx, user) {
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const news = await News_1.default.query()
            .select('news.uuid')
            .select('news.title')
            .select('news.slug')
            .select('news.thumbnail')
            .select('news.type')
            .select('news.created_at')
            .select(Database_1.default.raw('YEAR(news.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(news.created_at) AS month'))
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^news-", "") AS category'))
            .select('categories.name AS category_name')
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('categories', function () {
            this.on('categories.uuid', 'news.category').onNull('categories.deleted_at');
        })
            .join('users', function () {
            this.on('users.uuid', 'news.enhancer').onNull('users.deleted_at');
        })
            .whereNull('news.deleted_at')
            .where('news.active', true)
            .where('users.uuid', user.uuid)
            .orderBy('news.created_at', 'desc')
            .paginate(page, limit);
        const data = news.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            const isExternal = article.type === 'external';
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                isExternal,
                category: article.category,
                categoryName: article.category_name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: news.getMeta() };
    }
    async popular(_ctx) {
        return await Adonis_Cache_1.default.remember('api:news:popular', cache_1.ONE_DAY, async () => {
            const populars = await News_1.default.query()
                .select('news.uuid')
                .select('news.title')
                .select('news.slug')
                .select('news.thumbnail')
                .select('news.type')
                .select('news.created_at')
                .select(Database_1.default.raw('YEAR(news.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(news.created_at) AS month'))
                .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^news-", "") AS category'))
                .select('categories.name AS category_name')
                .select('users.login AS author')
                .select('users.name AS author_name')
                .select('users.avatar AS author_avatar')
                .count('visitors.uuid', 'views')
                .leftJoin('visitors', function () {
                const yearQuery = "SUBSTRING_INDEX(SUBSTRING_INDEX(`visitors`.`page`, '/', 3), '/', -1) " +
                    '= YEAR(`news`.`created_at`)';
                const monthQuery = "SUBSTRING_INDEX(SUBSTRING_INDEX(`visitors`.`page`, '/', 4), '/', -1) " +
                    "= DATE_FORMAT(`news`.`created_at`, '%m')";
                const slugQuery = "SUBSTRING_INDEX(`visitors`.`page`, '/', -1) = `news`.`slug`";
                const year = Database_1.default.knexRawQuery(yearQuery);
                const month = Database_1.default.knexRawQuery(monthQuery);
                const slug = Database_1.default.knexRawQuery(slugQuery);
                this.andOn(year)
                    .andOn(month)
                    .andOn(slug)
                    .andOnVal('visitors.page', 'like', '/berita/%/%/%');
            })
                .join('categories', function () {
                this.on('categories.uuid', 'news.category').onNull('categories.deleted_at');
            })
                .join('users', function () {
                this.on('users.uuid', 'news.enhancer').onNull('users.deleted_at');
            })
                .whereNull('news.deleted_at')
                .where('news.active', true)
                .groupBy('news.uuid')
                .orderBy('views', 'desc')
                .limit(5);
            return populars.map((item) => {
                const article = { ...item.toJSON(), ...item.$extras };
                const isExternal = article.type === 'external';
                return {
                    uuid: article.uuid,
                    title: article.title,
                    slug: article.slug,
                    year: article.year,
                    month: article.month,
                    thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                    isExternal,
                    category: article.category,
                    categoryName: article.category_name,
                    author: article.author,
                    authorName: article.author_name,
                    authorAvatar: article.author_avatar,
                    createdAt: article.createdAt,
                };
            });
        });
    }
    async detail(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:news/${slug}`, cache_1.ONE_MONTH, async () => {
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
                .whereRaw('YEAR(news.created_at) = ?', [year])
                .whereRaw('MONTH(news.created_at) = ? ', [month])
                .where('news.slug', slug)
                .first();
            if (!article) {
                throw new NotFoundException_1.default();
            }
            const category = await Categories_1.default.find(article.category);
            const isExternal = article.type === 'external';
            return {
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
        });
    }
    async count(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:news/${slug}:count`, cache_1.ONE_DAY / 2, async () => {
            const article = await News_1.default.query()
                .select('shared')
                .whereNull('deleted_at')
                .where('active', true)
                .whereRaw('YEAR(created_at) = ?', [year])
                .whereRaw('MONTH(created_at) = ? ', [month])
                .where('slug', slug)
                .first();
            if (!article) {
                throw new NotFoundException_1.default();
            }
            const views = await Visitors_1.default.query()
                .count('uuid', 'views')
                .where('page', `/berita/${year}/${month}/${slug}`)
                .first();
            return { shared: article.shared, views: views.$extras.views };
        });
    }
    async share(ctx) {
        const { year, month, slug } = ctx.request.params();
        const article = await News_1.default.query()
            .whereNull('deleted_at')
            .where('active', true)
            .whereRaw('YEAR(created_at) = ?', [year])
            .whereRaw('MONTH(created_at) = ? ', [month])
            .where('slug', slug)
            .first();
        if (!article) {
            throw new NotFoundException_1.default();
        }
        const shared = article.shared + 1;
        article.shared = shared;
        await article.save();
        return { shared };
    }
    async related(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:news/${slug}:related`, cache_1.ONE_MONTH / 2, async () => {
            const article = await News_1.default.query()
                .whereNull('deleted_at')
                .where('active', true)
                .whereRaw('YEAR(created_at) = ?', [year])
                .whereRaw('MONTH(created_at) = ? ', [month])
                .where('slug', slug)
                .first();
            if (!article) {
                throw new NotFoundException_1.default();
            }
            const related = await News_1.default.query()
                .select('others.uuid')
                .select('others.title')
                .select('others.slug')
                .select('others.thumbnail')
                .select('others.type')
                .select('others.created_at')
                .select(Database_1.default.raw('YEAR(others.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(others.created_at) AS month'))
                .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^news-", "") AS category'))
                .select('categories.name AS category_name')
                .select('users.login AS author')
                .select('users.name AS author_name')
                .select('users.avatar AS author_avatar')
                .select(Database_1.default.raw(`MATCH(others.title, others.content) AGAINST('${article.title}' IN BOOLEAN MODE) AS relevance`))
                .join('news AS others', function () {
                this.onVal('others.uuid', '<>', 'news.uuid')
                    .onNull('others.deleted_at')
                    .onVal('others.active', true);
            })
                .join('categories', function () {
                this.on('categories.uuid', 'others.category').onNull('categories.deleted_at');
            })
                .join('users', function () {
                this.on('users.uuid', 'others.enhancer').onNull('users.deleted_at');
            })
                .whereRaw(`MATCH(others.title, others.content) AGAINST('${article.title}' IN BOOLEAN MODE)`)
                .where('news.uuid', article.uuid)
                .groupBy('others.uuid')
                .orderBy('relevance', 'desc')
                .limit(5);
            return related.map((item) => {
                const article = { ...item.toJSON(), ...item.$extras };
                const isExternal = article.type === 'external';
                return {
                    uuid: article.uuid,
                    title: article.title,
                    slug: article.slug,
                    year: article.year,
                    month: article.month,
                    thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                    isExternal,
                    category: article.category,
                    categoryName: article.category_name,
                    author: article.author,
                    authorName: article.author_name,
                    authorAvatar: article.author_avatar,
                    createdAt: article.createdAt,
                };
            });
        });
    }
}
__decorate([
    (0, route_model_binding_1.bind)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Users_1.default]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "author", null);
exports.default = NewsController;
//# sourceMappingURL=NewsController.js.map