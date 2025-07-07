"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unpoly_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Unpoly"));
class UnpolyProvider {
    constructor(app) {
        this.app = app;
    }
    async boot() {
        const HttpContext = this.app.container.resolveBinding('Adonis/Core/HttpContext');
        const Server = this.app.container.resolveBinding('Adonis/Core/Server');
        HttpContext.getter('up', function () {
            return new Unpoly_1.default(this);
        }, true);
        Server.hooks.before(async (ctx) => {
            ctx.view.share({ up: ctx.up });
        });
        Server.hooks.after(async (ctx) => {
            ctx.up.commit();
        });
    }
}
exports.default = UnpolyProvider;
UnpolyProvider.needsApplication = true;
//# sourceMappingURL=UnpolyProvider.js.map