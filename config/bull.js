"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const bullConfig = {
    connection: Env_1.default.get('BULL_CONNECTION', 'local'),
    connections: {
        local: {
            host: Env_1.default.get('BULL_REDIS_HOST', 'localhost'),
            port: Env_1.default.get('BULL_REDIS_PORT', 6379),
            password: Env_1.default.get('BULL_REDIS_PASSWORD', ''),
        },
    },
};
exports.default = bullConfig;
//# sourceMappingURL=bull.js.map