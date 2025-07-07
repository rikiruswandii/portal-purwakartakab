"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const News_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/News"));
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Articles_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Articles"));
const Visitors_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Visitors"));
const Services_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Services"));
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Dashboard_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Dashboard"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Infographics_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Infographics"));
const Announcements_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Announcements"));
const Requests_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Requests"));
const Tokens_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Tokens"));
class OverviewController {
    async overview(ctx) {
        const user = ctx.auth.user;
        const refresh = ctx.request.input('refresh', false);
        const whereEnhancer = Dashboard_1.default.whereEnhancer(user);
        let interval = Number(ctx.request.input('s', 30));
        let token = await Redis_1.default.get(`studio:token:${user.uuid}`);
        if (![7, 15, 30].includes(interval)) {
            interval = 30;
        }
        if (!token || !!refresh) {
            const auth = await ctx.auth.use('api').generate(user, {
                name: 'Dashboard Purpose',
            });
            token = auth.token;
            await Redis_1.default.set(`studio:token:${user.uuid}`, token);
        }
        const newsData = await News_1.default.query()
            .count('uuid', 'total')
            .sum('active', 'active')
            .whereNull('deleted_at')
            .whereRaw(whereEnhancer)
            .first();
        const articleData = await Articles_1.default.query()
            .count('uuid', 'total')
            .sum('active', 'active')
            .whereNull('deleted_at')
            .whereRaw(whereEnhancer)
            .first();
        const infographicData = await Infographics_1.default.query()
            .count('uuid', 'total')
            .sum('active', 'active')
            .whereNull('deleted_at')
            .whereRaw(whereEnhancer)
            .first();
        const announcementData = await Announcements_1.default.query()
            .count('uuid', 'total')
            .sum('active', 'active')
            .whereNull('deleted_at')
            .whereRaw(whereEnhancer)
            .first();
        const serviceData = await Services_1.default.query()
            .select('government')
            .count('uuid', 'total')
            .whereNull('deleted_at')
            .groupBy('government');
        const countryData = await Visitors_1.default.query()
            .select('country')
            .count('uuid', 'total')
            .where('created_at', '>=', Database_1.default.raw(`DATE_SUB(NOW(), INTERVAL ${interval} DAY)`))
            .groupBy('country')
            .orderBy('total', 'desc');
        const browserData = await Visitors_1.default.query()
            .select('browser')
            .count('uuid', 'total')
            .whereNot('page', 'LIKE', '/redirect?url=%')
            .whereNot('page', 'LIKE', '%.map')
            .groupBy('ip_address', 'browser');
        const viewData = await Visitors_1.default.query()
            .select('page')
            .count('uuid', 'total')
            .whereNot('page', 'LIKE', '/redirect?url=%')
            .whereNot('page', 'LIKE', '%.map')
            .groupBy('page')
            .orderBy('total', 'desc')
            .limit(9);
        const deviceData = await Visitors_1.default.query()
            .select(Database_1.default.raw("'Desktop' AS device_type"))
            .select(Dashboard_1.default.deviceQuery.visitorsNow('Desktop', interval))
            .select(Dashboard_1.default.deviceQuery.visitorsPrevious('Desktop', interval))
            .select(Dashboard_1.default.deviceQuery.percentageChange('Desktop', interval))
            .whereRaw(`created_at >= NOW() - INTERVAL ${interval * 2} DAY AND device_type = 'Desktop'`)
            .unionAll((table) => {
            table
                .select(Database_1.default.raw("'Mobile' AS device_type"))
                .select(Dashboard_1.default.deviceQuery.visitorsNow('Mobile', interval))
                .select(Dashboard_1.default.deviceQuery.visitorsPrevious('Mobile', interval))
                .select(Dashboard_1.default.deviceQuery.percentageChange('Mobile', interval))
                .from('visitors')
                .whereRaw(`created_at >= NOW() - INTERVAL ${interval * 2} DAY AND device_type = 'Mobile'`);
        })
            .unionAll((table) => {
            table
                .select(Database_1.default.raw("'Tablet' AS device_type"))
                .select(Dashboard_1.default.deviceQuery.visitorsNow('Tablet', interval))
                .select(Dashboard_1.default.deviceQuery.visitorsPrevious('Tablet', interval))
                .select(Dashboard_1.default.deviceQuery.percentageChange('Tablet', interval))
                .from('visitors')
                .whereRaw(`created_at >= NOW() - INTERVAL ${interval * 2} DAY AND device_type = 'Tablet'`);
        });
        const news = Dashboard_1.default.statsNews(newsData);
        const articles = Dashboard_1.default.statsArticles(articleData);
        const infographics = Dashboard_1.default.statsInfographics(infographicData);
        const announcements = Dashboard_1.default.statsAnnouncements(announcementData);
        const services = Dashboard_1.default.statsServices(serviceData, user);
        const countryName = new Intl.DisplayNames(['id'], { type: 'region' });
        const countries = Dashboard_1.default.mapCountry(countryData, countryName);
        const browsers = Dashboard_1.default.calculateBrowsers(browserData);
        const views = Dashboard_1.default.mapViews(viewData);
        const devices = Dashboard_1.default.reduceDevice(deviceData);
        const jsonDevice = Object.values(devices).map(({ visitorsNow }) => Number(visitorsNow || 0));
        return ctx.view.render('studio/overview', {
            page: 'Ikhtisar',
            interval,
            news,
            articles,
            infographics,
            announcements,
            services,
            countries,
            browsers,
            views,
            devices,
            json: { devices: jsonDevice, countries, token },
        });
    }
    async integration(ctx) {
        const tokens = await Tokens_1.default.query()
            .count('id', 'total')
            .where('for', 2)
            .where('user', ctx.auth.use('web').user.uuid)
            .first();
        const expired = await Tokens_1.default.query()
            .count('id', 'total')
            .where('for', 2)
            .where('user', ctx.auth.use('web').user.uuid)
            .whereNotNull('expires_at')
            .whereRaw('expires_at > CURDATE()')
            .first();
        const requests = await Requests_1.default.query()
            .count('uuid', 'total')
            .whereRaw('MONTH(created_at) = MONTH(NOW())')
            .whereRaw('YEAR(created_at) = YEAR(NOW())')
            .where('developer', ctx.auth.use('web').user.uuid)
            .first();
        const sql = Requests_1.default.query()
            .whereRaw('MONTH(created_at) = MONTH(NOW())')
            .whereRaw('YEAR(created_at) = YEAR(NOW())')
            .where('developer', ctx.auth.use('web').user.uuid)
            .groupBy('endpoint')
            .toQuery();
        const [[endpoint]] = await Database_1.default.rawQuery(`SELECT count('uuid') total FROM (${sql}) requests`);
        return ctx.view.render('studio/statistics', {
            tokens: tokens?.$extras.total || 0,
            expired: expired?.$extras.total || 0,
            requests: requests?.$extras.total || 0,
            endpoint: endpoint.total || 0,
        });
    }
    async index(ctx) {
        if (ctx.auth.use('web').user.role === UserRole_1.default.INTEGRATION) {
            return await this.integration(ctx);
        }
        else {
            return await this.overview(ctx);
        }
    }
}
exports.default = OverviewController;
//# sourceMappingURL=OverviewController.js.map