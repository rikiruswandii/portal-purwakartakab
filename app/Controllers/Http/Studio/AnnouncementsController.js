"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const luxon_1 = require("luxon");
const uuid_1 = require("uuid");
const Files_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Files"));
const UserRole_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Dashboard_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Dashboard"));
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const Announcements_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Announcements"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const AnnouncementsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/AnnouncementsValidator"));
class AnnouncementsController {
    async index(ctx) {
        return ctx.view.render('studio/announcements/list', {
            page: 'Kelola Pengumuman',
        });
    }
    async add(ctx) {
        const governments = await Governments_1.default.all();
        const categories = await Categories_1.default.query()
            .whereNull('deleted_at')
            .where('type', 'announcements');
        return ctx.view.render('studio/announcements/add', {
            page: 'Publikasi Pengumuman',
            governments,
            categories,
        });
    }
    async edit(ctx) {
        const uuid = ctx.request.param('uuid');
        const announcement = await Announcements_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!announcement ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) &&
                announcement.government !== logged.government)) {
            throw new NotFoundException_1.default();
        }
        const governments = await Governments_1.default.all();
        const categories = await Categories_1.default.query()
            .whereNull('deleted_at')
            .where('type', 'announcements');
        const documents = await Files_1.default.query().whereNull('deleted_at').where('announcement', uuid);
        const files = documents.map(({ uuid, name, file }) => ({
            source: uuid,
            options: { type: 'local', file: { name, size: file.size, type: file.mimeType } },
        }));
        return ctx.view.render('studio/announcements/edit', {
            page: 'Perbarui Pengumuman',
            announcement,
            files: { files },
            governments,
            categories,
        });
    }
    async upload(ctx) {
        const document = ctx.request.file('document', {
            extnames: ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx'],
        });
        if (!document) {
            ctx.response.status(422);
            return 'No files were uploaded.';
        }
        if (!document.isValid) {
            ctx.response.status(422);
            return document.errors.shift();
        }
        const uuid = (0, uuid_1.v4)();
        const insert = await Files_1.default.create({
            uuid,
            name: document.clientName || 'untitled',
            file: AttachmentLite_1.Attachment.fromFile(document),
            enhancer: ctx.auth.use('web').user.uuid,
        });
        if (insert) {
            return uuid;
        }
        ctx.response.status(500);
        return 'Internal server error.';
    }
    async access(ctx) {
        const uuid = ctx.request.param('uuid');
        const filename = ctx.request.param('filename', null);
        const file = await Files_1.default.find(uuid);
        if (!file || !file.file) {
            ctx.response.status(422);
            return 'File not found.';
        }
        if (!filename) {
            const next = Route_1.default.makeUrl('studio.announcements.download', { uuid, filename: file.name });
            return ctx.response.redirect().toPath(next);
        }
        ctx.response.type((0, path_1.extname)(file.file.name));
        ctx.response.header('content-length', file.file.size);
        ctx.response.header('content-disposition', `attachment; filename=${file.name}`);
        const stream = await Drive_1.default.getStream(file.file.name);
        return ctx.response.stream(stream);
    }
    async insert(ctx) {
        const logged = ctx.auth.use('web').user;
        const payload = ctx.request.only(['title', 'description', 'document', 'government', 'active']);
        try {
            const sanitized = await ctx.request.validate(AnnouncementsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const uuid = (0, uuid_1.v4)();
        const trx = await Database_1.default.transaction();
        const announcement = await Announcements_1.default.create({
            uuid,
            title: payload.title,
            description: payload.description,
            government: [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role)
                ? payload.government
                : logged.government,
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        }, { client: trx });
        for await (const document of payload.document) {
            await Files_1.default.query({ client: trx }).where('uuid', document).update('announcement', uuid);
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Pengumuman gagal ditambahkan.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_ANNOUNCEMENT,
            data: { after: announcement.serialize() },
        });
        ctx.session.flash('success', 'Pengumuman berhasil ditambahkan.');
        return ctx.response.redirect().toRoute('studio.announcements.show');
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const announcement = await Announcements_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!announcement ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) &&
                announcement.government !== logged.government)) {
            throw new NotFoundException_1.default();
        }
        const payload = ctx.request.only(['title', 'description', 'document', 'government', 'active']);
        try {
            const sanitized = await ctx.request.validate(AnnouncementsValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        payload.document = payload.document.map((item) => item.split('/')[0]);
        const trx = await Database_1.default.transaction();
        const before = announcement.serialize();
        announcement.title = payload.title;
        announcement.description = payload.description;
        announcement.government = [UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role)
            ? payload.government
            : logged.government;
        announcement.active = typeof payload.active !== 'undefined';
        await announcement.useTransaction(trx).save();
        await Files_1.default.query({ client: trx })
            .where('announcement', uuid)
            .whereNotIn('uuid', payload.document)
            .update('deleted_at', luxon_1.DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss'));
        for await (const document of payload.document) {
            await Files_1.default.query({ client: trx }).where('uuid', document).update('announcement', uuid);
        }
        try {
            await trx.commit();
        }
        catch (error) {
            await trx.rollback();
            ctx.session.flash('failed', 'Pengumuman gagal ditambahkan.');
            return ctx.response.redirect().back();
        }
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_ANNOUNCEMENT,
            data: { before, after: announcement.serialize() },
        });
        ctx.session.flash('success', 'Pengumuman berhasil diperbarui.');
        return ctx.response.redirect().toRoute('studio.announcements.show');
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const announcement = await Announcements_1.default.find(uuid);
        const logged = ctx.auth.use('web').user;
        if (!announcement ||
            (![UserRole_1.default.DEV, UserRole_1.default.SUPER].includes(logged.role) &&
                announcement.government !== logged.government)) {
            ctx.session.flash('failed', 'Pengumuman tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        announcement.slug = `${announcement.slug}-${Helpers_1.default.generateRandomNumber()}`;
        announcement.deletedAt = luxon_1.DateTime.local();
        await announcement.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_ANNOUNCEMENT,
            data: { before: announcement.serialize(), after: null },
        });
        ctx.session.flash('success', 'Pengumuman berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const announcements = Announcements_1.default.query()
            .select('announcements.uuid AS uuid')
            .select('announcements.slug AS slug')
            .select(Database_1.default.raw('YEAR(announcements.created_at) AS year'))
            .select(Database_1.default.raw('LPAD(MONTH(announcements.created_at), 2, "0") AS month'))
            .select('announcements.title AS title')
            .select('governments.alias AS government')
            .select('announcements.active AS active')
            .join('governments', function () {
            this.on('governments.uuid', 'announcements.government').onNull('governments.deleted_at');
        })
            .where((group) => {
            group
                .whereNull('announcements.deleted_at')
                .whereRaw(Dashboard_1.default.whereGovernment(logged, 'announcements'));
        })
            .groupBy('announcements.uuid');
        const recordsTotal = await announcements.clone().getCount('announcements.uuid');
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'announcements.uuid',
            slug: 'announcements.slug',
            title: 'announcements.title',
            government: 'governments.name',
            active: 'announcements.active',
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'announcements.id';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        announcements.where((group) => {
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
                    announcements.orderBy(column, dir);
                }
            });
        }
        else {
            announcements.orderBy('announcements.created_at', 'desc');
        }
        let result = await announcements;
        const filtered = result.length;
        if (query.start) {
            announcements.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            announcements.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await announcements;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                url: Helpers_1.default.baseUrl('announcements', result[index].year, result[index].month, result[index].slug),
                year: undefined,
                month: undefined,
                active: !!result[index].active,
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
exports.default = AnnouncementsController;
//# sourceMappingURL=AnnouncementsController.js.map