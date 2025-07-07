"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
exports.default = () => {
    Route_1.default.get('logout', 'LoginController.logout').as('logout');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'LoginController.index').as('show');
        Route_1.default.post('/', 'LoginController.process').as('process');
    })
        .as('login')
        .prefix('login');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'ForgotController.index').as('show');
        Route_1.default.post('/', 'ForgotController.process').as('process');
    })
        .as('forgot')
        .prefix('forgot');
    Route_1.default
        .group(() => {
        Route_1.default.get(':token', 'ResetController.index').as('show');
        Route_1.default.post(':token', 'ResetController.process').as('process');
    })
        .as('reset')
        .prefix('reset')
        .mustBeSigned();
};
//# sourceMappingURL=auth.js.map