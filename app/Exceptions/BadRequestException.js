"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class BadRequestException extends utils_1.Exception {
    constructor(message = '') {
        super(message, 400, 'BAD_REQUEST');
    }
}
exports.default = BadRequestException;
//# sourceMappingURL=BadRequestException.js.map