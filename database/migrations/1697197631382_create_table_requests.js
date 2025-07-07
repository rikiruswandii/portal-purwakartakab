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
        this.tableName = 'requests';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('ip_address', 45);
            table.string('country', 64).defaultTo('Indonesia');
            table.text('endpoint');
            table
                .bigInteger('token')
                .notNullable()
                .unsigned()
                .index()
                .references('tokens.id')
                .onDelete('NO ACTION');
            table.specificType('developer', 'CHAR(36)').notNullable().index().references('users.uuid');
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1697197631382_create_table_requests.js.map