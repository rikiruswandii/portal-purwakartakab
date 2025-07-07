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
const luxon_1 = require("luxon");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const AppBaseModel_1 = __importDefault(require("./AppBaseModel"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const LucidSoftDeletes_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/LucidSoftDeletes");
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class Users extends (0, Helpers_1.compose)(AppBaseModel_1.default, LucidSoftDeletes_1.SoftDeletes) {
    static async hashPassword(users) {
        if (users.$dirty.password) {
            users.password = await Hash_1.default.make(users.password);
        }
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Users.prototype, "uuid", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Users.prototype, "login", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: undefined }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, AttachmentLite_1.attachment)({ folder: 'user', preComputeUrl: true }),
    __metadata("design:type", Object)
], Users.prototype, "avatar", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Users.prototype, "role", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Users.prototype, "government", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Users.prototype, "rememberMeToken", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Users.prototype, "resetToken", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Users.prototype, "enhancer", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], Users.prototype, "deletedAt", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users]),
    __metadata("design:returntype", Promise)
], Users, "hashPassword", null);
exports.default = Users;
//# sourceMappingURL=Users.js.map