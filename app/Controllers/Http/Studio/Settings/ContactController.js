"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Settings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Settings"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const ContactValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/Settings/ContactValidator"));
class ContactController {
    async index(ctx) {
        return ctx.view.render('studio/settings/contact', {
            page: 'Pengaturan Situs',
        });
    }
    async save(ctx) {
        const payload = ctx.request.only([
            'email',
            'phone',
            'fax',
            'address',
            'facebook',
            'twitter',
            'youtube',
            'instagram',
            'tiktok',
        ]);
        try {
            const sanitized = await ctx.request.validate(ContactValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const trx = await Database_1.default.transaction();
        for (let key in payload) {
            let code = 'contact.';
            if (['email', 'phone', 'fax', 'address'].includes(key)) {
                code += key;
            }
            else {
                code = 'social.' + key;
            }
            const setting = await Settings_1.default.findBy('code', code, { client: trx });
            if (setting) {
                setting.content = payload[key] || '';
                await setting.save();
            }
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Kontak gagal diperbarui.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.UPDATE_SETTINGS,
            enhancer: ctx.auth.use('web').user.uuid,
            data: { after: payload },
        });
        ctx.session.flash('success', 'Kontak berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
}
exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map