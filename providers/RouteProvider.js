"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class RouteProvider {
    constructor(app) {
        this.app = app;
    }
    register() { }
    async boot() {
        const Route = this.app.container.use('Adonis/Core/Route');
        const signer = async (ctx, next) => {
            if (!ctx.request.hasValidSignature()) {
                throw new NotFoundException_1.default();
            }
            await next();
        };
        Route.Route.macro('mustBeSigned', function () {
            this.middleware(signer);
            return this;
        });
        Route.RouteGroup.macro('mustBeSigned', function () {
            this.middleware(signer);
            return this;
        });
    }
    ready() { }
    shutdown() { }
}
exports.default = RouteProvider;
RouteProvider.needsApplication = true;
//# sourceMappingURL=RouteProvider.js.map