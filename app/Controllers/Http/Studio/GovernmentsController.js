"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const GovType_1 = global[Symbol.for('ioc.use')]("App/Enums/GovType");
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const GovernmentsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/GovernmentsValidator"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class GovernmentsController {
    async index(ctx) {
        return ctx.view.render('studio/governments/list', {
            page: 'Perangkat Daerah',
            GovTypeDesc: GovType_1.GovTypeDesc,
        });
    }
    async add(ctx) {
        return ctx.view.render('studio/governments/add', {
            page: 'Tambah OPD',
            GovTypeDesc: GovType_1.GovTypeDesc,
        });
    }
    async edit(ctx) {
        const uuid = ctx.request.param('uuid');
        const government = await Governments_1.default.find(uuid);
        if (!government) {
            throw new NotFoundException_1.default();
        }
        return ctx.view.render('studio/governments/edit', {
            page: 'Ubah OPD',
            government,
            GovTypeDesc: GovType_1.GovTypeDesc,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only([
            'name',
            'alias',
            'address',
            'email',
            'phone',
            'fax',
            'url',
            'type',
        ]);
        try {
            const sanitized = await ctx.request.validate(GovernmentsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        let attachment = null;
        const logo = ctx.request.file('logo');
        if (logo) {
            attachment = AttachmentLite_1.Attachment.fromFile(logo);
        }
        const government = await Governments_1.default.create({
            name: payload.name,
            logo: attachment,
            alias: payload.alias.toUpperCase(),
            address: payload.address,
            email: payload.email,
            phone: payload.phone,
            fax: payload.fax,
            url: payload.url || null,
            type: payload.type,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_GOVERNMENT,
            data: { after: government.serialize() },
        });
        ctx.session.flash('success', 'OPD berhasil ditambahkan.');
        return ctx.response.redirect().toRoute('studio.governments.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const government = await Governments_1.default.find(uuid);
        if (!government) {
            ctx.session.flash('failed', 'OPD tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'name',
            'alias',
            'address',
            'email',
            'phone',
            'fax',
            'url',
            'type',
        ]);
        try {
            const sanitized = await ctx.request.validate(GovernmentsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = government.serialize();
        const logo = ctx.request.file('logo');
        government.name = payload.name;
        government.alias = payload.alias.toUpperCase();
        government.address = payload.address;
        government.email = payload.email || null;
        government.phone = payload.phone || null;
        government.fax = payload.fax || null;
        government.url = payload.url || null;
        government.type = payload.type;
        if (logo) {
            government.logo = AttachmentLite_1.Attachment.fromFile(logo);
        }
        await government.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_GOVERNMENT,
            data: { before, after: government.serialize() },
        });
        ctx.session.flash('success', 'OPD berhasil diperbarui.');
        return ctx.response.redirect().toRoute('studio.governments.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const government = await Governments_1.default.find(uuid);
        if (!government) {
            ctx.session.flash('failed', 'OPD tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        government.deletedAt = luxon_1.DateTime.local();
        await government.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_GOVERNMENT,
            data: { before: government.serialize(), after: null },
        });
        ctx.session.flash('success', 'OPD berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const governments = Governments_1.default.query()
            .select('uuid', 'name', 'logo', 'alias', 'url', 'type')
            .where((group) => {
            group.whereNull('deleted_at');
        });
        const recordsTotal = await governments.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        governments.where((group) => {
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
                    governments.orderBy(column, dir);
                }
            });
        }
        else {
            governments.orderBy('created_at', 'desc');
        }
        let result = await governments;
        const filtered = result.length;
        if (query.start) {
            governments.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            governments.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await governments;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                logo: result[index].logo ? Helpers_1.default.baseUrl(result[index].logo.url) : null,
                value_type: result[index].type,
                type: GovType_1.GovTypeDesc[result[index].type],
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
exports.default = GovernmentsController;
//# sourceMappingURL=GovernmentsController.js.map