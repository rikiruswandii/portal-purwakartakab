"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Services_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Services"));
const Dashboard_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Dashboard"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const ServicesValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/ServicesValidator"));
class ServicesController {
    async index(ctx) {
        const governments = await Governments_1.default.all();
        return ctx.view.render('studio/services', {
            page: 'Layanan',
            governments,
        });
    }
    async up(ctx) {
        await ctx.bouncer.authorize('permission', [UserRole_1.default.DEV, UserRole_1.default.SUPER]);
        const uuid = ctx.request.param('uuid');
        const trx = await Database_1.default.transaction();
        const service = await Services_1.default.find(uuid, { client: trx });
        if (!service) {
            ctx.session.flash('failed', 'Layanan tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const before = service.serialize();
        const above = await Services_1.default.query({ client: trx })
            .where('sort', '<', service.sort)
            .whereNull('deleted_at')
            .orderBy('sort', 'desc')
            .first();
        if (above) {
            const temp = service.sort;
            service.sort = above.sort;
            await service.useTransaction(trx).save();
            above.sort = temp;
            await above.useTransaction(trx).save();
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Layanan gagal diperbarui.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_SERVICE,
            data: { before, after: service.serialize() },
        });
        ctx.session.flash('success', 'Layanan berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async down(ctx) {
        await ctx.bouncer.authorize('permission', [UserRole_1.default.DEV, UserRole_1.default.SUPER]);
        const uuid = ctx.request.param('uuid');
        const trx = await Database_1.default.transaction();
        const service = await Services_1.default.find(uuid, { client: trx });
        if (!service) {
            ctx.session.flash('failed', 'Layanan tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const before = service.serialize();
        const bellow = await Services_1.default.query({ client: trx })
            .where('sort', '>', service.sort)
            .whereNull('deleted_at')
            .orderBy('sort', 'asc')
            .first();
        if (bellow) {
            const temp = service.sort;
            service.sort = bellow.sort;
            await service.useTransaction(trx).save();
            bellow.sort = temp;
            await bellow.useTransaction(trx).save();
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Layanan gagal diperbarui.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_SERVICE,
            data: { before, after: service.serialize() },
        });
        ctx.session.flash('success', 'Layanan berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async insert(ctx) {
        const logged = ctx.auth.use('web').user;
        const payload = ctx.request.only(['name', 'alias', 'caption', 'url', 'government']);
        try {
            const sanitized = await ctx.request.validate(ServicesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const last = await Services_1.default.query().orderBy('sort', 'desc').first();
        const logo = ctx.request.file('logo');
        const attachment = AttachmentLite_1.Attachment.fromFile(logo);
        const service = await Services_1.default.create({
            name: payload.name,
            logo: attachment,
            caption: payload.caption,
            alias: payload.alias.toUpperCase(),
            url: payload.url,
            sort: (last?.sort || 0) + 1,
            government: [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role)
                ? payload.government
                : logged.government,
            enhancer: logged.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_SERVICE,
            data: { after: service.serialize() },
        });
        ctx.session.flash('success', 'Layanan berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const service = await Services_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!service ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) &&
                service.government !== logged.government)) {
            ctx.session.flash('failed', 'Layanan tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['name', 'alias', 'caption', 'url', 'government']);
        try {
            const sanitized = await ctx.request.validate(ServicesValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = service.serialize();
        const logo = ctx.request.file('logo');
        service.name = payload.name;
        service.caption = payload.caption;
        service.alias = payload.alias.toUpperCase();
        service.url = payload.url;
        service.government = [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role)
            ? payload.government
            : logged.government;
        if (logo) {
            service.logo = AttachmentLite_1.Attachment.fromFile(logo);
        }
        await service.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_SERVICE,
            data: { before, after: service.serialize() },
        });
        ctx.session.flash('success', 'Layanan berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const service = await Services_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!service ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) &&
                service.government !== logged.government)) {
            ctx.session.flash('failed', 'Layanan tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        service.deletedAt = luxon_1.DateTime.local();
        await service.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_SERVICE,
            data: { before: service.serialize(), after: null },
        });
        ctx.session.flash('success', 'Layanan berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const services = Services_1.default.query()
            .select('services.uuid', 'services.name', 'services.caption', 'services.logo')
            .select('services.alias', 'services.url', 'services.sort')
            .select('governments.uuid AS value_government')
            .select('governments.alias AS government')
            .join('governments', (table) => {
            table.on('governments.uuid', 'services.government').onNull('governments.deleted_at');
        })
            .where((group) => {
            group
                .whereNull('services.deleted_at')
                .whereRaw(Dashboard_1.default.whereGovernment(logged, 'services'));
        });
        const recordsTotal = await services.clone().getCount('services.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'services.uuid',
            name: 'services.name',
            caption: 'services.caption',
            logo: 'services.logo',
            government: 'governments.alias',
            government_value: 'governments.uuid',
            sort: 'services.sort',
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'users.uuid';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        services.where((group) => {
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
                    services.orderBy(column, dir);
                }
            });
        }
        else {
            services.orderBy('services.sort', 'asc');
        }
        let result = await services;
        const filtered = result.length;
        if (query.start) {
            services.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            services.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await services;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                logo: Helpers_1.default.baseUrl(result[index].logo.url),
                end: recordsTotal,
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
exports.default = ServicesController;
//# sourceMappingURL=ServicesController.js.map