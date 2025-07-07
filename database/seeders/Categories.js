"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Categories_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Categories"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Categories_1.default.createMany([
            {
                name: 'Uncategorized',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'OPD',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pembangunan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Bupati',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Kesehatan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Wilayah',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Festival',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Bencana',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Hari Raya',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Ekonomi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pendidikan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Wakil Bupati',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Hari Besar',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Bantuan Sosial',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Penghargaan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Hari Jadi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Aplikasi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Peresmian',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Sekretaris Daerah',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pejabat Negara',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Budaya',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Anak',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pelantikan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Birokrasi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Sosialisasi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Monev',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Olahraga',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Kunjungan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Rakor',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Media',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Teknologi',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Infrastruktur',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pemantauan',
                type: 'news',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Uncategorized',
                type: 'articles',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Wisata',
                type: 'articles',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Pendidikan',
                type: 'articles',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'Kuliner',
                type: 'articles',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                name: 'UMKM',
                type: 'articles',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
        ]);
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Categories.js.map