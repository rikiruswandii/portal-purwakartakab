"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const uuid_1 = require("uuid");
const Natres_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Natres"));
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Articles_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Articles"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Dashboard_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Dashboard"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const ArticlesValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/ArticlesValidator"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class ArticlesController {
    index(ctx) {
        return ctx.view.render('studio/articles/list', {
            page: 'Kelola Artikel',
        });
    }
    async add(ctx) {
        const categories = await Categories_1.default.query().whereNull('deleted_at').where('type', 'articles');
        return ctx.view.render('studio/articles/add', {
            page: 'Tulis Artikel',
            categories,
        });
    }
    async edit(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await Articles_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            throw new NotFoundException_1.default();
        }
        const categories = await Categories_1.default.query().whereNull('deleted_at').where('type', 'articles');
        return ctx.view.render('studio/articles/edit', {
            page: 'Sunting Artikel',
            article,
            categories,
        });
    }
    async insert(ctx) {
        const back = ctx.request.input('back', null);
        const payload = ctx.request.only(['title', 'content', 'category', 'active']);
        try {
            const sanitized = await ctx.request.validate(ArticlesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return back ? ctx.response.redirect().toPath(back) : ctx.response.redirect().back();
        }
        let attachment = null;
        const image = ctx.request.file('thumbnail');
        if (image) {
            attachment = AttachmentLite_1.Attachment.fromFile(image);
        }
        const uuid = (0, uuid_1.v4)();
        const natres = new URL(back || 'http://localhost').searchParams.get('natres');
        const article = await Articles_1.default.create({
            uuid,
            title: payload.title,
            thumbnail: attachment,
            content: payload.content,
            category: payload.category,
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        });
        if (natres) {
            await Natres_1.default.query().where('uuid', natres).update({ article: uuid });
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.WRITE_ARTICLE,
            data: { after: article.serialize() },
        });
        ctx.session.flash('success', 'Artikel berhasil dipublikasikan.');
        return ctx.response.redirect().toRoute('studio.articles.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await Articles_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Artikel tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'title',
            'content',
            'category',
            'active',
            'thumbnail_deleted',
        ]);
        try {
            const sanitized = await ctx.request.validate(ArticlesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = article.serialize();
        const attachment = ctx.request.file('thumbnail');
        article.title = payload.title;
        article.content = payload.content;
        article.category = payload.category;
        article.active = typeof payload.active !== 'undefined';
        if (attachment) {
            article.thumbnail = AttachmentLite_1.Attachment.fromFile(attachment);
        }
        else if (article.thumbnail && payload.thumbnail_deleted === 'true') {
            await article.thumbnail.delete();
            article.thumbnail = null;
        }
        await article.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_ARTICLE,
            data: { before, after: article.serialize() },
        });
        ctx.session.flash('success', 'Artikel berhasil disunting.');
        return ctx.response.redirect().toRoute('studio.articles.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await Articles_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Artikel tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        article.slug = `${article.slug}-${Helpers_1.default.generateRandomNumber()}`;
        article.deletedAt = luxon_1.DateTime.local();
        await article.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.TAKEDOWN_ARTICLE,
            data: { before: article.serialize(), after: null },
        });
        ctx.session.flash('success', 'Artikel berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const articles = Articles_1.default.query()
            .select('articles.uuid AS uuid')
            .select('articles.slug AS slug')
            .select('articles.title AS title')
            .select(Database_1.default.raw('YEAR(articles.created_at) AS year'))
            .select(Database_1.default.raw('LPAD(MONTH(articles.created_at), 2, "0") AS month'))
            .select('categories.name AS category')
            .count('visitors.uuid', 'visitor')
            .select('articles.active AS active')
            .join('categories', function () {
            this.on('categories.uuid', 'articles.category').onNull('categories.deleted_at');
        })
            .joinRaw('LEFT JOIN (SELECT uuid, page FROM visitors GROUP BY page, ip_address, user_agent, ' +
            'DATE(created_at)) AS visitors ON visitors.page = ' +
            'CONCAT("/artikel/", YEAR(articles.created_at), "/", ' +
            'LPAD(MONTH(articles.created_at), 2, "0"), "/", articles.slug)')
            .where((group) => {
            group.whereNull('articles.deleted_at').whereRaw(Dashboard_1.default.whereEnhancer(logged, 'articles'));
        })
            .groupBy('articles.uuid');
        const recordsTotal = await articles.clone().getCount('articles.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'articles.uuid',
            slug: 'articles.slug',
            title: 'articles.title',
            category: 'categories.name',
            visitor: Database_1.default.raw('COUNT(visitors.uuid)'),
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'articles.uuid';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        articles.where((group) => {
            columns.forEach((name) => {
                if (query.search.value && typeof name !== 'object') {
                    group.orWhere(name, 'like', '%' + query.search.value + '%');
                }
            });
        });
        if (typeof query.order !== 'undefined') {
            Array.from(query.order).forEach(({ dir, column }) => {
                dir = dir === 'desc' ? 'desc' : 'asc';
                column = columns[column - 1] || null;
                if (column) {
                    articles.orderBy(column, dir);
                }
            });
        }
        else {
            articles.orderBy('articles.created_at', 'desc');
        }
        let result = await articles;
        const filtered = result.length;
        if (query.start) {
            articles.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            articles.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await articles;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                aggregate: result[index].visitor,
                visitor: result[index].visitor + ' kali',
                url: Helpers_1.default.baseUrl('articles', result[index].year, result[index].month, result[index].slug),
                year: undefined,
                month: undefined,
                active: !!result[index].active,
            });
            number += 1;
        }
        return {
            draw: query.draw || 1,
            recordsTotal,
            recordsFiltered: filtered || 0,
            data: result,
        };
    }
}
exports.default = ArticlesController;
//# sourceMappingURL=ArticlesController.js.map