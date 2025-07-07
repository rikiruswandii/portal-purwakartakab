"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class UnexceptedException extends utils_1.Exception {
    constructor(message = '') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
    }
}
exports.default = UnexceptedException;
//# sourceMappingURL=UnexceptedException.js.map