"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const CamelCaseNamingStrategy_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Strategies/CamelCaseNamingStrategy"));
class AppBaseModel extends Orm_1.BaseModel {
}
exports.default = AppBaseModel;
AppBaseModel.namingStrategy = new CamelCaseNamingStrategy_1.default();
//# sourceMappingURL=AppBaseModel.js.map