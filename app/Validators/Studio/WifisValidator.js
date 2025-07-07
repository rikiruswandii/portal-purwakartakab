"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas_1 = global[Symbol.for('ioc.use')]("App/Consts/Schemas");
const WifiType_1 = global[Symbol.for('ioc.use')]("App/Enums/WifiType");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class WifisValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            image: Schemas_1.optional.file,
            type: Validator_1.schema.enum(Object.keys(WifiType_1.WifiTypeDesc)),
            description: Validator_1.schema.string.optional(),
            latitude: Validator_1.schema.number(),
            longitude: Validator_1.schema.number(),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'name.required': 'Nama titik tidak boleh kosong.',
            'name.maxLength': 'Nama titik maksimal {{ options.maxLength }} karakter.',
            'image.required': 'Gambar tidak boleh kosong.',
            'image.file': 'Gambar tidak boleh kosong.',
            'image.size': 'Ukuran gambar harus kurang dari {{ options.size }}.',
            'image.extnames': 'Ekstensi gambar tidak diperbolehkan.',
            'type.required': 'Jenis Wi-Fi tidak boleh kosong.',
            'type.enum': 'Jenis Wi-Fi tidak valid.',
            'latitude.required': 'Garis lintang tidak boleh kosong.',
            'longitude.required': 'Garis bujur tidak boleh kosong.',
        };
    }
}
exports.default = WifisValidator;
//# sourceMappingURL=WifisValidator.js.map