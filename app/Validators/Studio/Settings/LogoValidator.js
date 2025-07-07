"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LogoValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            light: Schemas_1.optional.file,
            dark: Schemas_1.optional.file,
            icon: Schemas_1.optional.file,
        });
        this.messages = {
            'light.required': 'Logo terang tidak boleh kosong.',
            'light.file': 'Logo terang tidak boleh kosong.',
            'light.size': 'Ukuran logo terang harus kurang dari {{ options.size }}.',
            'light.extnames': 'Ekstensi logo terang tidak diperbolehkan.',
            'dark.required': 'Logo gelap tidak boleh kosong.',
            'dark.file': 'Logo gelap tidak boleh kosong.',
            'dark.size': 'Ukuran logo gelap harus kurang dari {{ options.size }}.',
            'dark.extnames': 'Ekstensi logo gelap tidak diperbolehkan.',
            'icon.required': 'Ikon tidak boleh kosong.',
            'icon.file': 'Ikon tidak boleh kosong.',
            'icon.size': 'Ukuran ikon harus kurang dari {{ options.size }}.',
            'icon.extnames': 'Ekstensi ikon tidak diperbolehkan.',
        };
    }
}
exports.default = LogoValidator;
//# sourceMappingURL=LogoValidator.js.map