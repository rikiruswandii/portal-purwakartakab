"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ForgotValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email({
                    allowIpDomain: false,
                    allowUtf8LocalPart: true,
                    domainSpecificValidation: true,
                    ignoreMaxLength: false,
                    requireTld: true,
                }),
            ]),
        });
        this.messages = {
            'email.required': 'Alamat surel tidak boleh kosong.',
            'email.email': 'Alamat surel tidak valid.',
        };
    }
}
exports.default = ForgotValidator;
//# sourceMappingURL=ForgotValidator.js.map