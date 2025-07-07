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
class Csps extends AppBaseModel_1.default {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Csps.prototype, "uuid", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "ipAddress", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "userAgent", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "blockedUri", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "disposition", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "documentUri", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "effectiveDirective", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "originalPolicy", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "referrer", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "scriptSample", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Csps.prototype, "statusCode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Csps.prototype, "violatedDirective", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Csps.prototype, "solved", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: false }),
    __metadata("design:type", luxon_1.DateTime)
], Csps.prototype, "createdAt", void 0);
exports.default = Csps;
//# sourceMappingURL=Csps.js.map