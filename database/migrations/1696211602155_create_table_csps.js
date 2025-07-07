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
        this.tableName = 'csps';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('ip_address', 45);
            table.text('user_agent');
            table.text('blocked_uri', 'longtext');
            table.enum('disposition', ['enforce', 'report']);
            table.text('document_uri', 'longtext');
            table.string('effective_directive');
            table.text('original_policy', 'longtext');
            table.text('referrer', 'longtext');
            table.string('script_sample', 40);
            table.integer('status_code');
            table.string('violated_directive');
            table.boolean('solved').defaultTo(false);
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1696211602155_create_table_csps.js.map