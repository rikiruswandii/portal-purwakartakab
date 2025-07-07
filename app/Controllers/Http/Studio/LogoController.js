"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pages"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
class LogoController {
    async pre(ctx) {
        const page = await Pages_1.default.findBy('slug', 'lambang-identitas');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['pre']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    pre: Validator_1.schema.string(),
                }),
                messages: {
                    'pre.required': 'Isi konten tidak boleh kosong.',
                },
            });
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        const content = JSON.parse(page.content);
        content.pre = payload.pre;
        page.content = JSON.stringify(content);
        await page.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_PAGE,
            data: { before, after: page.serialize() },
        });
        ctx.session.flash('success', 'Halaman berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async section(ctx) {
        const page = await Pages_1.default.findBy('slug', 'lambang-identitas');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['index', 'title', 'caption']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    index: Validator_1.schema.number(),
                    title: Validator_1.schema.string(),
                    caption: Validator_1.schema.string(),
                }),
                messages: {
                    'index.required': 'Indeks array tidak boleh kosong.',
                    'title.required': 'Nama tidak boleh kosong.',
                    'caption.required': 'Keterangan tidak boleh kosong.',
                },
            });
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        const content = JSON.parse(page.content);
        content.section[payload.index] = { title: payload.title, caption: payload.caption };
        page.content = JSON.stringify(content);
        await page.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_PAGE,
            data: { before, after: page.serialize() },
        });
        ctx.session.flash('success', 'Halaman berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async color(ctx) {
        const page = await Pages_1.default.findBy('slug', 'lambang-identitas');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['index', 'hex', 'name', 'caption']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    index: Validator_1.schema.number(),
                    hex: Validator_1.schema.string([Validator_1.rules.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]),
                    name: Validator_1.schema.string(),
                    caption: Validator_1.schema.string(),
                }),
                messages: {
                    'index.required': 'Indeks array tidak boleh kosong.',
                    'hex.required': 'Kode warna tidak boleh kosong.',
                    'hex.regex': 'Kode warna tidak valid.',
                    'name.required': 'Nama tidak boleh kosong.',
                    'caption.required': 'Keterangan tidak boleh kosong.',
                },
            });
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        const content = JSON.parse(page.content);
        content.color[payload.index] = {
            hex: payload.hex,
            name: payload.name,
            caption: payload.caption,
        };
        page.content = JSON.stringify(content);
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
exports.default = LogoController;
//# sourceMappingURL=LogoController.js.map