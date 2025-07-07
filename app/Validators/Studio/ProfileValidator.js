"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ProfileValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            username: Validator_1.schema.string.optional({ trim: true }, [
                Validator_1.rules.unique({
                    caseInsensitive: true,
                    table: 'users',
                    column: 'login',
                    whereNot: this.ctx.auth.use('web').user.uuid
                        ? { uuid: this.ctx.auth.use('web').user.uuid }
                        : undefined,
                }),
                Validator_1.rules.alphaNum({ allow: ['underscore'] }),
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(50),
            ]),
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email({
                    allowIpDomain: false,
                    allowUtf8LocalPart: true,
                    domainSpecificValidation: true,
                    ignoreMaxLength: false,
                    requireTld: true,
                }),
                Validator_1.rules.unique({
                    caseInsensitive: false,
                    table: 'users',
                    column: 'email',
                    whereNot: this.ctx.auth.use('web').user.uuid
                        ? { uuid: this.ctx.auth.use('web').user.uuid }
                        : undefined,
                }),
                Validator_1.rules.maxLength(320),
            ]),
            name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.alpha({ allow: ['space'] }), Validator_1.rules.maxLength(251)]),
        });
        this.messages = {
            'username.required': 'Nama pengguna tidak boleh kosong.',
            'username.unique': 'Nama pengguna sudah digunakan.',
            'username.alphaNum': 'Nama pengguna tidak valid.',
            'username.minLength': 'Nama pengguna minimal {{ options.minLength }} karakter.',
            'username.maxLength': 'Nama pengguna maksimal {{ options.maxLength }} karakter.',
            'email.required': 'Alamat surel tidak boleh kosong.',
            'email.email': 'Alamat surel tidak valid.',
            'email.unique': 'Alamat surel sudah digunakan.',
            'email.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'name.required': 'Nama lengkap tidak boleh kosong.',
            'name.alpha': 'Nama lengkap tidak valid.',
            'name.maxLength': 'Nama lengkap maksimal {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = ProfileValidator;
//# sourceMappingURL=ProfileValidator.js.map