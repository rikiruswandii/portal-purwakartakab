"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const Sidebar_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Consts/Sidebar"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserRole_1 = __importStar(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
View_1.default.global('DateInstance', new Date());
View_1.default.global('DateTime', luxon_1.DateTime);
View_1.default.global('sidebars', Sidebar_1.default);
View_1.default.global('UserRole', UserRole_1.default);
View_1.default.global('UserRoleDesc', UserRole_1.UserRoleDesc);
View_1.default.global('base_url', Helpers_1.default.baseUrl);
View_1.default.global('datetime', Helpers_1.default.dateTime);
View_1.default.global('parse_date', Helpers_1.default.parseDate);
View_1.default.global('avatar', (user) => {
    return `<span>${(user.name[0] + user.name[1]).toUpperCase()}</span>`;
});
View_1.default.global('logo', function (type) {
    if (type === 'small')
        return this.asset('assets/images/icon.png');
    if (type === 'light')
        return this.asset('assets/images/logo-light.png');
    if (type === 'dark')
        return this.asset('assets/images/logo-dark.png');
    return this.asset('assets/images/logo.png');
});
View_1.default.global('renderAttr', (attributes) => {
    let html = ' ';
    for (const key in attributes)
        html += `${key}="${attributes[key]}" `;
    return html.trim();
});
View_1.default.global('old', function (key) {
    return this.flashMessages.all()?.old[key] || '';
});
View_1.default.global('sidebarRoute', function (x) {
    if (x === null)
        return 'javascript:void(0)';
    const isParam = typeof x !== 'string';
    const route = this.route(isParam ? x[0] : x, isParam ? x[1] : {});
    return Helpers_1.default.baseUrl(route);
});
View_1.default.global('current_url', function () {
    return Helpers_1.default.baseUrl(this.request.url(true));
});
//# sourceMappingURL=view.js.map