"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bull_1 = __importDefault(global[Symbol.for('ioc.use')]("Rocketseat/Bull"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const Activities_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Activities"));
const UserActivity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Enums/UserActivity"));
Event_1.default.on('user:activity', async ({ ctx, status, enhancer, data }) => {
    const sessionId = ctx.session.sessionId;
    await Activities_1.default.create({
        sessionId,
        status,
        ipAddress: ctx.request.ip(),
        userAgent: ctx.request.header('user-agent') || '',
        enhancer: enhancer || ctx.auth.use('web').user.uuid,
        data: data || {},
    });
    switch (status) {
        case UserActivity_1.default.UPDATE_SETTINGS:
            await Bull_1.default.add('cache:settings', true);
            break;
        case UserActivity_1.default.ADD_INFOGRAPHIC:
        case UserActivity_1.default.EDIT_INFOGRAPHIC:
        case UserActivity_1.default.DELETE_INFOGRAPHIC:
            await Bull_1.default.add('cache:infographics', status);
            break;
        case UserActivity_1.default.ADD_REGENT:
        case UserActivity_1.default.EDIT_REGENT:
        case UserActivity_1.default.DELETE_REGENT:
            await Bull_1.default.add('cache:regents', status);
            break;
        case UserActivity_1.default.EDIT_PAGE:
            if (data && data.before?.slug) {
                await Bull_1.default.add('cache:pages', data.before.slug);
            }
            break;
        case UserActivity_1.default.EDIT_ANNOUNCEMENT:
            if (data && data.before?.slug) {
                await Bull_1.default.add('cache:announcements', data.before.slug);
            }
            break;
        case UserActivity_1.default.EDIT_ARTICLE:
            if (data && data.before?.slug) {
                await Bull_1.default.add('cache:articles', data.before.slug);
            }
            break;
        case UserActivity_1.default.EDIT_NEWS:
            if (data && data.before?.slug) {
                await Bull_1.default.add('cache:news', data.before.slug);
            }
            break;
        case UserActivity_1.default.ADD_WIFI:
        case UserActivity_1.default.EDIT_WIFI:
        case UserActivity_1.default.DELETE_WIFI:
            await Bull_1.default.add('cache:wifis', status);
            break;
        case UserActivity_1.default.LOGOUT:
            await Activities_1.default.query().where('session_id', sessionId).update('kicked', true);
            break;
    }
});
Event_1.default.on('session:changed', async ([old, session]) => {
    await Activities_1.default.query()
        .where('session_id', old)
        .where('kicked', false)
        .update('session_id', session);
});
//# sourceMappingURL=events.js.map