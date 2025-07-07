"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ONE_YEAR = exports.ONE_MONTH = exports.ONE_WEEK = exports.ONE_DAY = exports.ONE_HOUR = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.ONE_HOUR = 60;
exports.ONE_DAY = exports.ONE_HOUR * 24;
exports.ONE_WEEK = exports.ONE_DAY * 7;
exports.ONE_MONTH = exports.ONE_WEEK * 4;
exports.ONE_YEAR = exports.ONE_MONTH * 12;
const cacheConfig = {
    driver: Env_1.default.get('CACHE_DRIVER'),
    drivers: {
        file: {
            driver: 'file',
            path: 'cache/data',
        },
        array: {
            driver: 'array',
            serialize: false,
        },
        database: {
            driver: 'database',
            table: 'cache',
            connection: null,
            lock_connection: null,
        },
        redis: {
            driver: 'redis',
            connection: 'cache',
            lock_connection: 'default',
        },
        memcached: {
            driver: Env_1.default.get('CACHE_DRIVER', 'memcached'),
            persistent_id: Env_1.default.get('MEMCACHED_PERSISTENT_ID'),
            sasl: [Env_1.default.get('MEMCACHED_USERNAME'), Env_1.default.get('MEMCACHED_PASSWORD')],
            options: {},
            servers: {
                host: Env_1.default.get('MEMCACHED_HOST', '127.0.0.1'),
                port: Env_1.default.get('MEMCACHED_PORT', 11211),
                weight: 100,
            },
        },
    },
};
exports.default = cacheConfig;
//# sourceMappingURL=cache.js.map