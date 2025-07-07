"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class PasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            password: Validator_1.schema.string(),
            newpass: Validator_1.schema.string([Validator_1.rules.minLength(8), Validator_1.rules.confirmed('repass')]),
            repass: Validator_1.schema.string([Validator_1.rules.minLength(8), Validator_1.rules.confirmed('newpass')]),
        });
        this.messages = {
            required: 'Kata sandi tidak boleh kosong.',
            minLength: 'Kata sandi minimal {{ options.minLength }} karakter.',
            confirmed: 'Kata sandi baru tidak sama.',
        };
    }
}
exports.default = PasswordValidator;
//# sourceMappingURL=PasswordValidator.js.map