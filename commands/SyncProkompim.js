"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Events_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Events"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const standalone_1 = require("@adonisjs/core/build/standalone");
class SyncProkompim extends standalone_1.BaseCommand {
    async run() {
        const request = Helpers_1.default.axios({
            baseURL: 'https://prokompim.purwakartakab.go.id',
            params: { key: Env_1.default.get('PST_PROKOMPIM') },
        });
        const response = await request.get('api/agenda');
        const enhancer = await Users_1.default.first();
        await Events_1.default.query().where('source', 'prokompim').delete();
        await Events_1.default.createMany(response.data.data.map((item) => ({
            title: Helpers_1.default.trim(item.judul),
            date: item.tanggal,
            start: item.mulai || null,
            end: item.selesai || null,
            category: item.kategori ? Helpers_1.default.trim(item.kategori) : null,
            type: item.type === 'Offline' || item.type === null ? 0 : 1,
            place: item.tempat || null,
            source: 'prokompim',
            enhancer: enhancer.uuid,
            createdAt: item.created_at,
        })));
        this.logger.info('success');
    }
}
exports.default = SyncProkompim;
SyncProkompim.commandName = 'sync:prokompim';
SyncProkompim.description = 'Singkronasikan agenda dari website Prokompim';
SyncProkompim.settings = { loadApp: true, stayAlive: false };
//# sourceMappingURL=SyncProkompim.js.map