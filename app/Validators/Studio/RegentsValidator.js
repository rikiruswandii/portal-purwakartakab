"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class RegentsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            chief: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(255)]),
            chief_photo: this.ctx.request.param('uuid') ? Schemas_1.optional.file : Schemas_1.required.file,
            deputy: Validator_1.schema.string.optional({ trim: true, escape: true }, [Validator_1.rules.maxLength(255)]),
            deputy_photo: Schemas_1.optional.file,
            start: Validator_1.schema.date({ format: 'yyyy' }),
            end: Validator_1.schema.date({ format: 'yyyy' }),
            description: Validator_1.schema.string.optional([Validator_1.rules.maxLength(32)]),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'chief.required': 'Nama lengkap bupati tidak boleh kosong.',
            'chief.maxLength': 'Nama lengkap bupati maksimal {{ options.maxLength }} karakter.',
            'chief_photo.required': 'Foto bupati tidak boleh kosong.',
            'chief_photo.file': 'Foto bupati tidak boleh kosong.',
            'chief_photo.size': 'Ukuran foto bupati harus kurang dari {{ options.size }}.',
            'chief_photo.extnames': 'Ekstensi foto bupati tidak diperbolehkan.',
            'deputy.required': 'Nama lengkap wakil bupati tidak boleh kosong.',
            'deputy.maxLength': 'Nama lengkap wakil bupati maksimal {{ options.maxLength }} karakter.',
            'deputy_photo.required': 'Foto wakil bupati tidak boleh kosong.',
            'deputy_photo.file': 'Foto wakil bupati tidak boleh kosong.',
            'deputy_photo.size': 'Ukuran foto wakil bupati harus kurang dari {{ options.size }}.',
            'deputy_photo.extnames': 'Ekstensi foto wakil bupati tidak diperbolehkan.',
            'start.required': 'Awal periode tidak boleh kosong.',
            'start.date': 'Tanggal awal periode tidak valid.',
            'end.required': 'Akhir periode tidak boleh kosong.',
            'end.date': 'Tanggal akhir periode tidak valid.',
            'description.maxLength': 'Deskripsi maksimal {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = RegentsValidator;
//# sourceMappingURL=RegentsValidator.js.map