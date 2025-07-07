"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            uid: Validator_1.schema.string({ escape: true, trim: true }),
            password: Validator_1.schema.string(),
        });
        this.messages = {
            'uid.required': 'Nama pengguna atau alamat surel tidak boleh kosong.',
            'password.required': 'Kata sandi tidak boleh kosong.',
            'password.minLength': 'Kata sandi minimal harus {{ options.minLength }} karakter.',
        };
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map