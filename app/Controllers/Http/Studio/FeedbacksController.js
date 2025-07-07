"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Feedbacks_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Feedbacks"));
class FeedbacksController {
    index(ctx) {
        return ctx.view.render('studio/feedbacks', {
            page: 'Umpan Balik',
        });
    }
    async datatable(ctx) {
        const feedbacks = Feedbacks_1.default.query()
            .select('feedbacks.uuid')
            .select('feedbacks.rate')
            .select('feedbacks.experience')
            .select('feedbacks.created_at AS date')
            .where((group) => {
            group.whereNull('feedbacks.deleted_at');
        });
        const recordsTotal = await feedbacks.clone().getCount('feedbacks.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        feedbacks.where((group) => {
            columns.forEach((name) => {
                if (query.search.value && typeof name !== 'object') {
                    group.orWhere(name, 'like', '%' + query.search.value + '%');
                }
            });
        });
        if (typeof query.order !== 'undefined') {
            Array.from(query.order).forEach(({ dir, column }) => {
                dir = dir === 'desc' ? 'desc' : 'asc';
                column = columns[column - 1] || null;
                if (column) {
                    feedbacks.orderBy(column, dir);
                }
            });
        }
        else {
            feedbacks.orderBy('feedbacks.created_at', 'desc');
        }
        let result = await feedbacks;
        const filtered = result.length;
        if (query.start) {
            feedbacks.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            feedbacks.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await feedbacks;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                date: luxon_1.DateTime.fromJSDate(result[index].date)
                    .setLocale('id-ID')
                    .toFormat('EEEE, dd MMMM yyyy'),
            });
            number += 1;
        }
        return {
            draw: query.draw || 1,
            recordsTotal,
            recordsFiltered: filtered || 0,
            data: result,
        };
    }
}
exports.default = FeedbacksController;
//# sourceMappingURL=FeedbacksController.js.map