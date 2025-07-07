"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
class AppProvider {
    constructor(app) {
        this.app = app;
    }
    register() { }
    boot() {
        const Request = this.app.container.use('Adonis/Core/Request');
        const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database');
        Request.macro('appendQs', function (data) {
            const request = this.ctx.request;
            const current = request.completeUrl().replace(/\/$/, '');
            const query = request.qs();
            return `${current}/?${querystring_1.default.stringify({ ...query, ...data })}`;
        });
        ModelQueryBuilder.macro('getCount', async function (column) {
            this.knexQuery.clearSelect();
            const result = await this.select(column || 'uuid');
            return result.length || 0;
        });
    }
    async ready() { }
    shutdown() { }
}
exports.default = AppProvider;
AppProvider.needsApplication = true;
//# sourceMappingURL=AppProvider.js.map