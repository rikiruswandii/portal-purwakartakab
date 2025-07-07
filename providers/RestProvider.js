"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Http_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Consts/Http"));
const HttpMessage_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Consts/HttpMessage"));
class RestProvider {
    constructor(app) {
        this.app = app;
    }
    register() { }
    boot() {
        const Response = this.app.container.use('Adonis/Core/Response');
        Response.macro('spec', function (spec) {
            const statusCode = spec.code || 200;
            const code = Http_1.default[statusCode];
            const data = spec.data && spec.data !== null ? spec.data : undefined;
            const meta = spec.meta && spec.meta !== null ? spec.meta : undefined;
            const errors = spec.errors && spec.errors !== null ? spec.errors : undefined;
            const message = spec.message || HttpMessage_1.default[statusCode] || HttpMessage_1.default[200];
            this.ctx.response.status(statusCode);
            return { statusCode, code, message, data, meta, errors };
        });
    }
    ready() { }
    shutdown() { }
}
exports.default = RestProvider;
//# sourceMappingURL=RestProvider.js.map