"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'tokens';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').primary();
            table.string('name').notNullable();
            table.string('type').notNullable();
            table.string('token', 64).notNullable().unique();
            table
                .specificType('user', 'CHAR(36)')
                .notNullable()
                .index()
                .references('users.uuid')
                .onDelete('CASCADE');
            table.integer('for').comment('1: Front-End. 2: Integration');
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
            table.timestamp('expires_at').nullable().defaultTo(null);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1696920588898_create_table_tokens.js.map