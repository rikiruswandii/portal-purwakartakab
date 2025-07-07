"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const GovType_1 = global[Symbol.for('ioc.use')]("App/Enums/GovType");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class GovernmentsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            logo: Schemas_1.optional.file,
            alias: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            address: Validator_1.schema.string({ trim: true, escape: true }),
            email: Validator_1.schema.string.optional({ trim: true }, [
                Validator_1.rules.email({
                    allowIpDomain: false,
                    allowUtf8LocalPart: true,
                    domainSpecificValidation: true,
                    ignoreMaxLength: false,
                    requireTld: true,
                }),
                Validator_1.rules.maxLength(320),
            ]),
            phone: Validator_1.schema.string.optional([Validator_1.rules.maxLength(16)]),
            fax: Validator_1.schema.string.optional([Validator_1.rules.maxLength(16)]),
            url: Validator_1.schema.string.optional([
                Validator_1.rules.url({
                    requireHost: true,
                    requireProtocol: true,
                    protocols: ['http', 'https'],
                    requireTld: true,
                    validateLength: true,
                }),
            ]),
            type: Validator_1.schema.enum(Object.keys(GovType_1.GovTypeDesc)),
        });
        this.messages = {
            'name.required': 'Nama OPD tidak boleh kosong.',
            'name.maxLength': 'Nama OPD maksimal {{ options.maxLength }} karakter.',
            'logo.file': 'Ikon tidak boleh kosong.',
            'logo.size': 'Ukuran ikon harus kurang dari {{ options.size }}.',
            'logo.extnames': 'Ekstensi ikon tidak diperbolehkan.',
            'alias.required': 'Alias OPD tidak boleh kosong.',
            'alias.maxLength': 'Alias OPD maksimal {{ options.maxLength }} karakter.',
            'address.required': 'Alamat tidak boleh kosong.',
            'email.email': 'Alamat surel tidak valid.',
            'email.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'phone.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'fax.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'url.url': 'Tautan OPD tidak valid.',
            'type.required': 'Jenis OPD tidak boleh kosong.',
            'type.enum': 'Jenis OPD tidak valid.',
        };
    }
}
exports.default = GovernmentsValidator;
//# sourceMappingURL=GovernmentsValidator.js.map