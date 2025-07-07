"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class NatresValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            image: this.ctx.request.param('uuid') ? Schemas_1.optional.file : Schemas_1.required.file,
            caption: Validator_1.schema.string({ trim: true, escape: true }),
        });
        this.messages = {
            'title.required': 'Nama tidak boleh kosong.',
            'title.maxLength': 'Nama maksimal {{ options.maxLength }} karakter.',
            'image.required': 'Gambar tidak boleh kosong.',
            'image.file': 'Gambar tidak boleh kosong.',
            'image.size': 'Ukuran gambar harus kurang dari {{ options.size }}.',
            'image.extnames': 'Ekstensi gambar tidak diperbolehkan.',
            'caption.required': 'Keterangan tidak boleh kosong.',
        };
    }
}
exports.default = NatresValidator;
//# sourceMappingURL=NatresValidator.js.map