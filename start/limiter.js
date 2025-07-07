"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLimiters = void 0;
const services_1 = require("@adonisjs/limiter/build/services");
exports.httpLimiters = services_1.Limiter.define('global', () => {
    return services_1.Limiter.allowRequests(500).every('1 day');
}).httpLimiters;
//# sourceMappingURL=limiter.js.map