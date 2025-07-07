"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const Infographics_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Infographics"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const InfographicsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/InfographicsValidator"));
class InfographicsController {
    async index(ctx) {
        return ctx.view.render('studio/infographics', {
            page: 'Infografis',
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only(['title', 'active', 'popup', 'href']);
        try {
            const sanitized = await ctx.request.validate(InfographicsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const image = ctx.request.file('image');
        const attachment = AttachmentLite_1.Attachment.fromFile(image);
        const infographic = await Infographics_1.default.create({
            title: Helpers_1.default.trim(payload.title),
            image: attachment,
            active: typeof payload.active !== 'undefined',
            isPopup: typeof payload.popup !== 'undefined',
            href: payload.href,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_INFOGRAPHIC,
            data: { after: infographic.serialize() },
        });
        ctx.session.flash('success', 'Infografis berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const infographic = await Infographics_1.default.find(uuid);
        if (!infographic) {
            ctx.session.flash('failed', 'Infografis tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['title', 'active', 'popup', 'href']);
        try {
            const sanitized = await ctx.request.validate(InfographicsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = infographic.serialize();
        const image = ctx.request.file('image');
        infographic.title = payload.title;
        infographic.active = typeof payload.active !== 'undefined';
        infographic.isPopup = typeof payload.popup !== 'undefined';
        infographic.href = payload.href;
        if (image) {
            infographic.image = AttachmentLite_1.Attachment.fromFile(image);
        }
        await infographic.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_INFOGRAPHIC,
            data: { before, after: infographic.serialize() },
        });
        ctx.session.flash('success', 'Infografis berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const infographic = await Infographics_1.default.find(uuid);
        if (!infographic) {
            ctx.session.flash('failed', 'Infografis tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        infographic.deletedAt = luxon_1.DateTime.local();
        await infographic.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_INFOGRAPHIC,
            data: { before: infographic.serialize(), after: null },
        });
        ctx.session.flash('success', 'Infografis berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const infographics = Infographics_1.default.query()
            .select('uuid', 'title', 'image', 'active', 'is_popup as popup', 'href')
            .where((group) => {
            group.whereNull('deleted_at');
        });
        const recordsTotal = await infographics.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        infographics.where((group) => {
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
                    infographics.orderBy(column, dir);
                }
            });
        }
        else {
            infographics.orderBy('created_at', 'desc');
        }
        let result = await infographics;
        const filtered = result.length;
        if (query.start) {
            infographics.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            infographics.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await infographics;
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
                active: !!result[index].active,
                popup: !!result[index].popup,
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
exports.default = InfographicsController;
//# sourceMappingURL=InfographicsController.js.map