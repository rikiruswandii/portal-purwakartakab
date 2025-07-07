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
        this.tableName = 'services';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('name').index().notNullable();
            table.json('logo').notNullable();
            table.string('alias').notNullable();
            table.string('slug').notNullable().unique();
            table.text('caption', 'TINYTEXT').notNullable();
            table.string('url').notNullable().unique();
            table.bigint('sort').notNullable();
            table
                .specificType('government', 'CHAR(36)')
                .notNullable()
                .index()
                .references('governments.uuid');
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
//# sourceMappingURL=1684118694353_create_table_services.js.map