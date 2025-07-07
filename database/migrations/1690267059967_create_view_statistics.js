"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.viewName = 'statistics';
    }
    async up() {
        this.schema.createViewOrReplace(this.viewName, (table) => {
            table.columns(['ip_address', 'user_agent', 'day']);
            table.as(this.knex()
                .select('ip_address', 'user_agent', this.raw('DATE(created_at) AS day'))
                .from('visitors')
                .groupByRaw('ip_address, user_agent, DATE(created_at)')
                .orderBy('day', 'desc'));
        });
    }
    async down() {
        this.schema.dropView(this.viewName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1690267059967_create_view_statistics.js.map