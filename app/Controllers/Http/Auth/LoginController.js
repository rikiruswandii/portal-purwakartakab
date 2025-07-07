"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Sessions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Sessions"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const services_1 = require("@adonisjs/limiter/build/services");
const LoginValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Auth/LoginValidator"));
class LoginController {
    async index(ctx) {
        if (ctx.auth.use('web').isLoggedIn) {
            return ctx.response.redirect().toRoute('studio.overview');
        }
        return ctx.view.render('auth/login', {
            page: 'Masuk',
        });
    }
    async process(ctx) {
        const payload = ctx.request.only(['uid', 'password']);
        try {
            const sanitized = await ctx.request.validate(LoginValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const throttle = `login_${payload.uid}_${ctx.request.ip()}`;
        const limiter = services_1.Limiter.use({
            requests: 5 - 1,
            duration: '15 mins',
            blockDuration: '20 mins',
        });
        if (await limiter.isBlocked(throttle)) {
            ctx.session.flash('failed', 'Upaya login habis. Silakan coba setelah beberapa waktu.');
            return ctx.response.redirect().back();
        }
        const user = await Users_1.default.query()
            .orWhere('login', payload.uid)
            .orWhere('email', payload.uid)
            .first();
        if (!user) {
            await limiter.increment(throttle);
            ctx.session.flash('failed', 'Pengguna tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const sessionId = ctx.session.sessionId;
        const verify = await Hash_1.default.verify(user.password, payload.password);
        if (!verify) {
            await limiter.increment(throttle);
            await Event_1.default.emit('user:activity', {
                ctx,
                status: UserActivity_1.default.LOGIN_FAILED,
                enhancer: user.uuid,
            });
            ctx.session.flash('failed', 'Kata sandi tidak benar.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.LOGIN,
            enhancer: user.uuid,
        });
        await ctx.auth.use('web').login(user);
        await limiter.delete(throttle);
        await Event_1.default.emit('session:changed', [sessionId, ctx.session.sessionId]);
        await Sessions_1.default.create({
            id: ctx.session.sessionId,
            ipAddress: ctx.request.ip(),
            userAgent: ctx.request.header('user-agent'),
            enhancer: user.uuid,
        });
        return ctx.response.redirect().toRoute('studio.overview');
    }
    async logout(ctx) {
        await ctx.auth.use('web').logout();
        return ctx.response.redirect().back();
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map