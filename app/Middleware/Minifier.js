"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_tags_1 = __importDefault(require("html-tags"));
const html_minifier_1 = require("html-minifier");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class default_1 {
    async handle(ctx, next) {
        const isApi = /^\/api\//.test(ctx.request.url().replace(/\/$/, ''));
        const method = ctx.request.method();
        const accepts = ctx.request.accepts([]) ?? [];
        await next();
        if (method === 'GET' && accepts.includes('text/html') && Application_1.default.inProduction && !isApi) {
            const body = ctx.response.getBody();
            if (!Helpers_1.types.isString(body))
                return;
            const string = body.trim().slice(0, 1000);
            const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
            const full = new RegExp(html_tags_1.default.map((tag) => `<${tag}\\b[^>]*>`).join('|'), 'i');
            if (string !== '' && (basic.test(string) || full.test(string))) {
                const minified = (0, html_minifier_1.minify)(body, {
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                    preserveLineBreaks: false,
                    collapseInlineTagWhitespace: false,
                    collapseWhitespace: true,
                });
                const result = minified.replace(/"\/assets\//g, '"assets/');
                ctx.response.send(result);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=Minifier.js.map