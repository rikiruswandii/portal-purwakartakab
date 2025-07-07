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
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Articles_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Articles"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Visitors_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Visitors"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const route_model_binding_1 = require("@adonisjs/route-model-binding");
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class ArticlesController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const year = ctx.request.param('year');
        const month = ctx.request.param('month');
        const articles = await Articles_1.default.query()
            .select('articles.uuid')
            .select('articles.title')
            .select('articles.slug')
            .select('articles.thumbnail')
            .select('articles.created_at')
            .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(articles.created_at) AS month'))
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^articles-", "") AS category'))
            .select('categories.name AS category_name')
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('categories', function () {
            this.on('categories.uuid', 'articles.category').onNull('categories.deleted_at');
        })
            .join('users', function () {
            this.on('users.uuid', 'articles.enhancer').onNull('users.deleted_at');
        })
            .whereNull('articles.deleted_at')
            .where('articles.active', true)
            .whereRaw(year ? `YEAR(articles.created_at) = ?` : `true = ?`, [year || true])
            .whereRaw(month ? `MONTH(articles.created_at) = ?` : `true = ?`, [month || true])
            .where((table) => {
            table
                .orWhereRaw(q ? `articles.title LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `articles.content LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .orderBy('articles.created_at', 'desc')
            .paginate(page, limit);
        const data = articles.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                category: article.category,
                categoryName: article.category_name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: articles.getMeta() };
    }
    async categories(_ctx) {
        const categories = await Categories_1.default.query()
            .select('categories.uuid')
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^articles-", "") AS slug'))
            .select('categories.name AS name')
            .count(`articles.uuid`, 'total_articles')
            .select('categories.created_at')
            .leftJoin('articles', function () {
            this.on('articles.category', 'categories.uuid')
                .onNull('articles.deleted_at')
                .onVal('articles.active', true);
        })
            .where((group) => {
            group.whereNull('categories.deleted_at').where('categories.type', 'articles');
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
            const archives = await Articles_1.default.query()
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
            .where('slug', `articles-${slug}`)
            .where('type', 'articles')
            .first();
        if (!category) {
            throw new NotFoundException_1.default();
        }
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const articles = await Articles_1.default.query()
            .select('articles.uuid')
            .select('articles.title')
            .select('articles.slug')
            .select('articles.thumbnail')
            .select('articles.created_at')
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
            .where('articles.category', category.uuid)
            .orderBy('articles.created_at', 'desc')
            .paginate(page, limit);
        const data = articles.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                category: category.slug.replace(/^articles-/, ''),
                categoryName: category.name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: articles.getMeta() };
    }
    async author(ctx, user) {
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const articles = await Articles_1.default.query()
            .select('articles.uuid')
            .select('articles.title')
            .select('articles.slug')
            .select('articles.thumbnail')
            .select('articles.created_at')
            .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
            .select(Database_1.default.raw('MONTH(articles.created_at) AS month'))
            .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^articles-", "") AS category'))
            .select('categories.name AS category_name')
            .select('users.login AS author')
            .select('users.name AS author_name')
            .select('users.avatar AS author_avatar')
            .join('categories', function () {
            this.on('categories.uuid', 'articles.category').onNull('categories.deleted_at');
        })
            .join('users', function () {
            this.on('users.uuid', 'articles.enhancer').onNull('users.deleted_at');
        })
            .whereNull('articles.deleted_at')
            .where('articles.active', true)
            .where('users.uuid', user.uuid)
            .orderBy('articles.created_at', 'desc')
            .paginate(page, limit);
        const data = articles.all().map((item) => {
            const article = { ...item.toJSON(), ...item.$extras };
            return {
                uuid: article.uuid,
                title: article.title,
                slug: article.slug,
                year: article.year,
                month: article.month,
                thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
                category: article.category,
                categoryName: article.category_name,
                author: article.author,
                authorName: article.author_name,
                authorAvatar: article.author_avatar,
                createdAt: article.createdAt,
            };
        });
        return { data, meta: articles.getMeta() };
    }
    async popular(_ctx) {
        return await Adonis_Cache_1.default.remember('api:articles:popular', cache_1.ONE_DAY, async () => {
            const populars = await Articles_1.default.query()
                .select('articles.uuid')
                .select('articles.title')
                .select('articles.slug')
                .select('articles.thumbnail')
                .select('articles.created_at')
                .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(articles.created_at) AS month'))
                .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^articles-", "") AS category'))
                .select('categories.name AS category_name')
                .select('users.login AS author')
                .select('users.name AS author_name')
                .select('users.avatar AS author_avatar')
                .count('visitors.uuid', 'views')
                .join('visitors', function () {
                const yearQuery = "SUBSTRING_INDEX(SUBSTRING_INDEX(`visitors`.`page`, '/', 3), '/', -1) " +
                    '= YEAR(`articles`.`created_at`)';
                const monthQuery = "SUBSTRING_INDEX(SUBSTRING_INDEX(`visitors`.`page`, '/', 4), '/', -1) " +
                    "= DATE_FORMAT(`articles`.`created_at`, '%m')";
                const slugQuery = "SUBSTRING_INDEX(`visitors`.`page`, '/', -1) = `articles`.`slug`";
                const year = Database_1.default.knexRawQuery(yearQuery);
                const month = Database_1.default.knexRawQuery(monthQuery);
                const slug = Database_1.default.knexRawQuery(slugQuery);
                this.andOn(year)
                    .andOn(month)
                    .andOn(slug)
                    .andOnVal('visitors.page', 'like', '/artikel/%/%/%');
            })
                .join('categories', function () {
                this.on('categories.uuid', 'articles.category').onNull('categories.deleted_at');
            })
                .join('users', function () {
                this.on('users.uuid', 'articles.enhancer').onNull('users.deleted_at');
            })
                .whereNull('articles.deleted_at')
                .where('articles.active', true)
                .groupBy('articles.uuid')
                .orderBy('views', 'desc')
                .limit(5);
            return populars.map((item) => {
                const article = { ...item.toJSON(), ...item.$extras };
                return {
                    uuid: article.uuid,
                    title: article.title,
                    slug: article.slug,
                    year: article.year,
                    month: article.month,
                    thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
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
        return await Adonis_Cache_1.default.remember(`api:articles/${slug}`, cache_1.ONE_MONTH, async () => {
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
                .whereRaw('YEAR(articles.created_at) = ?', [year])
                .whereRaw('MONTH(articles.created_at) = ? ', [month])
                .where('articles.slug', slug)
                .first();
            if (!article) {
                throw new NotFoundException_1.default();
            }
            const category = await Categories_1.default.find(article.category);
            return {
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
        });
    }
    async count(ctx) {
        const { year, month, slug } = ctx.request.params();
        return await Adonis_Cache_1.default.remember(`api:articles/${slug}:count`, cache_1.ONE_DAY / 2, async () => {
            const article = await Articles_1.default.query()
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
                .where('page', `/artikel/${year}/${month}/${slug}`)
                .first();
            return { shared: article.shared, views: views.$extras.views };
        });
    }
    async share(ctx) {
        const { year, month, slug } = ctx.request.params();
        const article = await Articles_1.default.query()
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
        return await Adonis_Cache_1.default.remember(`api:articles/${slug}:related`, cache_1.ONE_MONTH / 2, async () => {
            const article = await Articles_1.default.query()
                .whereNull('deleted_at')
                .where('active', true)
                .whereRaw('YEAR(created_at) = ?', [year])
                .whereRaw('MONTH(created_at) = ? ', [month])
                .where('slug', slug)
                .first();
            if (!article) {
                throw new NotFoundException_1.default();
            }
            const related = await Articles_1.default.query()
                .select('others.uuid')
                .select('others.title')
                .select('others.slug')
                .select('others.thumbnail')
                .select('others.created_at')
                .select(Database_1.default.raw('YEAR(others.created_at) AS year'))
                .select(Database_1.default.raw('MONTH(others.created_at) AS month'))
                .select(Database_1.default.raw('REGEXP_REPLACE(categories.slug, "^articles-", "") AS category'))
                .select('categories.name AS category_name')
                .select('users.login AS author')
                .select('users.name AS author_name')
                .select('users.avatar AS author_avatar')
                .select(Database_1.default.raw(`MATCH(others.title, others.content) AGAINST('${article.title}' IN BOOLEAN MODE) AS relevance`))
                .join('articles AS others', function () {
                this.onVal('others.uuid', '<>', 'articles.uuid')
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
                .where('articles.uuid', article.uuid)
                .groupBy('others.uuid')
                .orderBy('relevance', 'desc')
                .limit(5);
            return related.map((item) => {
                const article = { ...item.toJSON(), ...item.$extras };
                return {
                    uuid: article.uuid,
                    title: article.title,
                    slug: article.slug,
                    year: article.year,
                    month: article.month,
                    thumbnail: Helpers_1.default.getAttachmentUrl(article.thumbnail),
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
], ArticlesController.prototype, "author", null);
exports.default = ArticlesController;
//# sourceMappingURL=ArticlesController.js.map