"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashids_1 = __importDefault(require("hashids"));
const app_1 = global[Symbol.for('ioc.use')]("Config/app");
class Hashkit extends hashids_1.default {
    constructor() {
        super(app_1.appKey);
    }
    for(...numbers) {
        numbers = numbers.map((number) => Number(number));
        return this.encode([220604, ...numbers]);
    }
    revert(encoded) {
        const numbers = this.decode(encoded).splice(1);
        return numbers.length > 1 ? numbers.map((number) => number.toString()) : numbers[0].toString();
    }
}
exports.default = new Hashkit();
//# sourceMappingURL=Hashkit.js.map