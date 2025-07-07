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
const GeneralValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/Settings/GeneralValidator"));
class GeneralController {
    async index(ctx) {
        return ctx.view.render('studio/settings/general', {
            page: 'Pengaturan Situs',
        });
    }
    async save(ctx) {
        const payload = ctx.request.only([
            'name',
            'title',
            'tagline',
            'holder',
            'description',
            'keywords',
        ]);
        try {
            const sanitized = await ctx.request.validate(GeneralValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const trx = await Database_1.default.transaction();
        for (let key in payload) {
            const setting = await Settings_1.default.findBy('code', `app.${key}`, { client: trx });
            if (setting) {
                setting.content = payload[key];
                await setting.save();
            }
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Pengaturan gagal diperbarui.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.UPDATE_SETTINGS,
            enhancer: ctx.auth.use('web').user.uuid,
            data: { after: payload },
        });
        ctx.session.flash('success', 'Pengaturan berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
}
exports.default = GeneralController;
//# sourceMappingURL=GeneralController.js.map