"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const UserRole_1 = __importStar(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
class UsersValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            login: this.ctx.request.param('uuid')
                ? Validator_1.schema.string.optional()
                : Validator_1.schema.string([
                    Validator_1.rules.unique({
                        caseInsensitive: true,
                        table: 'users',
                        column: 'login',
                        whereNot: this.ctx.request.param('uuid')
                            ? { uuid: this.ctx.request.param('uuid') }
                            : undefined,
                    }),
                    Validator_1.rules.alphaNum({ allow: ['underscore'] }),
                    Validator_1.rules.minLength(3),
                    Validator_1.rules.maxLength(50),
                ]),
            email: Validator_1.schema.string([
                Validator_1.rules.email({
                    allowIpDomain: false,
                    allowUtf8LocalPart: true,
                    domainSpecificValidation: true,
                    ignoreMaxLength: false,
                    requireTld: true,
                }),
                Validator_1.rules.unique({
                    caseInsensitive: false,
                    table: 'users',
                    column: 'email',
                    whereNot: this.ctx.request.param('uuid')
                        ? { uuid: this.ctx.request.param('uuid') }
                        : undefined,
                }),
                Validator_1.rules.maxLength(320),
            ]),
            password: this.ctx.request.param('uuid')
                ? Validator_1.schema.string.optional([Validator_1.rules.minLength(6)])
                : Validator_1.schema.string([Validator_1.rules.minLength(6)]),
            name: Validator_1.schema.string({ trim: true }, [Validator_1.rules.alpha({ allow: ['space'] }), Validator_1.rules.maxLength(251)]),
            role: Validator_1.schema.enum(Object.keys(UserRole_1.UserRoleDesc).slice(1)),
            government: [UserRole_1.default.OPD, UserRole_1.default.INTEGRATION].includes(Number(this.ctx.request.input('role')))
                ? Validator_1.schema.string([Validator_1.rules.exists({ table: 'governments', column: 'uuid' })])
                : Validator_1.schema.string.optional(),
        });
        this.messages = {
            'login.required': 'Nama pengguna tidak boleh kosong.',
            'login.unique': 'Nama pengguna sudah digunakan.',
            'login.alphaNum': 'Nama pengguna tidak valid.',
            'login.minLength': 'Nama pengguna minimal {{ options.minLength }} karakter.',
            'login.maxLength': 'Nama pengguna maksimal {{ options.maxLength }} karakter.',
            'email.required': 'Alamat surel tidak boleh kosong.',
            'email.email': 'Alamat surel tidak valid.',
            'email.unique': 'Alamat surel sudah digunakan.',
            'email.maxLength': 'Alamat surel maksimal {{ options.maxLength }} karakter.',
            'password.required': 'Kata sandi tidak boleh kosong.',
            'password.minLength': 'Kata sandi minimal harus {{ options.minLength }} karakter.',
            'name.required': 'Nama lengkap tidak boleh kosong.',
            'name.alpha': 'Nama lengkap tidak valid.',
            'name.maxLength': 'Nama lengkap maksimal {{ options.maxLength }} karakter.',
            'role.required': 'Peran tidak boleh kosong.',
            'role.enum': 'Peran tidak valid.',
            'government.required': 'OPD tidak boleh kosong.',
        };
    }
}
exports.default = UsersValidator;
//# sourceMappingURL=UsersValidator.js.map