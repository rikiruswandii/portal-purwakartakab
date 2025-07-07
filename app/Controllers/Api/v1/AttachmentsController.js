"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class AttachmentsController {
    async index(ctx) {
        const { docs } = ctx.request.qs();
        const name = ctx.params['*'].join('/');
        if (docs && /^announcement/.test(name)) {
            const { size } = await Drive_1.default.getStats(name);
            ctx.response.type((0, path_1.extname)(name));
            ctx.response.header('content-length', size);
            return ctx.response.stream(await Drive_1.default.getStream(name));
        }
        const mask = JSON.stringify({ name, size: 0, extname: '', mimeType: '' });
        const attachment = AttachmentLite_1.Attachment.fromDbResponse(mask);
        const url = await attachment.getSignedUrl();
        return ctx.response.redirect(url);
    }
}
exports.default = AttachmentsController;
//# sourceMappingURL=AttachmentsController.js.map