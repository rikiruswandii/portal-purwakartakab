"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v1_1 = __importDefault(require("./api/v1"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
exports.default = () => {
    Route_1.default
        .group(v1_1.default)
        .prefix('v1')
        .namespace('App/Controllers/Api/v1');
};
//# sourceMappingURL=api.js.map