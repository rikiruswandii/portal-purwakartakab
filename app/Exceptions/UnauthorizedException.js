"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class UnauthorizedException extends utils_1.Exception {
    constructor(message = '') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
exports.default = UnauthorizedException;
//# sourceMappingURL=UnauthorizedException.js.map