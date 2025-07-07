"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Natres_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Natres"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Natres_1.default.createMany([
            {
                uuid: '255c2654-3928-11ee-8c70-00155d14a14b',
                title: 'Curug Tilu',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaibap80002c0d6eyrmgjvd.default.jpeg',
                    extname: 'jpeg',
                    size: 747680,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '32b3d567-3928-11ee-8c70-00155d14a14b',
                title: 'Waduk Jatiluhur',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaibrz70007c0d66b0whkcz.default.jpeg',
                    extname: 'jpeg',
                    size: 411620,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '3a4287be-3928-11ee-8c70-00155d14a14b',
                title: 'Waduk Cirata',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaic1rg000cc0d67pvw0eud.default.jpeg',
                    extname: 'jpeg',
                    size: 62625,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '44bc2c89-3928-11ee-8c70-00155d14a14b',
                title: 'Situ Wanayasa',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaicfbp000hc0d6aaiudfv5.default.jpeg',
                    extname: 'jpeg',
                    size: 1176168,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '4d5ec7c4-3928-11ee-8c70-00155d14a14b',
                title: 'Situ Buleud Sribaduga',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaicqi3000mc0d6gj8y2jfp.default.jpeg',
                    extname: 'jpeg',
                    size: 375218,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '5837d984-3928-11ee-8c70-00155d14a14b',
                title: 'Keramik Plered',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaid4jm000rc0d6fesv0q5d.default.jpeg',
                    extname: 'jpeg',
                    size: 38624,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '622a1b93-3928-11ee-8c70-00155d14a14b',
                title: 'Taman Batu Cijanun',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaidhf6000wc0d65b0qgpjm.default.jpeg',
                    extname: 'jpeg',
                    size: 887485,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '6929a40d-3927-11ee-8c70-00155d14a14b',
                title: 'Curug Ciputur',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllai4j2u000byld60d7k26pl.default.jpeg',
                    extname: 'jpeg',
                    size: 470542,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '6caf1337-3928-11ee-8c70-00155d14a14b',
                title: 'River Tubing Wanayasa',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaidv1f0011c0d66q6khcpw.default.jpeg',
                    extname: 'jpeg',
                    size: 548081,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                uuid: '7283c9aa-3928-11ee-8c70-00155d14a14b',
                title: 'Panenjoan Bojong',
                image: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'natres/cllaie2l60016c0d6b5ek98s4.default.jpeg',
                    extname: 'jpeg',
                    size: 582078,
                    mimeType: 'image/jpeg',
                })),
                caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sem lectus.',
                article: null,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
        ]);
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Natres.js.map