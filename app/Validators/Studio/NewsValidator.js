"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class NewsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            thumbnail: Schemas_1.optional.file,
            internal: Validator_1.schema.string.optional([Validator_1.rules.requiredWhen('type', '=', 'internal')]),
            external: Validator_1.schema.string.optional([
                Validator_1.rules.url({
                    requireHost: true,
                    requireProtocol: true,
                    protocols: ['http', 'https'],
                    requireTld: true,
                    validateLength: true,
                }),
                Validator_1.rules.requiredWhen('type', '=', 'external'),
            ]),
            type: Validator_1.schema.enum(['internal', 'external']),
            category: Validator_1.schema.string([
                Validator_1.rules.exists({ table: 'categories', column: 'uuid', where: { type: 'news' } }),
            ]),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'title.required': 'Judul artikel tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal {{ options.maxLength }} karakter.',
            'thumbnail.file': 'Thumbnail tidak boleh kosong.',
            'thumbnail.size': 'Ukuran thumbnail harus kurang dari {{ options.size }}.',
            'thumbnail.extnames': 'Ekstensi thumbnail tidak diperbolehkan.',
            'internal.requiredWhen': 'Konten artikel tidak boleh kosong.',
            'external.requiredWhen': 'Tautan eksternal tidak boleh kosong.',
            'external.url': 'Tautan eksternal tidak valid.',
            'type.required': 'Jenis artikel tidak boleh kosong.',
            'type.enum': 'Jenis artikel tidak valid.',
            'category.required': 'Kategori artikel tidak boleh kosong.',
            'category.exists': 'Kategori artikel tidak dapat ditemukan.',
        };
    }
}
exports.default = NewsValidator;
//# sourceMappingURL=NewsValidator.js.map