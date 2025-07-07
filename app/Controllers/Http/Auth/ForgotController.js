"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const Hashkit_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Hashkit"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const ForgotValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Auth/ForgotValidator"));
class ForgotController {
    async index(ctx) {
        if (ctx.auth.use('web').isLoggedIn) {
            return ctx.response.redirect().toRoute('studio.overview');
        }
        return ctx.view.render('auth/forgot', {
            page: 'Lupa Kata Sandi',
        });
    }
    async process(ctx) {
        const payload = ctx.request.only(['email']);
        try {
            const sanitized = await ctx.request.validate(ForgotValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const user = await Users_1.default.findBy('email', payload.email);
        if (user) {
            let counter = 1;
            if (user.resetToken) {
                const reverted = Hashkit_1.default.revert(user.resetToken);
                if (reverted[1] || false) {
                    counter = Number(reverted[1]) + 1;
                }
            }
            const token = Hashkit_1.default.for(Helpers_1.default.generateRandomNumber(), counter);
            user.resetToken = token;
            await user.save();
            await Mail_1.default.sendLater((message) => {
                const subject = `Atur Ulang Kata Sandi ${ctx.settings.app.name}`;
                message
                    .to(user.email)
                    .from(Env_1.default.get('SMTP_USERNAME'))
                    .subject(subject)
                    .htmlView('email/forgot', {
                    subject,
                    settings: ctx.settings,
                    name: user.name,
                    url: Route_1.default.makeSignedUrl('auth.reset.show', { token }, { expiresIn: '1h' }),
                });
            });
        }
        ctx.session.flash('success', 'Kamu akan segera mendapatkan surel jika alamat surel ' +
            `tersebut benar-benar terdaftar di ${ctx.settings.app.name}.`);
        return ctx.response.redirect().back();
    }
}
exports.default = ForgotController;
//# sourceMappingURL=ForgotController.js.map