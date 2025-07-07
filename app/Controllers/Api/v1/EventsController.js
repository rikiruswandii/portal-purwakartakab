"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const he_1 = __importDefault(require("he"));
const luxon_1 = require("luxon");
const Events_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Events"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class EventsController {
    async index(ctx) {
        const filter = ctx.request.input('date');
        const events = await Events_1.default.query()
            .whereNull('deleted_at')
            .where('date', filter || Database_1.default.raw('DATE(NOW())'))
            .orderBy('date', 'desc')
            .orderBy('start', 'asc');
        return events.reverse().map((event) => ({
            uuid: event.uuid,
            title: he_1.default.decode(event.title),
            date: luxon_1.DateTime.fromJSDate(event.date).toFormat('yyyy-MM-dd'),
            start: event.start ? event.start.slice(0, -3) : null,
            end: event.end ? event.end.slice(0, -3) : null,
            category: event.category,
            type: event.type ? 'Online' : 'Offline',
            place: event.place ? event.place.replace('.', '') : null,
        }));
    }
    async calendar(ctx) {
        const start = ctx.request.input('start');
        const end = ctx.request.input('end');
        const events = await Events_1.default.query()
            .select('date')
            .count('uuid', 'total')
            .whereNull('deleted_at')
            .whereBetween('date', [start, end])
            .orderBy('date', 'asc')
            .orderBy('start', 'asc')
            .groupBy('date');
        return events.map((event) => ({
            date: luxon_1.DateTime.fromJSDate(event.date).toFormat('yyyy-MM-dd'),
            total: event.$extras.total,
        }));
    }
}
exports.default = EventsController;
//# sourceMappingURL=EventsController.js.map