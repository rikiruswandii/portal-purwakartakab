"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class GeneralValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(30)]),
            title: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(60)]),
            tagline: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(128)]),
            holder: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(128)]),
            description: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(255)]),
            keywords: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.maxLength(255)]),
        });
        this.messages = {
            'name.required': 'Nama tidak boleh kosong.',
            'name.maxLength': 'Nama maksimal harus {{ options.maxLength }} karakter.',
            'title.required': 'Judul tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal harus {{ options.maxLength }} karakter.',
            'tagline.required': 'Tagline tidak boleh kosong.',
            'tagline.maxLength': 'Tagline maksimal harus {{ options.maxLength }} karakter.',
            'holder.required': 'Pemilik tidak boleh kosong.',
            'holder.maxLength': 'Pemilik maksimal harus {{ options.maxLength }} karakter.',
            'description.required': 'Deskripsi tidak boleh kosong.',
            'description.maxLength': 'Deskripsi maksimal harus {{ options.maxLength }} karakter.',
            'keywords.required': 'Kata kunci tidak boleh kosong.',
            'keywords.maxLength': 'Kata kunci maksimal harus {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = GeneralValidator;
//# sourceMappingURL=GeneralValidator.js.map