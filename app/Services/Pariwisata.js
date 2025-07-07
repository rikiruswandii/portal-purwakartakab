"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("./Helpers"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class Pariwisata {
    constructor() {
        this.axios = Helpers_1.default.axios({
            baseURL: 'https://portal.pariwisata.purwakartakab.go.id/api',
            params: { key: Env_1.default.get('PST_PARIWISATA') },
        });
    }
    async wisata() {
        const { data: { data }, } = await this.axios.get('wisata');
        return data;
    }
    async hotel() {
        const { data: { data }, } = await this.axios.get('hotel');
        return data;
    }
    async kuliner() {
        const { data: { data }, } = await this.axios.get('kuliner');
        return data;
    }
    async angkot() {
        const { data: { data }, } = await this.axios.get('angkot');
        return data;
    }
}
exports.default = new Pariwisata();
//# sourceMappingURL=Pariwisata.js.map