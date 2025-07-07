"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const Requests_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Requests"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class default_1 {
    async handle(ctx, next) {
        const ipAddress = ctx.request.ip();
        const isApi = /^\/api\//.test(ctx.request.url().replace(/\/$/, ''));
        if (isApi) {
            ctx.response.header('x-ip-address', ipAddress);
            ctx.response.header('Access-Control-Allow-Methods', '*');
            ctx.response.header('Access-Control-Allow-Headers', '*');
            if (Application_1.default.inDev) {
                ctx.response.header('Access-Control-Allow-Origin', '*');
            }
        }
        await next();
        if (isApi) {
            const accepts = ctx.request.accepts([]) ?? [];
            if (!accepts.includes('application/json') && !accepts.includes('*/*')) {
                return ctx.response.send(ctx.response.spec({ code: 406 }));
            }
            const body = ctx.response.getBody();
            if (!!body && typeof body === 'object') {
                const json = 'serialize' in body ? body.serialize() : body;
                const meta = 'meta' in json && json.meta !== null ? json.meta : undefined;
                const data = 'data' in json && json.data !== null ? json.data : json;
                const token = ctx.auth.use('api').token;
                if (token && token?.meta.for === 2) {
                    const lookup = geoip_lite_1.default.lookup(ipAddress);
                    await Requests_1.default.create({
                        ipAddress: ipAddress,
                        country: lookup?.country?.toLowerCase() || 'id',
                        endpoint: ctx.request.url(),
                        token: token.meta.id,
                        developer: token.userId.toString(),
                    });
                }
                const response = ctx.response.spec({ code: 200, data, meta });
                ctx.response.send(response);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=Rest.js.map