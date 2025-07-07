"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/limiter/build/config");
exports.default = (0, config_1.limiterConfig)({
    default: 'redis',
    stores: {
        redis: {
            client: 'redis',
            connectionName: 'local',
        },
        db: {
            client: 'db',
            dbName: Env_1.default.get('MYSQL_DB_NAME'),
            tableName: 'limiters',
            connectionName: 'mysql',
            clearExpiredByTimeout: true,
        },
    },
});
//# sourceMappingURL=limiter.js.map