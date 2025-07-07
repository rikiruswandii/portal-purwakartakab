"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class InfographicsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            image: this.ctx.request.param('uuid') ? Schemas_1.optional.file : Schemas_1.required.file,
            popup: Validator_1.schema.string.optional(),
            href: Validator_1.schema.string.optional([
                Validator_1.rules.requiredIfExists('popup'),
                Validator_1.rules.url({
                    requireHost: true,
                    requireProtocol: true,
                    protocols: ['http', 'https'],
                    requireTld: true,
                    validateLength: true,
                }),
            ]),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'title.required': 'Judul pengumuman tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal {{ options.maxLength }} karakter.',
            'image.required': 'Gambar tidak boleh kosong.',
            'image.file': 'Gambar tidak boleh kosong.',
            'image.size': 'Ukuran gambar harus kurang dari {{ options.size }}.',
            'image.extnames': 'Ekstensi gambar tidak diperbolehkan.',
            'href.requiredIfExists': 'Aksi popup tidak boleh kosong.',
            'href.url': 'Aksi popup tidak berisi tautan yang valid.',
        };
    }
}
exports.default = InfographicsValidator;
//# sourceMappingURL=InfographicsValidator.js.map