"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Governments_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Governments"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const UserRole_1 = __importStar(global[Symbol.for('ioc.use')]("App/Enums/UserRole"));
const UsersValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/UsersValidator"));
class UsersController {
    async index(ctx) {
        const governments = await Governments_1.default.all();
        return ctx.view.render('studio/users', {
            page: 'Kelola Pengguna',
            governments,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only(['login', 'email', 'password', 'name', 'role', 'government']);
        try {
            const sanitized = await ctx.request.validate(UsersValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const user = await Users_1.default.create({
            login: String(payload.login).toLowerCase(),
            email: payload.email,
            password: payload.password,
            name: Helpers_1.default.ucwords(payload.name),
            role: payload.role,
            government: [UserRole_1.default.OPD, UserRole_1.default.INTEGRATION].includes(Number(payload.role))
                ? payload.government
                : null,
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.CREATE_USER,
            data: { after: user.serialize() },
        });
        ctx.session.flash('success', 'Pengguna berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const user = await Users_1.default.find(uuid);
        if (!user) {
            ctx.session.flash('failed', 'Pengguna tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only(['email', 'password', 'name', 'role', 'government']);
        try {
            const sanitized = await ctx.request.validate(UsersValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = user.serialize();
        user.email = payload.email;
        user.name = Helpers_1.default.ucwords(payload.name);
        user.role = payload.role;
        user.government = [UserRole_1.default.OPD, UserRole_1.default.INTEGRATION].includes(Number(payload.role))
            ? payload.government
            : null;
        if (payload.password) {
            user.password = payload.password;
        }
        await user.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.UPDATE_USER,
            data: { before, after: user.serialize() },
        });
        ctx.session.flash('success', 'Pengguna berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const user = await Users_1.default.find(uuid);
        if (!user) {
            ctx.session.flash('failed', 'Pengguna tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const random = Helpers_1.default.generateRandomNumber(3);
        user.login = `${user.login}-${random}`;
        user.email = `${user.email}-${random}`;
        user.deletedAt = luxon_1.DateTime.local();
        await user.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_USER,
            data: { before: user.serialize(), after: null },
        });
        ctx.session.flash('success', 'Pengguna berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const logged = ctx.auth.use('web').user;
        const users = Users_1.default.query()
            .select('users.uuid AS uuid')
            .select('users.login AS login')
            .select('users.email AS email')
            .select('users.name AS name')
            .select('users.role AS role')
            .select('users.government AS government')
            .where((group) => {
            group
                .whereNotIn('users.role', logged.role >= 1 ? ['0', '1'] : [])
                .whereNot('users.uuid', logged.uuid)
                .whereNull('users.deleted_at');
        });
        const recordsTotal = await users.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const translate = {
            uuid: 'users.uuid',
            login: 'users.login',
            email: 'users.email',
            name: 'users.name',
            role: 'users.role',
        };
        query.columns = Array.from(query.columns).map((item) => {
            item.data = translate[item.data] || 'users.uuid';
            return item;
        });
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        users.where((group) => {
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
                    users.orderBy(column, dir);
                }
            });
        }
        else {
            users.orderBy('users.created_at', 'desc');
        }
        let result = await users;
        const filtered = result.length;
        if (query.start) {
            users.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            users.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await users;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                role: UserRole_1.UserRoleDesc[result[index].role] || 'Tidak Diketahui',
                value_role: result[index].role,
            });
            number += 1;
        }
        return {
            draw: Number(query.draw || '1'),
            recordsTotal,
            recordsFiltered: filtered || 0,
            data: result,
        };
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map