"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Natres_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Natres"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Articles_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Articles"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const NatresValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/Profiles/NatresValidator"));
class NatresController {
    async index(ctx) {
        return ctx.view.render('studio/profiles/natres', {
            page: 'Sumber Daya Alam',
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only(['title', 'caption']);
        try {
            const sanitized = await ctx.request.validate(NatresValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const image = ctx.request.file('image');
        const attachment = AttachmentLite_1.Attachment.fromFile(image);
        const natres = await Natres_1.default.create({
            title: Helpers_1.default.trim(payload.title),
            image: attachment,
            caption: payload.caption,
            article: null,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_NATRES,
            data: { after: natres.serialize() },
        });
        ctx.session.flash('success', 'Sumber daya alam berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const natres = await Natres_1.default.find(uuid);
        if (!natres) {
            ctx.session.flash('failed', 'Sumber daya alam tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['title', 'caption']);
        try {
            const sanitized = await ctx.request.validate(NatresValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = natres.serialize();
        const image = ctx.request.file('image');
        natres.title = payload.title;
        natres.caption = payload.caption;
        if (image) {
            natres.image = AttachmentLite_1.Attachment.fromFile(image);
        }
        await natres.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_NATRES,
            data: { before, after: natres.serialize() },
        });
        ctx.session.flash('success', 'Sumber daya alam berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const natres = await Natres_1.default.find(uuid);
        if (!natres) {
            ctx.session.flash('failed', 'Sumber daya alam tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        natres.deletedAt = luxon_1.DateTime.local();
        await natres.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_NATRES,
            data: { before: natres.serialize(), after: null },
        });
        ctx.session.flash('success', 'Sumber daya alam berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async articles(ctx) {
        const perPage = 10;
        const term = ctx.request.input('term') || ctx.request.input('q');
        const page = ctx.request.input('page', 1);
        const query = Articles_1.default.query()
            .where('title', 'like', `%${term}%`)
            .whereNull('deleted_at')
            .forPage(page, perPage);
        const [results, totalResults] = await Promise.all([
            query,
            query.clone().clearOrder().clearLimit().count('uuid', 'count').first(),
        ]);
        return ctx.response.json({
            total_count: totalResults?.$extras.count || 0,
            results: results.map((item) => ({ id: item.uuid, text: item.title })),
            pagination: {
                more: page * perPage < (totalResults?.$extras.count || 0),
            },
        });
    }
    async link(ctx) {
        const payload = ctx.request.only(['xuuid', 'article']);
        const natres = await Natres_1.default.find(payload.xuuid);
        if (!natres) {
            ctx.session.flash('failed', 'Sumber daya alam tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        natres.article = payload.article;
        await natres.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_NATRES,
            data: { before: natres.serialize(), after: null },
        });
        ctx.session.flash('success', 'Artikel berhasil ditautkan ke sumber daya alam ini.');
        return ctx.response.redirect().back();
    }
    async unlink(ctx) {
        const uuid = ctx.request.param('uuid');
        const natres = await Natres_1.default.find(uuid);
        if (!natres) {
            ctx.session.flash('failed', 'Sumber daya alam tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        natres.article = null;
        await natres.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_NATRES,
            data: { before: natres.serialize(), after: null },
        });
        ctx.session.flash('success', 'Artikel berhasil dicopot dari sumber daya alam ini.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const natres = Natres_1.default.query()
            .select('natres.uuid', 'natres.title', 'natres.image', 'natres.caption')
            .select('articles.uuid AS article')
            .leftJoin('articles', function () {
            this.on('articles.uuid', 'natres.article').onNull('articles.deleted_at');
        })
            .where((group) => {
            group.whereNull('natres.deleted_at');
        });
        const recordsTotal = await natres.clone().getCount('natres.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        natres.where((group) => {
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
                    natres.orderBy(column, dir);
                }
            });
        }
        else {
            natres.orderBy('natres.created_at', 'desc');
        }
        let result = await natres;
        const filtered = result.length;
        if (query.start) {
            natres.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            natres.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await natres;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                image: Helpers_1.default.baseUrl(result[index].image.url),
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
exports.default = NatresController;
//# sourceMappingURL=NatresController.js.map