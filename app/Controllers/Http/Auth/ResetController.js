"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Hashkit_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Hashkit"));
const ResetValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Auth/ResetValidator"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class ResetController {
    async index(ctx) {
        if (ctx.auth.use('web').isLoggedIn) {
            return ctx.response.redirect().toRoute('studio.overview');
        }
        const token = ctx.request.param('token');
        const user = await Users_1.default.findBy('reset_token', token);
        if (!user) {
            throw new NotFoundException_1.default();
        }
        return ctx.view.render('auth/reset', {
            page: 'Atur Kata Sandi',
        });
    }
    async process(ctx) {
        const token = ctx.request.param('token');
        const payload = ctx.request.only(['newpass']);
        try {
            const sanitized = await ctx.request.validate(ResetValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const user = await Users_1.default.findBy('reset_token', token);
        if (!user) {
            ctx.session.flash('failed', 'Pengguna tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        let counter = 1;
        if (user.resetToken) {
            const reverted = Hashkit_1.default.revert(user.resetToken);
            if (reverted[1] || false) {
                counter = Number(reverted[1]);
            }
        }
        const regenerate = Hashkit_1.default.for(Helpers_1.default.generateRandomNumber(), counter, 404);
        user.password = payload.newpass;
        user.resetToken = regenerate;
        await user.save();
        ctx.session.flash('success', 'Kata sandi berhasil diatur ulang.');
        return ctx.response.redirect().toRoute('auth.login.show');
    }
}
exports.default = ResetController;
//# sourceMappingURL=ResetController.js.map