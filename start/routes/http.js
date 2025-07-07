"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./http/auth"));
const studio_1 = __importDefault(require("./http/studio"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
exports.default = () => {
    Route_1.default.on('/').redirect('studio.redirect');
    Route_1.default
        .group(auth_1.default)
        .prefix('auth')
        .namespace('App/Controllers/Http/Auth')
        .as('auth');
    Route_1.default
        .group(studio_1.default)
        .prefix('studio')
        .namespace('App/Controllers/Http/Studio')
        .middleware('auth:web')
        .as('studio');
};
//# sourceMappingURL=http.js.map