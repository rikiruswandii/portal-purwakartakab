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
        this.tableName = 'articles';
    }
    async up() {
        await Database_1.default.rawQuery(`CREATE TABLE ${this.tableName} (uuid CHAR(36) NOT NULL DEFAULT UUID())`);
        this.schema.alterTable(this.tableName, (table) => {
            table.primary(['uuid']);
            table.string('slug').notNullable().unique();
            table.string('title').index().notNullable();
            table.json('thumbnail').nullable();
            table.text('content', 'longtext').notNullable();
            table.specificType('category', 'CHAR(36)').notNullable().index().references('categories.uuid');
            table.bigInteger('shared').defaultTo(0);
            table.boolean('active').notNullable().defaultTo(true);
            table.specificType('enhancer', 'CHAR(36)').notNullable().index().references('users.uuid');
            table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'));
            table
                .timestamp('updated_at')
                .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('deleted_at').nullable().defaultTo(null);
            table.index(['title', 'content'], undefined, 'fulltext');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1683168081612_create_table_articles.js.map