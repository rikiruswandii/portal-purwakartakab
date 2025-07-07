"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Tokens_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Tokens"));
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Tokens_1.default.create({
            name: 'Front-end Security',
            type: 'api',
            token: '4998a647271655074b48acb6ebd033eb53bdc9ffd7ff654629562fffcfa182ef',
            user: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            for: 1,
        });
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Token.js.map