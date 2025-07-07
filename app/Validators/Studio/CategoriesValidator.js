"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CategoriesValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ escape: true, trim: true }, [Validator_1.rules.minLength(3), Validator_1.rules.maxLength(60)]),
        });
        this.messages = {
            required: 'Nama kategori tidak boleh kosong.',
            minLength: 'Nama kategori minimal {{ options.minLength }} karakter.',
            maxLength: 'Nama kategori maksimal {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = CategoriesValidator;
//# sourceMappingURL=CategoriesValidator.js.map