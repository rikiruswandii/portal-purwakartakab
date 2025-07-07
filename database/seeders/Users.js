"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Users_1.default.createMany([
            {
                uuid: '454342ac-ea26-11ed-8a6a-00155dd467fd',
                login: 'suluh',
                email: 'suluhs@aol.com',
                password: 'dev987@',
                name: 'Super Developer',
                role: UserRole_1.default.DEV,
            },
            {
                uuid: '66791b1e-3da5-11ee-88dc-00155d14a14b',
                login: 'pst',
                email: 'uwu@sesulih.my.id',
                password: 'pst987@',
                name: 'Integration Dev',
                role: UserRole_1.default.INTEGRATION,
            },
            {
                uuid: '4544a79e-ea26-11ed-8a6a-00155dd467fd',
                login: 'admin',
                email: 'admin@purwakartakab.go.id',
                name: 'Super Admin',
                password: 'admin987@',
                role: UserRole_1.default.SUPER,
            },
        ]);
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Users.js.map