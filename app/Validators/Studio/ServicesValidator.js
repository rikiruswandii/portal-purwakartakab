"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ServicesValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            logo: this.ctx.request.param('uuid') ? Schemas_1.optional.file : Schemas_1.required.file,
            caption: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            alias: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            url: Validator_1.schema.string([
                Validator_1.rules.url({
                    requireHost: true,
                    requireProtocol: true,
                    protocols: ['http', 'https'],
                    requireTld: true,
                    validateLength: true,
                }),
            ]),
            government: [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(this.ctx.auth.user.role)
                ? Validator_1.schema.string([Validator_1.rules.exists({ table: 'governments', column: 'uuid' })])
                : Validator_1.schema.string.optional(),
        });
        this.messages = {
            'name.required': 'Nama OPD tidak boleh kosong.',
            'name.maxLength': 'Nama OPD maksimal {{ options.maxLength }} karakter.',
            'logo.required': 'Logo tidak boleh kosong.',
            'logo.file': 'Logo tidak boleh kosong.',
            'logo.size': 'Ukuran logo harus kurang dari {{ options.size }}.',
            'logo.extnames': 'Ekstensi logo tidak diperbolehkan.',
            'caption.required': 'Keterangan tidak boleh kosong.',
            'caption.maxLength': 'Keterangan maksimal {{ options.maxLength }} karakter.',
            'alias.required': 'Alias OPD tidak boleh kosong.',
            'alias.maxLength': 'Alias OPD maksimal {{ options.maxLength }} karakter.',
            'url.required': 'Tautan OPD tidak boleh kosong.',
            'url.url': 'Tautan OPD tidak valid.',
            'government.required': 'OPD tidak boleh kosong.',
            'government.exists': 'OPD tidak dapat ditemukan.',
        };
    }
}
exports.default = ServicesValidator;
//# sourceMappingURL=ServicesValidator.js.map