"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pages"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class GoalsController {
    async vision(ctx) {
        const page = await Pages_1.default.findBy('slug', 'visi-misi');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['title', 'subtitle']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    title: Validator_1.schema.string(),
                    subtitle: Validator_1.schema.string(),
                }),
                messages: {
                    'title.required': 'Judul visi tidak boleh kosong.',
                    'subtitle.required': 'Deskripsi visi tidak boleh kosong.',
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
        content.vision = { title: payload.title, subtitle: payload.subtitle };
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
    async mission(ctx) {
        const page = await Pages_1.default.findBy('slug', 'visi-misi');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['index', 'title', 'subtitle']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    index: Validator_1.schema.number.optional(),
                    title: Validator_1.schema.string(),
                    subtitle: Validator_1.schema.string(),
                }),
                messages: {
                    'index.number': 'Indeks array tidak valid.',
                    'title.required': 'Misi tidak boleh kosong.',
                    'subtitle.required': 'Keterangan tidak boleh kosong.',
                },
            });
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = page.serialize();
        const mission = { title: payload.title, subtitle: payload.subtitle };
        const content = JSON.parse(page.content);
        if (payload.index) {
            content.mission[payload.index] = mission;
        }
        else {
            content.mission.push(mission);
        }
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
    async pop(ctx) {
        const page = await Pages_1.default.findBy('slug', 'visi-misi');
        if (!page) {
            ctx.session.flash('failed', 'Halaman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const index = ctx.request.param('index');
        const before = page.serialize();
        const content = JSON.parse(page.content);
        if (index > -1 && index in content.mission) {
            content.mission.splice(index, 1);
        }
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
exports.default = GoalsController;
//# sourceMappingURL=GoalsController.js.map