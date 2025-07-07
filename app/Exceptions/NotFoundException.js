"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class NotFoundException extends utils_1.Exception {
    constructor(message = '') {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.default = NotFoundException;
//# sourceMappingURL=NotFoundException.js.map