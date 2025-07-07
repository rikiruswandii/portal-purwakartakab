"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ArticlesValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            thumbnail: Schemas_1.optional.file,
            content: Validator_1.schema.string(),
            category: Validator_1.schema.string([
                Validator_1.rules.exists({ table: 'categories', column: 'uuid', where: { type: 'articles' } }),
            ]),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'title.required': 'Judul artikel tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal {{ options.maxLength }} karakter.',
            'thumbnail.file': 'Thumbnail tidak boleh kosong.',
            'thumbnail.size': 'Ukuran thumbnail harus kurang dari {{ options.size }}.',
            'thumbnail.extnames': 'Ekstensi thumbnail tidak diperbolehkan.',
            'content.required': 'Konten artikel tidak boleh kosong.',
            'category.required': 'Kategori artikel tidak boleh kosong.',
            'category.exists': 'Kategori artikel tidak dapat ditemukan.',
        };
    }
}
exports.default = ArticlesValidator;
//# sourceMappingURL=ArticlesValidator.js.map