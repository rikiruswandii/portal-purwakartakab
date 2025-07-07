"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/auth/build/standalone");
class default_1 {
    constructor() {
        this.redirectTo = '/auth/login';
    }
    async authenticate(auth, guards) {
        let guardLastAttempted;
        for (let guard of guards) {
            guardLastAttempted = guard;
            if (await auth.use(guard).check()) {
                auth.defaultGuard = guard;
                return true;
            }
        }
        throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guardLastAttempted, this.redirectTo);
    }
    async handle(ctx, next, customGuards) {
        const guards = customGuards.length ? customGuards : [ctx.auth.name];
        await this.authenticate(ctx.auth, guards);
        await next();
    }
}
exports.default = default_1;
//# sourceMappingURL=Auth.js.map