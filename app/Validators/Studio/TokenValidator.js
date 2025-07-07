"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class TokenValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            label: Validator_1.schema.string({ trim: true }),
            expired: Validator_1.schema.date.optional(),
        });
        this.messages = {
            'label.required': 'Label tidak boleh kosong.',
        };
    }
}
exports.default = TokenValidator;
//# sourceMappingURL=TokenValidator.js.map