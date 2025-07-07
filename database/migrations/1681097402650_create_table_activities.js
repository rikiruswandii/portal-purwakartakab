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
        this.tableName = 'activities';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('session_id').notNullable();
            table.integer('status').notNullable();
            table.string('ip_address', 45).notNullable();
            table.text('user_agent').notNullable();
            table.json('data').notNullable().defaultTo('{}');
            table.boolean('kicked').notNullable().defaultTo(false);
            table.specificType('enhancer', 'CHAR(36)').notNullable().index().references('users.uuid');
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1681097402650_create_table_activities.js.map