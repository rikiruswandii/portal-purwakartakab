"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    async handle(ctx, next) {
        const isApi = /^\/api\//.test(ctx.request.url().replace(/\/$/, ''));
        if (isApi)
            return await next();
        ctx.response.header('referrer-policy', 'same-origin');
        ctx.response.header('permissions-policy', 'sync-xhr=(self),fullscreen=(self)');
        const body = ctx.request.body();
        ctx.session.flash('old', body);
        ctx.view.share({
            constants: JSON.stringify({}),
        });
        await ctx.auth.use('web').authenticate();
        await next();
    }
}
exports.default = default_1;
//# sourceMappingURL=Shafima.js.map