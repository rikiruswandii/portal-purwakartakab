"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class PagesValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: this.ctx.request.url().includes('sekretaris-daerah')
                ? Validator_1.schema.string()
                : Validator_1.schema.string.optional(),
            content: Validator_1.schema.string(),
            source: this.ctx.request.url().includes('tugas-fungsi')
                ? Validator_1.schema.string([
                    Validator_1.rules.url({
                        requireHost: true,
                        requireProtocol: true,
                        protocols: ['http', 'https'],
                        requireTld: true,
                        validateLength: true,
                    }),
                ])
                : Validator_1.schema.string.optional([
                    Validator_1.rules.url({
                        requireHost: true,
                        requireProtocol: true,
                        protocols: ['http', 'https'],
                        requireTld: true,
                        validateLength: true,
                    }),
                ]),
            thumbnail: Schemas_1.optional.file,
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'name.required': 'Nama tidak boleh kosong.',
            'content.required': 'Isi konten tidak boleh kosong.',
            'source.required': 'Sumber dokumen tidak boleh kosong.',
            'thumbnail.file': 'Thumbnail tidak boleh kosong.',
            'thumbnail.size': 'Ukuran thumbnail harus kurang dari {{ options.size }}.',
            'thumbnail.extnames': 'Ekstensi thumbnail tidak diperbolehkan.',
        };
    }
}
exports.default = PagesValidator;
//# sourceMappingURL=PagesValidators.js.map