"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Officers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Officers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const OfficersValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/OfficersValidator"));
class OfficersController {
    async index(ctx) {
        const governments = await Governments_1.default.all();
        return ctx.view.render('studio/profiles/officers', {
            page: 'Pejabat Struktural',
            governments,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only([
            'name',
            'rank',
            'position',
            'echelon',
            'education',
            'government',
            'active',
        ]);
        try {
            const sanitized = await ctx.request.validate(OfficersValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const officer = await Officers_1.default.create({
            name: payload.name,
            rank: payload.rank || null,
            position: payload.position,
            echelon: payload.echelon || null,
            education: payload.education || null,
            government: payload.government,
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_OFFICER,
            data: { after: officer.serialize() },
        });
        ctx.session.flash('success', 'Pejabat berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const officer = await Officers_1.default.find(uuid);
        if (!officer) {
            ctx.session.flash('failed', 'Pejabat tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'name',
            'rank',
            'position',
            'echelon',
            'education',
            'government',
            'active',
        ]);
        try {
            const sanitized = await ctx.request.validate(OfficersValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = officer.serialize();
        officer.name = payload.name;
        officer.rank = payload.rank || null;
        officer.position = payload.position;
        officer.echelon = payload.echelon || null;
        officer.education = payload.education || null;
        officer.government = payload.government;
        officer.active = typeof payload.active !== 'undefined';
        await officer.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_OFFICER,
            data: { before, after: officer.serialize() },
        });
        ctx.session.flash('success', 'Pejabat berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const officer = await Officers_1.default.find(uuid);
        if (!officer) {
            ctx.session.flash('failed', 'Layanan tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        officer.deletedAt = luxon_1.DateTime.local();
        await officer.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_OFFICER,
            data: { before: officer.serialize(), after: null },
        });
        ctx.session.flash('success', 'Layanan berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const officers = Officers_1.default.query()
            .select('officers.uuid', 'officers.name', 'officers.rank', 'officers.position')
            .select('officers.echelon', 'officers.education', 'officers.active')
            .select('governments.uuid AS value_government')
            .select('governments.alias AS government')
            .join('governments', function () {
            this.on('governments.uuid', 'officers.government').onNull('governments.deleted_at');
        })
            .where((group) => {
            group.whereNull('officers.deleted_at');
        });
        const recordsTotal = await officers.clone().getCount('officers.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        officers.where((group) => {
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
                    officers.orderBy(column, dir);
                }
            });
        }
        else {
            officers.orderBy('officers.created_at', 'desc');
        }
        let result = await officers;
        const filtered = result.length;
        if (query.start) {
            officers.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            officers.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await officers;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
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
exports.default = OfficersController;
//# sourceMappingURL=OfficersController.js.map