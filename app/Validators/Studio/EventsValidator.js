"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EventsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            date: Validator_1.schema.date({ format: 'yyyy-MM-dd' }),
            start: Validator_1.schema.date({ format: 'HH:ss' }),
            end: Validator_1.schema.date({ format: 'HH:ss' }),
            category: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(64)]),
            type: Validator_1.schema.number(),
            place: Validator_1.schema.string([Validator_1.rules.maxLength(255)]),
        });
        this.messages = {
            'title.required': 'Judul artikel tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal {{ options.maxLength }} karakter.',
            'date.required': 'Tanggal acara tidak boleh kosong.',
            'date.date': 'Tanggal acara tidak valid.',
            'start.required': 'Jam mulai tidak boleh kosong.',
            'start.date': 'Jam mulai tidak valid.',
            'end.required': 'Jam mulai tidak boleh kosong.',
            'end.date': 'Jam mulai tidak valid.',
            'category.required': 'Kategori tidak boleh kosong.',
            'category.maxLength': 'Kategori maksimal {{ options.maxLength }} karakter.',
            'type.required': 'Tipe acara tidak boleh kosong.',
            'type.number': 'Tipe acara tidak valid.',
            'place.required': 'Tempat tidak boleh kosong.',
            'place.maxLength': 'Tempat maksimal {{ options.maxLength }} karakter.',
        };
    }
}
exports.default = EventsValidator;
//# sourceMappingURL=EventsValidator.js.map