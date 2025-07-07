"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./routes/api"));
const http_1 = __importDefault(require("./routes/http"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default
    .group(http_1.default)
    .namespace('App/Controllers/Http');
Route_1.default
    .group(api_1.default)
    .prefix('api')
    .namespace('App/Controllers/Api');
//# sourceMappingURL=routes.js.map