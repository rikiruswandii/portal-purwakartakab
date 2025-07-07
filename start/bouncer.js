"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.policies = exports.actions = void 0;
const Bouncer_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer"));
exports.actions = Bouncer_1.default.define('permission', (user, permissions) => {
    return (typeof permissions === 'undefined' || permissions.length <= 0 || permissions.includes(user.role));
}).actions;
exports.policies = Bouncer_1.default.registerPolicies({}).policies;
//# sourceMappingURL=bouncer.js.map