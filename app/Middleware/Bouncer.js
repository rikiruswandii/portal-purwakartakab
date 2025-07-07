"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    async handle(ctx, next, permissions) {
        await ctx.bouncer.authorize('permission', permissions?.map((role) => Number(role)));
        await next();
    }
}
exports.default = default_1;
//# sourceMappingURL=Bouncer.js.map