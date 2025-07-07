"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleDesc = void 0;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["DEV"] = 0] = "DEV";
    UserRole[UserRole["INTEGRATION"] = 1] = "INTEGRATION";
    UserRole[UserRole["SUPER"] = 2] = "SUPER";
    UserRole[UserRole["OPD"] = 3] = "OPD";
})(UserRole || (UserRole = {}));
exports.UserRoleDesc = ['Pengembang', 'Pengembang', 'Super Admin', 'Kontributor'];
exports.default = UserRole;
//# sourceMappingURL=UserRole.js.map