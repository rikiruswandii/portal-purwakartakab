"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const News_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/News"));
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Dashboard_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Dashboard"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const NewsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/NewsValidator"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class NewsController {
    index(ctx) {
        return ctx.view.render('studio/news/list', {
            page: 'Kelola Berita',
        });
    }
    async add(ctx) {
        const categories = await Categories_1.default.query().whereNull('deleted_at').where('type', 'news');
        return ctx.view.render('studio/news/add', {
            page: 'Tulis Berita',
            categories,
        });
    }
    async edit(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await News_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            throw new NotFoundException_1.default();
        }
        const categories = await Categories_1.default.query().whereNull('deleted_at').where('type', 'news');
        article['internal'] = article.type === 'internal' ? article.content : '';
        article['external'] = article.type === 'external' ? article.content : '';
        return ctx.view.render('studio/news/edit', {
            page: 'Sunting Berita',
            article,
            categories,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only([
            'title',
            'subtitle',
            'internal',
            'external',
            'type',
            'category',
            'active',
        ]);
        try {
            const sanitized = await ctx.request.validate(NewsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        let attachment = null;
        const image = ctx.request.file('thumbnail');
        if (image) {
            attachment = AttachmentLite_1.Attachment.fromFile(image);
        }
        const article = await News_1.default.create({
            title: payload.title,
            thumbnail: attachment,
            type: payload.type,
            content: payload.external || payload.internal,
            category: payload.category,
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.WRITE_NEWS,
            data: { after: article.serialize() },
        });
        ctx.session.flash('success', 'Berita berhasil dipublikasikan.');
        return ctx.response.redirect().toRoute('studio.news.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await News_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Berita tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'title',
            'subtitle',
            'internal',
            'external',
            'type',
            'category',
            'active',
            'thumbnail_deleted',
        ]);
        try {
            const sanitized = await ctx.request.validate(NewsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = article.serialize();
        article.title = payload.title;
        article.type = payload.type;
        article.content = payload.external || payload.internal;
        article.category = payload.category;
        article.active = typeof payload.active !== 'undefined';
        const attachment = ctx.request.file('thumbnail');
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
            status: UserActivity_1.default.EDIT_NEWS,
            data: { before, after: article.serialize() },
        });
        ctx.session.flash('success', 'Berita berhasil disunting.');
        return ctx.response.redirect().toRoute('studio.news.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const article = await News_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!article ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && article.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Berita tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        article.slug = `${article.slug}-${Helpers_1.default.generateRandomNumber()}`;
        article.deletedAt = luxon_1.DateTime.local();
        await article.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.TAKEDOWN_NEWS,
            data: { before: article.serialize(), after: null },
        });
        ctx.session.flash('success', 'Berita berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const news = News_1.default.query()
            .select('news.uuid AS uuid')
            .select('news.slug AS slug')
            .select('news.title AS title')
            .select('news.type AS type')
            .select(Database_1.default.raw('YEAR(news.created_at) AS year'))
            .select(Database_1.default.raw('LPAD(MONTH(news.created_at), 2, "0") AS month'))
            .select('categories.name AS category')
            .count('visitors.uuid', 'visitor')
            .select('news.active AS active')
            .join('categories', function () {
            this.on('categories.uuid', 'news.category').onNull('categories.deleted_at');
        })
            .joinRaw('LEFT JOIN (SELECT uuid, page FROM visitors GROUP BY page, ip_address, user_agent, ' +
            'DATE(created_at)) AS visitors ON visitors.page = ' +
            'CONCAT("/berita/", YEAR(news.created_at), "/", ' +
            'LPAD(MONTH(news.created_at), 2, "0"), "/", news.slug)')
            .where((group) => {
            group.whereNull('news.deleted_at').whereRaw(Dashboard_1.default.whereEnhancer(logged, 'news'));
        })
            .groupBy('news.uuid');
        const recordsTotal = await news.clone().getCount('news.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'news.uuid',
            slug: 'news.slug',
            title: 'news.title',
            type: 'news.type',
            category: 'categories.name',
            visitor: Database_1.default.raw('COUNT(visitors.uuid)'),
            active: 'news.active',
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'news.uuid';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        news.where((group) => {
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
                    news.orderBy(column, dir);
                }
            });
        }
        else {
            news.orderBy('news.created_at', 'desc');
        }
        let result = await news;
        const filtered = result.length;
        if (query.start) {
            news.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            news.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await news;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                type: result[index].type === 'internal' ? 'Berita' : 'Eksternal',
                aggregate: result[index].visitor,
                visitor: result[index].visitor + ' kali',
                url: Helpers_1.default.baseUrl('news', result[index].year, result[index].month, result[index].slug),
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
exports.default = NewsController;
//# sourceMappingURL=NewsController.js.map