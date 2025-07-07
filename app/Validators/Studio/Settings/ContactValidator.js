"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ContactValidator {
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
                Validator_1.rules.maxLength(320),
            ]),
            phone: Validator_1.schema.string([Validator_1.rules.maxLength(16)]),
            address: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(255)]),
            facebook: Validator_1.schema.string.optional({ trim: true }, [Validator_1.rules.maxLength(64)]),
            twitter: Validator_1.schema.string.optional({ trim: true }, [Validator_1.rules.maxLength(16)]),
            youtube: Validator_1.schema.string.optional({ trim: true }, [Validator_1.rules.maxLength(64)]),
            instagram: Validator_1.schema.string.optional({ trim: true }, [Validator_1.rules.maxLength(32)]),
        });
        this.messages = {
            'email.required': 'Alamat surel tidak boleh kosong.',
            'email.email': 'Alamat surel tidak valid.',
            'email.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'phone.required': 'Nomor telepon tidak boleh kosong.',
            'phone.maxLength': 'Nomor telepon maksimal {{ options.maxLength }} karakter.',
            'address.required': 'Alamat tidak boleh kosong.',
            'address.maxLength': 'Nomor telepon maksimal {{ options.maxLength }} karakter.',
            'facebook.maxLength': 'Facebook maksimal {{ options.maxLength }} karakter.',
            'twitter.maxLength': 'Twitter maksimal {{ options.maxLength }} karakter.',
            'youtube.maxLength': 'YouTube maksimal {{ options.maxLength }} karakter.',
            'instagram.maxLength': 'Instagram harus {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = ContactValidator;
//# sourceMappingURL=ContactValidator.js.map