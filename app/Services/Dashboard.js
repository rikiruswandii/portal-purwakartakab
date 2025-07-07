"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class Dashboard {
    static statsNews(data) {
        return {
            total: data?.$extras?.total || 0,
            active: data?.active || 0,
            inactive: Number(data?.$extras?.total || 0) - Number(data?.active || 0),
        };
    }
    static statsArticles(data) {
        return {
            total: data?.$extras?.total || 0,
            active: data?.active || 0,
            inactive: Number(data?.$extras?.total || 0) - Number(data?.active || 0),
        };
    }
    static statsInfographics(data) {
        return {
            total: data?.$extras?.total || 0,
            active: data?.active || 0,
            inactive: Number(data?.$extras?.total || 0) - Number(data?.active || 0),
        };
    }
    static statsAnnouncements(data) {
        return {
            total: data?.$extras?.total || 0,
            active: data?.active || 0,
            inactive: Number(data?.$extras?.total || 0) - Number(data?.active || 0),
        };
    }
    static statsServices(services, user) {
        const total = services.reduce((acc, curr) => acc + Number(curr.$extras.total), 0);
        const mine = services.find((s) => s.government === user.government)?.$extras?.total || 0;
        return { total, mine };
    }
    static mapCountry(countries, parser) {
        const total = countries.reduce((acc, curr) => acc + Number(curr.$extras.total), 0);
        return countries.map((country) => {
            const item = { ...country.toJSON(), ...country.$extras };
            return {
                code: item.country,
                name: parser.of(item.country.toUpperCase()),
                total: Number(item.total),
                percentage: ((Number(item.total) / total) * 100).toFixed(2),
            };
        });
    }
    static calculateBrowsers(browsers) {
        const total = browsers.reduce((acc, curr) => acc + Number(curr.$extras.total), 0);
        const result = {
            Chrome: { total: 0, percentage: '0.00' },
            Firefox: { total: 0, percentage: '0.00' },
            Safari: { total: 0, percentage: '0.00' },
            UCBrowser: { total: 0, percentage: '0.00' },
            Edge: { total: 0, percentage: '0.00' },
            Other: { total: 0, percentage: '0.00' },
        };
        browsers.map((browser) => {
            const item = { ...browser.toJSON(), ...browser.$extras };
            item.browser =
                item.browser === 'IE'
                    ? 'Edge'
                    : item.browser === 'Mobile Safari'
                        ? 'Safari'
                        : !['Chrome', 'Firefox', 'Safari', 'UCBrowser', 'Edge'].includes(item.browser)
                            ? 'Other'
                            : item.browser;
            result[item.browser] = {
                total: (result[item.browser].total || 0) + Number(item.total),
                percentage: ((((result[item.browser].total || 0) + Number(item.total)) / total) *
                    100).toFixed(2),
            };
        });
        return result;
    }
    static mapViews(views) {
        return views.map((view) => ({ page: view.page, total: view.$extras.total }));
    }
    static reduceDevice(devices) {
        const data = devices.map((device) => ({ ...device.toJSON(), ...device.$extras }));
        const total = data.reduce((acc, curr) => acc + Number(curr.visitorsNow), 0);
        return data.reduce((acc, item) => {
            const deviceType = item.deviceType.toLowerCase();
            item['percentageChange'] = item.percentageChange || '0';
            item['percentage'] = ((Number(item.visitorsNow) / total) * 100).toFixed(2);
            item['class'] = item.percentageChange.includes('-') ? 'down' : 'up';
            item['percentageChange'] = Number(String(item.percentageChange).replace('-', '')).toFixed(2);
            item['change'] = item.percentageChange;
            delete item.deviceType;
            delete item.percentageChange;
            acc[deviceType] = item;
            return acc;
        }, {});
    }
    static whereEnhancer(user, table) {
        return [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(user.role)
            ? '1 = 1'
            : (table ? `${table}.` : '') + `enhancer = '${user.uuid}'`;
    }
    static whereGovernment(user, table) {
        return [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(user.role)
            ? '1 = 1'
            : (table ? `${table}.` : '') + `government = '${user.government}'`;
    }
}
exports.default = Dashboard;
Dashboard.deviceQuery = {
    visitorsNow: (device, interval) => {
        return Database_1.default.raw(`SUM(CASE WHEN created_at >= NOW() - INTERVAL ${interval} DAY AND device_type = '${device}' THEN 1 ELSE 0 END) AS visitorsNow`);
    },
    visitorsPrevious: (device, interval) => {
        return Database_1.default.raw(`SUM(CASE WHEN created_at >= NOW() - INTERVAL ${interval * 2} DAY AND created_at < NOW() - INTERVAL ${interval} DAY AND device_type = '${device}' THEN 1 ELSE 0 END) AS visitorsPrevious`);
    },
    percentageChange: (device, interval) => {
        return Database_1.default.raw(`(SUM(CASE WHEN created_at >= NOW() - INTERVAL ${interval} DAY AND device_type = '${device}' THEN 1 ELSE 0 END) - SUM(CASE WHEN created_at >= NOW() - INTERVAL ${interval * 2} DAY AND created_at < NOW() - INTERVAL ${interval} DAY AND device_type = '${device}' THEN 1 ELSE 0 END)) * 100 / NULLIF(SUM(CASE WHEN created_at >= NOW() - INTERVAL ${interval * 2} DAY AND device_type = '${device}' THEN 1 ELSE 0 END), 0) AS percentageChange`);
    },
};
//# sourceMappingURL=Dashboard.js.map