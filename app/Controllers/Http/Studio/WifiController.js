"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Wifis_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Wifis"));
const Gmaps_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Gmaps"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
const WifiType_1 = global[Symbol.for('ioc.use')]("App/Enums/WifiType");
const WifisValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Studio/WifisValidator"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class WifiController {
    async index(ctx) {
        return ctx.view.render('studio/wifi', {
            page: 'Wi-Fi Publik',
            WifiTypeDesc: WifiType_1.WifiTypeDesc,
        });
    }
    async insert(ctx) {
        const payload = ctx.request.only([
            'name',
            'type',
            'description',
            'latitude',
            'longitude',
            'active',
        ]);
        try {
            const sanitized = await ctx.request.validate(WifisValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        let attachment = null;
        const image = ctx.request.file('image');
        if (image) {
            attachment = AttachmentLite_1.Attachment.fromFile(image);
        }
        const reversed = await Gmaps_1.default.reverse(payload.latitude, payload.longitude, true);
        const region = Helpers_1.default.countyFromGeo(reversed.address_components, 'region');
        const district = Helpers_1.default.countyFromGeo(reversed.address_components, 'district');
        const wifi = await Wifis_1.default.create({
            name: payload.name,
            image: attachment,
            type: payload.type,
            description: payload.description,
            latitude: payload.latitude,
            longitude: payload.longitude,
            address: reversed.formatted_address,
            district: district || region || 'Purwakarta',
            active: typeof payload.active !== 'undefined',
            enhancer: ctx.auth.use('web').user.uuid,
        });
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.ADD_WIFI,
            data: { after: wifi.serialize() },
        });
        ctx.session.flash('success', 'Wi-Fi publik berhasil ditambahkan.');
        return ctx.response.redirect().back();
    }
    async update(ctx) {
        const uuid = ctx.request.param('uuid');
        const wifi = await Wifis_1.default.find(uuid);
        if (!wifi) {
            ctx.session.flash('failed', 'Wi-Fi publik tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        const payload = ctx.request.only([
            'name',
            'type',
            'description',
            'latitude',
            'longitude',
            'active',
        ]);
        try {
            const sanitized = await ctx.request.validate(WifisValidator_1.default);
            Object.assign(payload, sanitized);
        }
        catch (error) {
            ctx.session.flash('failed', Helpers_1.default.errorParser(error));
            return ctx.response.redirect().back();
        }
        const before = wifi.serialize();
        const image = ctx.request.file('image');
        wifi.name = payload.name;
        wifi.type = payload.type;
        wifi.description = payload.description;
        wifi.latitude = payload.latitude;
        wifi.longitude = payload.longitude;
        wifi.active = typeof payload.active !== 'undefined';
        if (image) {
            wifi.image = AttachmentLite_1.Attachment.fromFile(image);
        }
        if (payload.latitude !== wifi.latitude || payload.longitude !== wifi.longitude) {
            const reversed = await Gmaps_1.default.reverse(payload.latitude, payload.longitude, true);
            const region = Helpers_1.default.countyFromGeo(reversed.address_components, 'region');
            const district = Helpers_1.default.countyFromGeo(reversed.address_components, 'district');
            wifi.address = reversed.formatted_address;
            wifi.district = district || region || 'Purwakarta';
        }
        await wifi.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.EDIT_WIFI,
            data: { before, after: wifi.serialize() },
        });
        ctx.session.flash('success', 'Wi-Fi publik berhasil diperbarui.');
        return ctx.response.redirect().back();
    }
    async delete(ctx) {
        const uuid = ctx.request.param('uuid');
        const wifi = await Wifis_1.default.find(uuid);
        if (!wifi) {
            ctx.session.flash('failed', 'Wi-Fi publik tidak dapat ditemukan.');
            return ctx.response.redirect().back();
        }
        wifi.deletedAt = luxon_1.DateTime.local();
        await wifi.save();
        await Event_1.default.emit('user:activity', {
            ctx,
            status: UserActivity_1.default.DELETE_WIFI,
            data: { before: wifi.serialize(), after: null },
        });
        ctx.session.flash('success', 'Wi-Fi publik berhasil dihapus.');
        return ctx.response.redirect().back();
    }
    async datatable(ctx) {
        const wifis = Wifis_1.default.query()
            .select('uuid', 'name', 'image', 'type', 'description', 'latitude', 'longitude', 'active')
            .where((group) => {
            group.whereNull('deleted_at');
        });
        const recordsTotal = await wifis.clone().getCount();
        const query = ctx.request.qs();
        if (typeof query.draw === 'undefined') {
            return { error: 'no datatable request detected' };
        }
        const columns = Array.from(query.columns)
            .filter((column) => column.searchable === 'true')
            .map((column) => {
            return column.name || column.data;
        });
        wifis.where((group) => {
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
                    wifis.orderBy(column, dir);
                }
            });
        }
        else {
            wifis.orderBy('created_at', 'desc');
        }
        let result = await wifis;
        const filtered = result.length;
        if (query.start) {
            wifis.offset(Number(query.start));
        }
        if (query.length && Number(query.length) !== -1) {
            wifis.limit(Number(query.length));
        }
        let number = Number(query.start) + 1;
        const data = await wifis;
        result = [];
        for (let index in data) {
            result[index] = data[index].toJSON();
            result[index] = {
                number,
                ...result[index],
                ...data[index].$extras,
            };
            Object.assign(result[index], {
                image: result[index].image ? Helpers_1.default.baseUrl(result[index].image.url) : null,
                active: !!result[index].active,
                value_type: result[index].type,
                type: WifiType_1.WifiTypeDesc[result[index].type],
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
exports.default = WifiController;
//# sourceMappingURL=WifiController.js.map