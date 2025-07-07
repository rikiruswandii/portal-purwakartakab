"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Regents_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Regents"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const RegentsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/RegentsValidator"));
class RegentsController {
    index(ctx) {
        return ctx.view.render('studio/regents/list', {
            page: 'Kelola Bupati',
        });
    }
    add(ctx) {
        return ctx.view.render('studio/regents/add', {
            page: 'Tambah Bupati',
        });
    }
    async edit(ctx) {
        const uuid = ctx.request.param('uuid');
        const regent = await Regents_1.default.find(uuid);
        if (!regent) {
            throw new NotFoundException_1.default();
        }
        regent['description'] = regent.description || '';
        regent['start'] = Number(luxon_1.DateTime.fromJSDate(regent.start).toFormat('yyyy'));
        regent['end'] = Number(luxon_1.DateTime.fromJSDate(regent.end).toFormat('yyyy'));
        return ctx.view.render('studio/regents/edit', {
            page: 'Perbarui Bupati',
            regent,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only(['chief', 'deputy', 'start', 'end', 'description', 'active']);
        try {
            const sanitized = await ctx.request.validate(RegentsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const chief = ctx.request.file('chief_photo');
        const deputy = ctx.request.file('deputy_photo');
        const regent = await Regents_1.default.create({
            chief: payload.chief,
            chiefPhoto: AttachmentLite_1.Attachment.fromFile(chief),
            deputy: payload.deputy || null,
            deputyPhoto: deputy ? AttachmentLite_1.Attachment.fromFile(deputy) : null,
            start: payload.start.toFormat('yyyy-MM-dd HH:mm:ss'),
            end: payload.end.toFormat('yyyy-MM-dd HH:mm:ss'),
            description: payload.description,
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_REGENT,
            data: { after: regent.serialize() },
        });
        ctx.session.flash('success', 'Bupati berhasil ditambahkan.');
        return ctx.response.redirect().toRoute('studio.regents.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const regent = await Regents_1.default.find(uuid);
        if (!regent) {
            ctx.session.flash('failed', 'Bupati tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'chief',
            'deputy',
            'start',
            'end',
            'description',
            'active',
            'chief_photo_deleted',
            'deputy_photo_deleted',
        ]);
        try {
            const sanitized = await ctx.request.validate(RegentsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = regent.serialize();
        const chief = ctx.request.file('chief_photo');
        const deputy = ctx.request.file('deputy_photo');
        regent.chief = payload.chief;
        regent.deputy = payload.deputy || null;
        regent.start = payload.start.toFormat('yyyy-MM-dd HH:mm:ss');
        regent.end = payload.end.toFormat('yyyy-MM-dd HH:mm:ss');
        regent.description = payload.description;
        regent.active = typeof payload.active !== 'undefined';
        if (chief) {
            regent.chiefPhoto = AttachmentLite_1.Attachment.fromFile(chief);
        }
        else if (regent.chiefPhoto && payload.chief_photo_deleted === 'true') {
            await regent.chiefPhoto.delete();
            regent.chiefPhoto = null;
        }
        if (deputy) {
            regent.deputyPhoto = AttachmentLite_1.Attachment.fromFile(deputy);
        }
        else if (regent.deputyPhoto && payload.deputy_photo_deleted === 'true') {
            await regent.deputyPhoto.delete();
            regent.deputyPhoto = null;
        }
        await regent.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_REGENT,
            data: { before, after: regent.serialize() },
        });
        ctx.session.flash('success', 'Bupati berhasil diperbarui.');
        return ctx.response.redirect().toRoute('studio.regents.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const regent = await Regents_1.default.find(uuid);
        if (!regent) {
            ctx.session.flash('failed', 'Bupati tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        regent.deletedAt = luxon_1.DateTime.local();
        await regent.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_REGENT,
            data: { before: regent.serialize(), after: null },
        });
        ctx.session.flash('success', 'Bupati berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const regents = Regents_1.default.query()
            .select('uuid', 'chief', 'deputy', 'start', 'end', 'active')
            .where((group) => {
            group.whereNull('deleted_at');
        });
        const recordsTotal = await regents.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        regents.where((group) => {
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
                    regents.orderBy(column, dir);
                }
            });
        }
        else {
            regents.orderBy('start', 'desc');
        }
        let result = await regents;
        const filtered = result.length;
        if (query.start) {
            regents.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            regents.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await regents;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                start: Number(luxon_1.DateTime.fromJSDate(result[index].start).toFormat('yyyy')),
                end: Number(luxon_1.DateTime.fromJSDate(result[index].end).toFormat('yyyy')),
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
exports.default = RegentsController;
//# sourceMappingURL=RegentsController.js.map