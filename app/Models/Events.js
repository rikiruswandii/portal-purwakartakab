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
const AppBaseModel_1 = __importDefault(require("./AppBaseModel"));
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const LucidSoftDeletes_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/LucidSoftDeletes");
class Events extends (0, Helpers_1.compose)(AppBaseModel_1.default, LucidSoftDeletes_1.SoftDeletes) {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Events.prototype, "uuid", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Events.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Events.prototype, "date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Events.prototype, "start", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Events.prototype, "end", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Events.prototype, "category", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Events.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Events.prototype, "place", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Events.prototype, "source", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Events.prototype, "enhancer", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Events.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Events.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], Events.prototype, "deletedAt", void 0);
exports.default = Events;
//# sourceMappingURL=Events.js.map