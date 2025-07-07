"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ResetValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            newpass: Validator_1.schema.string([Validator_1.rules.minLength(8), Validator_1.rules.confirmed('repass')]),
        });
        this.messages = {
            'required': 'Kata sandi tidak boleh kosong.',
            'minLength': 'Kata sandi minimal harus {{ options.minLength }} karakter.',
            'repass.confirmed': 'Verifikasi kata sandi tidak sama.',
        };
    }
}
exports.default = ResetValidator;
//# sourceMappingURL=ResetValidator.js.map