"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const sentryConfig = {
    enabled: true,
    dsn: Env_1.default.get('SENTRY_DSN'),
};
exports.default = sentryConfig;
//# sourceMappingURL=sentry.js.map