"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class OfficersValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            rank: Validator_1.schema.string.optional({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            position: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            echelon: Validator_1.schema.string.optional({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            education: Validator_1.schema.string.optional({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            government: Validator_1.schema.string([Validator_1.rules.exists({ table: 'governments', column: 'uuid' })]),
        });
        this.messages = {
            'name.required': 'Nama pejabat tidak boleh kosong.',
            'name.maxLength': 'Nama pejabat maksimal {{ options.maxLength }} karakter.',
            'rank.maxLength': 'Pangkat maksimal {{ options.maxLength }} karakter.',
            'position.required': 'Posisi tidak boleh kosong.',
            'position.maxLength': 'Posisi maksimal {{ options.maxLength }} karakter.',
            'echelon.maxLength': 'Eselon maksimal {{ options.maxLength }} karakter.',
            'education.maxLength': 'Pendidikan terakhir maksimal {{ options.maxLength }} karakter.',
            'government.required': 'OPD tidak boleh kosong.',
            'government.exists': 'OPD tidak dapat ditemukan.',
        };
    }
}
exports.default = OfficersValidator;
//# sourceMappingURL=OfficersValidator.js.map