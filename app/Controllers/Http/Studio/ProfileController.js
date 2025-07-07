"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Activities_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Activities"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const ProfileValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/ProfileValidator"));
class ProfileController {
    async index(ctx) {
        const logged = ctx.auth.use('web').user;
        const latest = await Activities_1.default.query()
            .where('enhancer', logged.uuid)
            .where('status', UserActivity_1.default.LOGIN)
            .orderBy('created_at', 'desc')
            .first();
        const government = await Governments_1.default.query().where('uuid', logged.government).first();
        return ctx.view.render('studio/profile', {
            page: 'Profil',
            logged,
            latest,
            government,
        });
    }
    async save(ctx) {
        const payload = ctx.request.only(['email', 'name']);
        try {
            const sanitized = await ctx.request.validate(ProfileValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const unique = await Users_1.default.query()
            .where('email', payload.email)
            .whereNot('uuid', ctx.auth.use('web').user.uuid)
            .first();
        if (unique && unique.email === payload.email) {
            ctx.session.flash('failed', 'Alamat surel sudah digunakan.');
            return ctx.response.redirect().back();
        }
        await Users_1.default.query()
            .where('uuid', ctx.auth.use('web').user.uuid)
            .update({ email: payload.email, name: payload.name });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.UPDATE_PROFILE,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        ctx.session.flash('success', 'Informasi personal berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
}
exports.default = ProfileController;
//# sourceMappingURL=ProfileController.js.map