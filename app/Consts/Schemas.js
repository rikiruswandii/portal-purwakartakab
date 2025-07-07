"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optional = exports.required = void 0;
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const extnames = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'webp',
    'svg',
    'PNG',
    'JPG',
    'JPEG',
    'GIF',
    'WEBP',
    'SVG',
];
const required = {
    file: Validator_1.schema.file({ size: '2mb', extnames }),
};
exports.required = required;
const optional = {
    file: Validator_1.schema.file.optional({ size: '2mb', extnames }),
};
exports.optional = optional;
//# sourceMappingURL=Schemas.js.map