"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypeSniffing = exports.hsts = exports.xFrame = exports.dnsPrefetch = exports.csrf = exports.csp = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.csp = {
    enabled: Env_1.default.get('NODE_ENV') === 'production',
    directives: {
        defaultSrc: ["'self'", '@nonce'],
        scriptSrc: ["'self'", '@nonce', "'unsafe-eval'", 'cdn.jsdelivr.net', 'cdn.quilljs.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 's3.purwakartakab.go.id'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'cdn.jsdelivr.net'],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        childSrc: ["'self'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        reportUri: '/api/v1/csp-report',
    },
    reportOnly: true,
};
exports.csrf = {
    enabled: true,
    exceptRoutes: (ctx) => {
        const endpoints = ['(app\\/(subscribe|verify))'];
        const url = ctx.request.url();
        const regex = new RegExp(`/(${endpoints.join('|')})$`);
        return regex.test(url) || url.startsWith('/api');
    },
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
};
exports.dnsPrefetch = {
    enabled: true,
    allow: true,
};
exports.xFrame = {
    enabled: true,
    action: 'SAMEORIGIN',
};
exports.hsts = {
    enabled: true,
    maxAge: '730 days',
    includeSubDomains: true,
    preload: true,
};
exports.contentTypeSniffing = {
    enabled: true,
};
//# sourceMappingURL=shield.js.map