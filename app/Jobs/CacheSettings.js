"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
const Settings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Settings"));
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class CacheSettings {
    constructor() {
        this.key = 'cache:settings';
    }
    async handle(_job) {
        const settings = await Settings_1.default.query().select('code', 'content').orderBy('code', 'asc');
        const data = settings
            .map((setting) => setting.toJSON())
            .reduce(function (previous, current) {
            const path = current.code.split('.');
            const last = path.pop();
            path.reduce(function (prev, curr) {
                return (prev[curr] = prev[curr] || {});
            }, previous)[last] = Helpers_1.default.parseJson(current.content);
            return previous;
        }, {});
        if (data.media.logo.light) {
            data.media.logo.light = AttachmentLite_1.Attachment.fromDbResponse(data.media.logo.light);
            data.media.logo.light = Helpers_1.default.getAttachmentUrl(data.media.logo.light);
        }
        else {
            data.media.logo.light = Helpers_1.default.baseUrl(View_1.default.GLOBALS.asset('assets/images/logo-light.png'));
        }
        if (data.media.logo.dark) {
            data.media.logo.dark = AttachmentLite_1.Attachment.fromDbResponse(data.media.logo.dark);
            data.media.logo.dark = Helpers_1.default.getAttachmentUrl(data.media.logo.dark);
        }
        else {
            data.media.logo.dark = Helpers_1.default.baseUrl(View_1.default.GLOBALS.asset('assets/images/logo-dark.png'));
        }
        if (data.media.icon) {
            data.media.icon = AttachmentLite_1.Attachment.fromDbResponse(data.media.icon);
            data.media.icon = Helpers_1.default.getAttachmentUrl(data.media.icon);
        }
        else {
            data.media.icon = Helpers_1.default.baseUrl(View_1.default.GLOBALS.asset('assets/images/icon.png'));
        }
        await Adonis_Cache_1.default.update('api:settings', data, cache_1.ONE_WEEK);
    }
}
exports.default = CacheSettings;
//# sourceMappingURL=CacheSettings.js.map