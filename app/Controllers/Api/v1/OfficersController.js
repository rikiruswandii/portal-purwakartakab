"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Officers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Officers"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const route_model_binding_1 = require("@adonisjs/route-model-binding");
class OfficersController {
    async index(ctx) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const sort = ctx.request.input('sort', 'created_at');
        const order = ctx.request.input('order', 'asc');
        const officers = await Officers_1.default.query()
            .where((table) => {
            table
                .orWhereRaw(q ? `name LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `rank LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `position LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `echelon LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `education LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .whereNull('deleted_at')
            .where('active', true)
            .orderBy(sort, order)
            .paginate(page, limit);
        const data = officers.all().map((item) => ({
            uuid: item.uuid,
            name: item.name,
            rank: item.rank,
            position: item.position,
            echelon: item.echelon,
            education: item.education,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
        return { data, meta: officers.getMeta() };
    }
    async gov(ctx, government) {
        const q = ctx.request.input('search');
        const limit = ctx.request.input('limit', 10);
        const page = ctx.request.input('page', 1);
        const sort = ctx.request.input('sort', 'created_at');
        const order = ctx.request.input('order', 'asc');
        const officers = await Officers_1.default.query()
            .where((table) => {
            table
                .orWhereRaw(q ? `name LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `rank LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `position LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `echelon LIKE ?` : `true = ?`, [q ? `%${q}%` : true])
                .orWhereRaw(q ? `education LIKE ?` : `true = ?`, [q ? `%${q}%` : true]);
        })
            .whereNull('deleted_at')
            .where('active', true)
            .where('government', government.uuid)
            .orderBy(sort, order)
            .paginate(page, limit);
        const data = officers.all().map((item) => ({
            uuid: item.uuid,
            name: item.name,
            rank: item.rank,
            position: item.position,
            echelon: item.echelon,
            education: item.education,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
        return { data, meta: officers.getMeta() };
    }
}
__decorate([
    (0, route_model_binding_1.bind)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Governments_1.default]),
    __metadata("design:returntype", Promise)
], OfficersController.prototype, "gov", null);
exports.default = OfficersController;
//# sourceMappingURL=OfficersController.js.map