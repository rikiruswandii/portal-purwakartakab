"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'officers';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('name').notNullable();
            table.string('rank').comment('golongan').nullable().defaultTo(null);
            table.string('position').comment('jabatan').notNullable();
            table.string('echelon').comment('eselon').nullable().defaultTo(null);
            table.string('education').comment('pendidikan terakhir').nullable().defaultTo(null);
            table
                .specificType('government', 'CHAR(36)')
                .notNullable()
                .index()
                .references('governments.uuid');
            table.boolean('active').notNullable().defaultTo(true);
            table.specificType('enhancer', 'CHAR(36)').notNullable().index().references('users.uuid');
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
            table
                .timestamp('updated_at')
                .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('deleted_at').nullable().defaultTo(null);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1694749790411_create_table_officers.js.map