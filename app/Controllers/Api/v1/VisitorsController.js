"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const ua_parser_js_1 = require("ua-parser-js");
const Visitors_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Visitors"));
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Feedbacks_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Feedbacks"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const BadRequestException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/BadRequestException"));
const TooManyRequests_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/TooManyRequests"));
class VisitorsController {
    async index(_ctx) {
        return await Adonis_Cache_1.default.remember('api:statistics', cache_1.ONE_HOUR, async () => {
            const daily = await Database_1.default.from('statistics')
                .count('ip_address', 'total')
                .where(Database_1.default.raw('DATE(day)'), Database_1.default.raw('DATE(NOW())'))
                .first();
            const weekly = await Database_1.default.from('statistics')
                .count('ip_address', 'total')
                .where(Database_1.default.raw('WEEK(day)'), Database_1.default.raw('WEEK(NOW())'))
                .where(Database_1.default.raw('MONTH(day)'), Database_1.default.raw('MONTH(NOW())'))
                .where(Database_1.default.raw('YEAR(day)'), Database_1.default.raw('YEAR(NOW())'))
                .first();
            const monthly = await Database_1.default.from('statistics')
                .count('ip_address', 'total')
                .where(Database_1.default.raw('MONTH(day)'), Database_1.default.raw('MONTH(NOW())'))
                .where(Database_1.default.raw('YEAR(day)'), Database_1.default.raw('YEAR(NOW())'))
                .first();
            const yearly = await Database_1.default.from('statistics')
                .count('ip_address', 'total')
                .where(Database_1.default.raw('YEAR(day)'), Database_1.default.raw('YEAR(NOW())'))
                .first();
            return {
                daily: daily.total,
                weekly: weekly.total,
                monthly: monthly.total,
                yearly: yearly.total,
            };
        });
    }
    async collect(ctx) {
        const payload = ctx.request.only(['ipAddress', 'userAgent', 'page', 'referer']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    ipAddress: Validator_1.schema.string([Validator_1.rules.ip({ version: 4 })]),
                    userAgent: Validator_1.schema.string(),
                    page: Validator_1.schema.string([
                        Validator_1.rules.url({
                            validateLength: true,
                            requireProtocol: true,
                            protocols: ['http', 'https'],
                            requireHost: true,
                            requireTld: Application_1.default.inProduction,
                            allowedHosts: [new URL(Env_1.default.get('APP_URL')).hostname],
                        }),
                    ]),
                    referer: Validator_1.schema.string([
                        Validator_1.rules.url({
                            validateLength: true,
                            requireProtocol: true,
                            protocols: ['http', 'https'],
                            requireHost: true,
                            requireTld: Application_1.default.inProduction,
                        }),
                    ]),
                }),
            });
            Object.assign(payload, sanitized);
        }
        catch (_) {
            throw new BadRequestException_1.default();
        }
        const lookup = geoip_lite_1.default.lookup(payload.ipAddress);
        const url = new URL(payload.page);
        const page = url.href.replace(url.origin, '');
        const ua = new ua_parser_js_1.UAParser(payload.userAgent);
        const browser = ua.getBrowser().name || 'Postman';
        const device = ua.getDevice().type || 'Desktop';
        const deviceType = device === undefined || !['wearable', 'mobile'].includes(device)
            ? 'Desktop'
            : device === 'tablet'
                ? 'Tablet'
                : 'Mobile';
        return await Visitors_1.default.create({
            ipAddress: payload.ipAddress,
            referer: payload.referer,
            userAgent: payload.userAgent,
            country: lookup?.country?.toLowerCase() || 'id',
            browser,
            deviceType,
            page,
        });
    }
    async feedback(ctx) {
        const ipAddress = ctx.request.ip();
        const isExist = await Redis_1.default.get(`feedback:${ipAddress}`);
        if (isExist) {
            throw new TooManyRequests_1.default();
        }
        const payload = ctx.request.only(['rate', 'experience']);
        try {
            const sanitized = await ctx.request.validate({
                schema: Validator_1.schema.create({
                    rate: Validator_1.schema.enum([1, 2, 3, 4, 5]),
                    experience: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(1500)]),
                }),
            });
            Object.assign(payload, sanitized);
        }
        catch (_) {
            throw new BadRequestException_1.default();
        }
        await Redis_1.default.set(`feedback:${ipAddress}`, 'true', 'EX', 3600);
        return await Feedbacks_1.default.create({
            rate: payload.rate,
            experience: payload.experience,
        });
    }
}
exports.default = VisitorsController;
//# sourceMappingURL=VisitorsController.js.map