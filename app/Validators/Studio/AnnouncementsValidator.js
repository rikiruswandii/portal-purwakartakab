"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AnnouncementsValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string({ trim: true, escape: true }, [Validator_1.rules.maxLength(251)]),
            description: Validator_1.schema.string(),
            document: Validator_1.schema
                .array()
                .members(Validator_1.schema.string([Validator_1.rules.exists({ table: 'files', column: 'uuid' })])),
            government: [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(this.ctx.auth.user.role)
                ? Validator_1.schema.string([Validator_1.rules.exists({ table: 'governments', column: 'uuid' })])
                : Validator_1.schema.string.optional(),
            active: Validator_1.schema.string.optional(),
        });
        this.messages = {
            'title.required': 'Judul pengumuman tidak boleh kosong.',
            'title.maxLength': 'Judul maksimal {{ options.maxLength }} karakter.',
            'document.required': 'Lampiran tidak boleh kosong.',
            'document.exists': 'Lampiran tidak dapat ditemukan.',
            'description.required': 'Deskripsi pengumuman tidak boleh kosong.',
            'government.required': 'OPD tidak boleh kosong.',
            'government.exists': 'OPD tidak dapat ditemukan.',
        };
    }
}
exports.default = AnnouncementsValidator;
//# sourceMappingURL=AnnouncementsValidator.js.map