"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Activities_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Activities"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const PasswordValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/PasswordValidator"));
class PasswordController {
    async index(ctx) {
        const { user: logged } = ctx.auth.use('web');
        const latest = await Activities_1.default.query()
            .where('enhancer', logged.uuid)
            .where('status', UserActivity_1.default.LOGIN)
            .orderBy('created_at', 'desc')
            .first();
        return ctx.view.render('studio/password', {
            page: 'Kata Sandi',
            logged,
            latest,
        });
    }
    async save(ctx) {
        const payload = ctx.request.only(['password', 'newpass']);
        try {
            const sanitized = await ctx.request.validate(PasswordValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const current = ctx.auth.use('web').user.password;
        const validate = await Hash_1.default.verify(current, payload.password);
        if (!validate) {
            ctx.session.flash('failed', 'Kata sandi saat ini tidak benar.');
            return ctx.response.redirect().back();
        }
        const equal = await Hash_1.default.verify(current, payload.newpass);
        if (equal) {
            ctx.session.flash('failed', 'Kata sandi baru tidak bisa digunakan.');
            return ctx.response.redirect().back();
        }
        ctx.auth.use('web').user.password = payload.newpass;
        await ctx.auth.use('web').user.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.CHANGE_PASSWORD,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        ctx.session.flash('success', 'Kata sandi berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
}
exports.default = PasswordController;
//# sourceMappingURL=PasswordController.js.map