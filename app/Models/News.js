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
const LucidSlugify_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/LucidSlugify");
const LucidSoftDeletes_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/LucidSoftDeletes");
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class News extends (0, Helpers_1.compose)(AppBaseModel_1.default, LucidSoftDeletes_1.SoftDeletes) {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], News.prototype, "uuid", void 0);
__decorate([
    (0, Orm_1.column)(),
    (0, LucidSlugify_1.slugify)({ strategy: 'dbIncrement', fields: ['title'], maxLength: 255 }),
    __metadata("design:type", String)
], News.prototype, "slug", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], News.prototype, "title", void 0);
__decorate([
    (0, AttachmentLite_1.attachment)({ folder: 'news', preComputeUrl: true }),
    __metadata("design:type", Object)
], News.prototype, "thumbnail", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], News.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], News.prototype, "content", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], News.prototype, "category", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], News.prototype, "shared", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], News.prototype, "active", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], News.prototype, "enhancer", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], News.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], News.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], News.prototype, "deletedAt", void 0);
exports.default = News;
//# sourceMappingURL=News.js.map