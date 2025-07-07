"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("./Helpers"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class Bps {
    constructor() {
        this.axios = Helpers_1.default.axios({
            baseURL: 'https://webapi.bps.go.id/v1/api/list',
            params: {
                lang: Env_1.default.get('BPS_LANG'),
                domain: Env_1.default.get('BPS_DOMAIN'),
                key: Env_1.default.get('BPS_APP_ID'),
                perpage: '-1',
                nopage: '1',
            },
        });
    }
    async request(model, another = {}) {
        const response = await this.axios.get('/', { params: { model, ...another } });
        return response.data.data?.[1] || null;
    }
    async categories() {
        return (await this.request('subcat'));
    }
    async subjects(category) {
        return (await this.request('subject', { subcat: category }));
    }
    async indicators(subject) {
        return (await this.request('var', { subject }));
    }
    async characteristics(variable) {
        return (await this.request('turvar', { var: variable }));
    }
    async periods(variable) {
        return (await this.request('th', { var: variable }));
    }
    async verticals(variable) {
        return (await this.request('vervar', { var: variable }));
    }
    async data(variable) {
        const { data } = await this.axios.get('/', { params: { model: 'data', var: variable } });
        return data;
    }
}
exports.default = new Bps();
//# sourceMappingURL=Bps.js.map