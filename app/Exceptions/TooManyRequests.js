"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class TooManyRequestsException extends utils_1.Exception {
    constructor(message = '') {
        super(message, 429, 'TOO_MANY_REQUESTS');
    }
}
exports.default = TooManyRequestsException;
//# sourceMappingURL=TooManyRequests.js.map