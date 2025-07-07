"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const tough_cookie_1 = require("tough-cookie");
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
class ShalatController {
    async index(_ctx) {
        const date = (0, moment_1.default)();
        const end = (0, moment_1.default)().endOf('month').set({ hour: 23, minute: 59, second: 59 });
        const diff = end.diff(date);
        const minutes = Math.ceil(diff / (1000 * 60));
        const year = date.year();
        const month = date.month() + 1;
        const current = date.format('YYYY-MM-DD');
        const data = await Adonis_Cache_1.default.remember('api:shalat', minutes, async () => {
            const data = new URLSearchParams();
            const jar = new tough_cookie_1.CookieJar();
            data.append('x', 'c20ad4d76fe97759aa27a0c99bff6710');
            data.append('y', '38af86134b65d0f10fe33d30dd76442e');
            data.append('bln', month.toString());
            data.append('thn', year.toString());
            const client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar, baseURL: 'https://bimasislam.kemenag.go.id' }));
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57',
                'X-Requested-With': 'XMLHttpRequest',
                'DNT': '1',
                'Host': 'bimasislam.kemenag.go.id',
                'Origin': 'https://bimasislam.kemenag.go.id',
                'Referer': 'https://bimasislam.kemenag.go.id/jadwalshalat',
            };
            const { config: { jar: cookie }, } = await client.get('jadwalshalat', { headers });
            const { data: result } = await client.post('ajax/getShalatbln', data, {
                jar: cookie,
                headers,
            });
            return result.data;
        });
        delete data[current].tanggal;
        return data[current];
    }
}
exports.default = ShalatController;
//# sourceMappingURL=ShalatController.js.map