"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Regents_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Regents"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Regents_1.default.createMany([
            {
                chief: 'Bunyamin Dudih',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhctx2002jf8d6gtu2d07a.default.jpg',
                    extname: 'jpg',
                    size: 21592,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1993-01-01',
                end: '2003-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Dedi Mulyadi',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhd6lp002tf8d6edni41xi.default.jpg',
                    extname: 'jpg',
                    size: 915596,
                    mimeType: 'image/jpeg',
                })),
                deputy: 'Dudung Bachtiar Supardi',
                deputyPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhdzow0031f8d67b2xdl2v.default.png',
                    extname: 'png',
                    size: 129213,
                    mimeType: 'image/png',
                })),
                start: '2008-01-01',
                end: '2013-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'RH Sunaryo Ronggowaluyo',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkh9t4w001cf8d68tg5cvue.default.jpg',
                    extname: 'jpg',
                    size: 19649,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1968-01-01',
                end: '1969-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Tubagus Lily Hambali Hasan',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhd6lo002sf8d61ixlcks3.default.jpg',
                    extname: 'jpg',
                    size: 10067,
                    mimeType: 'image/jpeg',
                })),
                deputy: 'Dedi Mulyadi',
                deputyPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhd6lp002tf8d6edni41xi.default.jpg',
                    extname: 'jpg',
                    size: 915596,
                    mimeType: 'image/jpeg',
                })),
                start: '2003-01-01',
                end: '2008-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Dedi Mulyadi',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhd6lp002tf8d6edni41xi.default.jpg',
                    extname: 'jpg',
                    size: 915596,
                    mimeType: 'image/jpeg',
                })),
                deputy: 'Dadan Koswara',
                deputyPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhf8xm003kf8d65wjjgibo.default.jpg',
                    extname: 'jpg',
                    size: 28180,
                    mimeType: 'image/jpeg',
                })),
                start: '2013-01-01',
                end: '2018-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'RA Muchtar',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkha113001lf8d6gglm2v6u.default.jpg',
                    extname: 'jpg',
                    size: 19476,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1969-01-01',
                end: '1979-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'RHA Abubakar',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhaagr001sf8d6hgpi6krk.default.jpg',
                    extname: 'jpg',
                    size: 26607,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1979-01-01',
                end: '1980-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Mukdas Dasuki',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhc9ad001zf8d6gl1d3zfp.default.jpg',
                    extname: 'jpg',
                    size: 30662,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1980-01-01',
                end: '1982-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'RHA Abubakar',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhaagr001sf8d6hgpi6krk.default.jpg',
                    extname: 'jpg',
                    size: 26607,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1982-01-01',
                end: '1983-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Soedarna TM',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhcoo0002cf8d6d4dz81v8.default.jpg',
                    extname: 'jpg',
                    size: 19725,
                    mimeType: 'image/jpeg',
                })),
                deputy: null,
                deputyPhoto: null,
                start: '1983-01-01',
                end: '1993-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                chief: 'Anne Ratna Mustika',
                chiefPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhfgb3003tf8d62xj3ajqj.default.jpg',
                    extname: 'jpg',
                    size: 160442,
                    mimeType: 'image/jpeg',
                })),
                deputy: 'Aming',
                deputyPhoto: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'regent/clkkhfgb3003uf8d6gtsib0jh.default.jpg',
                    extname: 'jpg',
                    size: 153409,
                    mimeType: 'image/jpeg',
                })),
                start: '2018-01-01',
                end: '2023-01-01',
                active: true,
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
        ]);
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Regents.js.map