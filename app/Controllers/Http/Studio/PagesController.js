"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pages"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const PagesValidators_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/PagesValidators"));
class PagesController {
    async index(ctx) {
        const slug = ctx.request.param('slug');
        const detail = await Pages_1.default.query().whereNull('deleted_at').where('slug', slug).first();
        if (!detail) {
            throw new NotFoundException_1.default();
        }
        const views = {
            'sejarah': 'studio/profiles/history',
            'lambang-identitas': 'studio/profiles/logo',
            'visi-misi': 'studio/profiles/objectives',
            'sekretaris-daerah': 'studio/profiles/secretary',
            'tugas-fungsi': 'studio/profiles/roles',
        };
        detail.content = Helpers_1.default.parseJson(detail.content);
        return ctx.view.render(views[slug] || 'studio/page', {
            page: detail.title,
            detail,
        });
    }
    async save(ctx) {
        const slug = ctx.request.param('slug');
        const detail = await Pages_1.default.query().whereNull('deleted_at').where('slug', slug).first();
        if (!detail) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['content', 'active', 'thumbnail_deleted']);
        try {
            const sanitized = await ctx.request.validate(PagesValidators_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = detail.serialize();
        detail.content = payload.content;
        detail.active = true;
        const thumbnail = ctx.request.file('thumbnail');
        if (thumbnail) {
            detail.thumbnail = AttachmentLite_1.Attachment.fromFile(thumbnail);
        }
        else if (detail.thumbnail && payload.thumbnail_deleted === 'true') {
            await detail.thumbnail.delete();
            detail.thumbnail = null;
        }
        await detail.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_PAGE,
            data: { before, after: detail.serialize() },
        });
        ctx.session.flash('success', 'Halaman berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async secretary(ctx) {
        const page = await Pages_1.default.findBy('slug', 'sekretaris-daerah');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['name', 'content', 'active', 'thumbnail_deleted']);
        try {
            const sanitized = await ctx.request.validate(PagesValidators_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        page.content = JSON.stringify({ name: payload.name, content: payload.content });
        page.active = true;
        const thumbnail = ctx.request.file('thumbnail');
        if (thumbnail) {
            page.thumbnail = AttachmentLite_1.Attachment.fromFile(thumbnail);
        }
        else if (page.thumbnail && payload.thumbnail_deleted === 'true') {
            await page.thumbnail.delete();
            page.thumbnail = null;
        }
        await page.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_PAGE,
            data: { before, after: page.serialize() },
        });
        ctx.session.flash('success', 'Halaman berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async roles(ctx) {
        const page = await Pages_1.default.findBy('slug', 'tugas-fungsi');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['content', 'source', 'active', 'thumbnail_deleted']);
        try {
            const sanitized = await ctx.request.validate(PagesValidators_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        page.content = JSON.stringify({ content: payload.content, source: payload.source });
        page.active = true;
        const thumbnail = ctx.request.file('thumbnail');
        if (thumbnail) {
            page.thumbnail = AttachmentLite_1.Attachment.fromFile(thumbnail);
        }
        else if (page.thumbnail && payload.thumbnail_deleted === 'true') {
            await page.thumbnail.delete();
            page.thumbnail = null;
        }
        await page.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_PAGE,
            data: { before, after: page.serialize() },
        });
        ctx.session.flash('success', 'Halaman berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
}
exports.default = PagesController;
//# sourceMappingURL=PagesController.js.map