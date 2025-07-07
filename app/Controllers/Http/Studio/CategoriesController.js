"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const CategoriesValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/CategoriesValidator"));
class CategoriesController {
    async index(ctx) {
        const type = ctx.request.param('type');
        const types = {
            news: 'Berita',
            articles: 'Artikel',
        };
        if (!Object.keys(types).includes(type)) {
            throw new NotFoundException_1.default();
        }
        return ctx.view.render('studio/categories', {
            page: ['Kelola Kategori', types[type]].join(' '),
            type,
        });
    }
    async insert(ctx) {
        const type = ctx.request.param('type');
        const payload = ctx.request.only(['name']);
        try {
            const sanitized = await ctx.request.validate(CategoriesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const category = await Categories_1.default.create({
            name: Helpers_1.default.ucwords(payload.name),
            type,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.CREATE_CATEGORY,
            data: { after: category.serialize() },
        });
        ctx.session.flash('success', 'Kategori berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const category = await Categories_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!category ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && category.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Kategori tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['name']);
        try {
            const sanitized = await ctx.request.validate(CategoriesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = category.serialize();
        category.name = Helpers_1.default.ucwords(payload.name);
        await category.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.UPDATE_CATEGORY,
            data: { before, after: category.serialize() },
        });
        ctx.session.flash('success', 'Kategori berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const category = await Categories_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!category ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) && category.enhancer !== logged.uuid)) {
            ctx.session.flash('failed', 'Kategori tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        category.slug = `${category.slug}-${Helpers_1.default.generateRandomNumber(3)}`;
        category.deletedAt = luxon_1.DateTime.local();
        await category.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_CATEGORY,
            data: { before: category.serialize(), after: null },
        });
        ctx.session.flash('success', 'Kategori berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const type = ctx.request.param('type');
        const categories = Categories_1.default.query()
            .select('categories.uuid')
            .select('categories.slug')
            .select('categories.name')
            .count(`${type}.uuid`, 'total')
            .select('categories.enhancer')
            .leftJoin(type, function () {
            this.on(`${type}.category`, 'categories.uuid').onNull(`${type}.deleted_at`);
        })
            .where((group) => {
            group.where('categories.type', type).whereNull('categories.deleted_at');
        })
            .groupBy('categories.uuid');
        const recordsTotal = await categories.clone().getCount('categories.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'categories.uuid',
            slug: 'categories.slug',
            name: 'categories.name',
            total: Database_1.default.raw(`COUNT(${type}.uuid)`),
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'categories.uuid';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        categories.where((group) => {
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
                    categories.orderBy(column, dir);
                }
            });
        }
        else {
            categories.orderBy('categories.created_at', 'desc');
        }
        let result = await categories;
        const filtered = result.length;
        if (query.start) {
            categories.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            categories.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await categories;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            result[index].slug = result[index].slug.replace(new RegExp(`^${type}\-`), '');
            Object.assign(result[index], {
                aggregate: result[index].total,
                total: result[index].total ? result[index].total + ' artikel' : 'Belum ada',
                url: Helpers_1.default.baseUrl(type, 'categories', result[index].slug),
                x: logged.uuid === result[index].enhancer ||
                    [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role),
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
exports.default = CategoriesController;
//# sourceMappingURL=CategoriesController.js.map