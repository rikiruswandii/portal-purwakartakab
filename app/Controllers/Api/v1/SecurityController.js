"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Csps_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Csps"));
class SecurityController {
    async csp(ctx) {
        const body = ctx.request.body();
        if ('csp-report' in body) {
            const data = body['csp-report'];
            await Csps_1.default.create({
                ipAddress: ctx.request.ip() || '',
                userAgent: ctx.request.header('user-agent') || '',
                blockedUri: data['blocked-uri'] || '',
                disposition: data['disposition'] || '',
                documentUri: data['document-uri'] || '',
                effectiveDirective: data['effective-directive'] || '',
                originalPolicy: data['original-policy'] || '',
                referrer: data['referrer'] || '',
                scriptSample: data['script-sample'] || '',
                statusCode: data['status-code'] || '',
                violatedDirective: data['violated-directive'] || '',
            });
        }
        return { collected: true };
    }
}
exports.default = SecurityController;
//# sourceMappingURL=SecurityController.js.map