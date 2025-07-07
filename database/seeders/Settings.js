"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Settings"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
class default_1 extends Seeder_1.default {
    async run() {
        await Settings_1.default.createMany([
            {
                code: 'app.name',
                content: 'Purwakarta Istimewa',
            },
            {
                code: 'app.title',
                content: 'Portal Pemerintah Kabupaten Purwakarta',
            },
            {
                code: 'app.tagline',
                content: 'Purwakarta Istimewa, Kota Cerdas Berbudaya',
            },
            {
                code: 'app.description',
                content: 'Website resmi pemerintah daerah Kabupaten Purwakarta',
            },
            {
                code: 'app.keywords',
                content: 'kabupaten purwakarta, pwk, purwakarta istimewa, purwakarta, purwakartakab, ' +
                    'website resmi purwakarta, web resmi purwakarta, web resmi pwk, pemerintah purwakarta',
            },
            {
                code: 'app.category',
                content: 'Government',
            },
            {
                code: 'app.holder',
                content: 'Dinas Komunikasi dan Informatika',
            },
            {
                code: 'app.region',
                content: 'Kabupaten Purwakarta',
            },
            {
                code: 'app.maintenance',
                content: 'false',
            },
            {
                code: 'media.logo.light',
                content: null,
            },
            {
                code: 'media.logo.dark',
                content: null,
            },
            {
                code: 'media.icon',
                content: null,
            },
            {
                code: 'contact.address',
                content: 'Jl. Gandanegara No. 25, Kelurahan Nageri Kidul, Kecamatan Purwakarta, ' +
                    'Kabupaten Purwakarta, Provinsi Jawa Barat',
            },
            {
                code: 'contact.email',
                content: 'diskominfo@purwakartakab.go.id',
            },
            {
                code: 'contact.phone',
                content: '(0264) 200036',
            },
            {
                code: 'contact.fax',
                content: '(0264) 200037',
            },
            {
                code: 'social.facebook',
                content: 'DiskominfoPWK',
            },
            {
                code: 'social.twitter',
                content: 'DiskominfoPWK',
            },
            {
                code: 'social.youtube',
                content: '@diskominfopurwakartachanne6484',
            },
            {
                code: 'social.instagram',
                content: 'diskominfopwk',
            },
            {
                code: 'social.tiktok',
                content: '',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=Settings.js.map