"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Sentry_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Sentry"));
const HttpMessage_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Consts/HttpMessage"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const HttpExceptionHandler_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HttpExceptionHandler"));
class ExceptionHandler extends HttpExceptionHandler_1.default {
    constructor() {
        super(Logger_1.default);
        this.statusPages = {
            '403': 'errors/unauthorized',
            '404': 'errors/not-found',
            '500..599': 'errors/server-error',
        };
    }
    async handle(error, ctx) {
        const ignored = [
            'E_ROUTE_NOT_FOUND',
            'E_INVALID_API_TOKEN',
            'E_UNAUTHORIZED_ACCESS',
            'E_VALIDATION_FAILURE',
            'BAD_REQUEST',
            'TOO_MANY_REQUESTS',
            'NOT_ACCEPTABLE',
            'NOT_FOUND',
            'FORBIDDEN',
            'UNAUTHORIZED',
        ];
        if (!ignored.includes(error.code) && Application_1.default.inProduction) {
            Sentry_1.default.captureException(error);
        }
        if (!ctx.request.url().startsWith('/api')) {
            if (error.code === 'E_VALIDATION_FAILURE') {
                ctx.up.setTarget(ctx.up.getFailTarget());
            }
            if (!error.status || this.expandedStatusPages[error.status]) {
                ctx.up.fullReload();
            }
            return super.handle(error, ctx);
        }
        switch (error.code) {
            case 'E_ROUTE_NOT_FOUND':
                return ctx.response.spec({
                    code: 404,
                    message: HttpMessage_1.default[404],
                });
            case 'E_INVALID_API_TOKEN':
            case 'E_UNAUTHORIZED_ACCESS':
                return ctx.response.spec({
                    code: 401,
                    message: HttpMessage_1.default[401],
                });
            case 'E_VALIDATION_FAILURE':
                return ctx.response.spec({
                    code: 400,
                    message: HttpMessage_1.default[400],
                });
        }
        error.message = String(error.message || '')
            .replace(`${error.code}:`, '')
            .trim();
        return ctx.response.spec({
            code: error.status || 500,
            message: error.message || '',
        });
    }
}
exports.default = ExceptionHandler;
//# sourceMappingURL=Handler.js.map