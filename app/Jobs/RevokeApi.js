"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class RevokeApi {
    constructor() {
        this.key = 'revoke:api';
    }
    async handle(job) {
        await Database_1.default.from('tokens').where('token', job.data).delete();
    }
}
exports.default = RevokeApi;
//# sourceMappingURL=RevokeApi.js.map