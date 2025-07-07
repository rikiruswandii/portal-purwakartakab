"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const standalone_1 = require("@adonisjs/auth/build/standalone");
class default_1 {
    constructor() {
        this.redirectTo = '/auth/login';
    }
    async authenticate({ auth, request }) {
        const guard = 'api';
        if (await auth.use(guard).check()) {
            auth.defaultGuard = guard;
            return true;
        }
        const referer = request.header('referer');
        const origin = request.header('origin');
        if (referer && origin) {
            const front = new URL(Env_1.default.get('APP_FRONT'));
            const client = new URL(referer);
            if (origin === front.origin && client.host === front.host && client.origin === front.origin) {
                return true;
            }
        }
        throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guard, this.redirectTo);
    }
    async handle(ctx, next) {
        await this.authenticate(ctx);
        await next();
    }
}
exports.default = default_1;
//# sourceMappingURL=Api.js.map