"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("./Helpers"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const web_push_1 = __importDefault(require("web-push"));
class Pushat {
    static async send(endpoint, keys, payload) {
        const mail = Env_1.default.get('SMTP_USERNAME');
        const pubkey = Env_1.default.get('PUBLIC_VAPID_KEY');
        const privkey = Env_1.default.get('PRIVATE_VAPID_KEY');
        if (!mail || !pubkey || !privkey) {
            return;
        }
        payload.icon = payload.icon || Helpers_1.default.baseUrl('favicon.ico');
        web_push_1.default.setVapidDetails(`mailto:${mail}`, pubkey, privkey);
        return await web_push_1.default.sendNotification({ endpoint, keys: JSON.parse(keys) }, JSON.stringify(payload));
    }
}
exports.default = Pushat;
//# sourceMappingURL=Pushat.js.map