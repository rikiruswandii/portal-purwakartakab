"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assets = exports.validator = exports.profiler = exports.logger = exports.http = exports.appKey = void 0;
const proxy_addr_1 = __importDefault(require("proxy-addr"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
exports.appKey = Env_1.default.get('APP_KEY');
exports.http = {
    allowMethodSpoofing: true,
    subdomainOffset: 2,
    generateRequestId: true,
    trustProxy: proxy_addr_1.default.compile('loopback'),
    etag: true,
    jsonpCallbackName: 'callback',
    cookie: {
        domain: '',
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: false,
        sameSite: false,
    },
};
exports.logger = {
    name: Env_1.default.get('APP_NAME'),
    enabled: true,
    level: Env_1.default.get('LOG_LEVEL', 'info'),
    prettyPrint: Application_1.default.inDev,
};
exports.profiler = {
    enabled: true,
    blacklist: [],
    whitelist: [],
};
exports.validator = {};
exports.assets = {
    driver: Env_1.default.get('ASSETS_DRIVER'),
    publicPath: Application_1.default.publicPath('assets'),
    script: {
        attributes: {},
    },
    style: {
        attributes: {},
    },
};
//# sourceMappingURL=app.js.map