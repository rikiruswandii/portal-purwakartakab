"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tokens_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Tokens"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const Encryption_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Encryption"));
const TokenValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/TokenValidator"));
class IntegrationssController {
    async index(ctx) {
        const tokens = await Tokens_1.default.query()
            .where('user', ctx.auth.use('web').user.uuid)
            .where('for', 2)
            .orderBy('created_at', 'desc');
        const data = tokens.map((token) => {
            token['uuid'] = Encryption_1.default.encrypt(token.id, '1d');
            return token;
        });
        return ctx.view.render('studio/integrations', {
            page: 'Integrasi',
            tokens: data,
            postman: Env_1.default.get('POSTMAN_COLLECTION'),
        });
    }
    async create(ctx) {
        const payload = ctx.request.only(['label', 'expired']);
        try {
            const sanitized = await ctx.request.validate(TokenValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        let expired = payload.expired ? new Date(payload.expired).getTime() - Date.now() : null;
        expired = expired ? expired / 86400000 : null;
        expired = expired ? Number(expired?.toFixed(0) || 0) + 2 : null;
        const token = await ctx.auth.use('api').generate(ctx.auth.use('web').user, {
            name: payload.label,
            expiresIn: expired ? `${expired}d` : undefined,
        });
        await Tokens_1.default.query().where('token', token.tokenHash).update('for', 2);
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.CREATE_TOKEN,
            data: { after: token.toJSON() },
        });
        ctx.session.flash('token', token.token);
        return ctx.response.redirect().back();
    }
    async revoke(ctx) {
        const hash = ctx.request.param('hash');
        const id = Encryption_1.default.decrypt(hash);
        const token = await Tokens_1.default.find(id);
        if (!token) {
            ctx.session.flash('failed', 'Token tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const before = token.serialize();
        await token.delete();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.REVOKE_TOKEN,
            data: { before, after: null },
        });
        ctx.session.flash('success', 'Token berhasil dicabut.');
        return ctx.response.redirect().back();
    }
}
exports.default = IntegrationssController;
//# sourceMappingURL=IntegrationsController.js.map