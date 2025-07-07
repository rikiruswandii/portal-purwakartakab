"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    async handle(ctx, next) {
        await ctx.auth.check();
        await next();
    }
}
exports.default = default_1;
//# sourceMappingURL=SilentAuth.js.map