"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const luxon_1 = require("luxon");
const Events_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Events"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const EventsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/EventsValidator"));
class EventsController {
    async index(ctx) {
        const events = await Events_1.default.query().select('category').groupBy('category');
        const categories = ['Bupati', 'Sekretaris Daerah', ...events.map((event) => event.category)];
        const types = ['Luar Jaringan (Offline)', 'Dalam Jaringan (Online)'];
        return ctx.view.render('studio/events', {
            page: 'Kelola Agenda',
            categories: categories.filter((value, index, array) => array.indexOf(value) === index && value !== null),
            types,
        });
    }
    async synchronize(ctx) {
        const { exitCode } = await execa_1.default.node('ace', ['sync:prokompim']);
        if (exitCode) {
            ctx.session.flash('success', 'Agenda gagal disinkronasi.');
            return ctx.response.redirect().toRoute('studio.events.show');
        }
        ctx.session.flash('success', 'Agenda berhasil disinkronasi.');
        return ctx.response.redirect().toRoute('studio.events.show');
    }
    async insert(ctx) {
        const payload = ctx.request.only(['title', 'date', 'start', 'end', 'category', 'type', 'place']);
        try {
            const sanitized = await ctx.request.validate(EventsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        if (payload.start >= payload.end) {
            ctx.session.flash('failed', 'Jam selesai harus lebih besar dari jam mulai.');
            return ctx.response.redirect().back();
        }
        const event = await Events_1.default.create({
            title: payload.title,
            date: luxon_1.DateTime.fromISO(payload.date).toFormat('yyyy-MM-dd'),
            start: luxon_1.DateTime.fromISO(payload.start).toFormat('HH:ss'),
            end: luxon_1.DateTime.fromISO(payload.end).toFormat('HH:ss'),
            category: payload.category,
            type: payload.type,
            place: payload.place,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_EVENT,
            data: { after: event.serialize() },
        });
        ctx.session.flash('success', 'Agenda berhasil ditambahkan.');
        return ctx.response.redirect().toRoute('studio.events.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const event = await Events_1.default.find(uuid);
        if (!event) {
            ctx.session.flash('failed', 'Agenda tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['title', 'date', 'start', 'end', 'category', 'type', 'place']);
        try {
            const sanitized = await ctx.request.validate(EventsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        if (payload.start >= payload.end) {
            ctx.session.flash('failed', 'Jam selesai harus lebih besar dari jam mulai.');
            return ctx.response.redirect().back();
        }
        const before = event.serialize();
        event.title = payload.title;
        event.date = luxon_1.DateTime.fromISO(payload.date).toFormat('yyyy-MM-dd');
        event.start = luxon_1.DateTime.fromISO(payload.start).toFormat('HH:ss');
        event.end = luxon_1.DateTime.fromISO(payload.end).toFormat('HH:ss');
        event.category = payload.category;
        event.type = payload.type;
        event.place = payload.place;
        await event.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_EVENT,
            data: { before, after: event.serialize() },
        });
        ctx.session.flash('success', 'Agenda berhasil diperbarui.');
        return ctx.response.redirect().toRoute('studio.events.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const event = await Events_1.default.find(uuid);
        if (!event) {
            ctx.session.flash('failed', 'Agenda tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        event.deletedAt = luxon_1.DateTime.local();
        await event.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_EVENT,
            data: { before: event.serialize(), after: null },
        });
        ctx.session.flash('success', 'Agenda berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const events = Events_1.default.query()
            .select('uuid', 'title', 'date', 'start', 'end', 'category', 'type', 'place', 'source')
            .where((group) => {
            group.whereNull('deleted_at');
        });
        const recordsTotal = await events.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        events.where((group) => {
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
                    events.orderBy(column, dir);
                }
            });
        }
        else {
            events.orderBy('date', 'desc');
        }
        let result = await events;
        const filtered = result.length;
        if (query.start) {
            events.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            events.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await events;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                value_date: luxon_1.DateTime.fromJSDate(result[index].date).toFormat('yyyy-MM-dd'),
                date: luxon_1.DateTime.fromJSDate(result[index].date)
                    .setLocale('id-ID')
                    .toFormat('EEEE, dd MMMM yyyy'),
                source: result[index].source === 'self' ? 'Internal' : Helpers_1.default.ucwords(result[index].source),
                locked: result[index].source !== 'self',
                type: result[index].type.toString(),
                start: result[index].start ? result[index].start.slice(0, -3) : null,
                end: result[index].end ? result[index].end.slice(0, -3) : null,
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
exports.default = EventsController;
//# sourceMappingURL=EventsController.js.map