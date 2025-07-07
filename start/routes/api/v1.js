"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
exports.default = () => {
    Route_1.default.post('csp-report', 'SecurityController.csp');
    Route_1.default.get('attachments/*', 'AttachmentsController.index');
    Route_1.default
        .group(() => {
        Route_1.default.get('settings', 'SettingsController.index');
        Route_1.default.get('shalat', 'ShalatController.index');
        Route_1.default.get('weather', 'WeatherController.index');
        Route_1.default.get('services', 'ServicesController.index');
        Route_1.default.get('natres', 'NatresController.index');
        Route_1.default.get('pages/:slug', 'PagesController.detail');
        Route_1.default
            .group(() => {
            Route_1.default.get('categories', 'NewsController.categories');
            Route_1.default.get('archives', 'NewsController.archives');
            Route_1.default.get('/', 'NewsController.index');
            Route_1.default.get('popular', 'NewsController.popular');
            Route_1.default.get('categories/:slug', 'NewsController.category');
            Route_1.default.get('author/:user(login)', 'NewsController.author');
            Route_1.default.get(':year', 'NewsController.index');
            Route_1.default.get(':year/:month', 'NewsController.index');
            Route_1.default.get(':year/:month/:slug', 'NewsController.detail');
            Route_1.default.get(':year/:month/:slug/related', 'NewsController.related');
            Route_1.default.get(':year/:month/:slug/count', 'NewsController.count');
            Route_1.default.post(':year/:month/:slug/share', 'NewsController.share');
        })
            .prefix('news');
        Route_1.default
            .group(() => {
            Route_1.default.get('categories', 'ArticlesController.categories');
            Route_1.default.get('archives', 'ArticlesController.archives');
            Route_1.default.get('/', 'ArticlesController.index');
            Route_1.default.get('popular', 'ArticlesController.popular');
            Route_1.default.get('categories/:slug', 'ArticlesController.category');
            Route_1.default.get('author/:user(login)', 'ArticlesController.author');
            Route_1.default.get(':year', 'ArticlesController.index');
            Route_1.default.get(':year/:month', 'ArticlesController.index');
            Route_1.default.get(':year/:month/:slug', 'ArticlesController.detail');
            Route_1.default.get(':year/:month/:slug/related', 'ArticlesController.related');
            Route_1.default.get(':year/:month/:slug/count', 'ArticlesController.count');
            Route_1.default.post(':year/:month/:slug/share', 'ArticlesController.share');
        })
            .prefix('articles');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'InfographicsController.index');
            Route_1.default.get('pinned', 'InfographicsController.pinned');
        })
            .prefix('infographics');
        Route_1.default
            .group(() => {
            Route_1.default.get('archives', 'AnnouncementsController.archives');
            Route_1.default.get('/', 'AnnouncementsController.index');
            Route_1.default.get('gov/:government(slug)', 'AnnouncementsController.gov');
            Route_1.default.get(':year', 'AnnouncementsController.index');
            Route_1.default.get(':year/:month', 'AnnouncementsController.index');
            Route_1.default.get(':year/:month/:slug', 'AnnouncementsController.detail');
            Route_1.default.get(':year/:month/:slug/related', 'AnnouncementsController.related');
            Route_1.default.get(':year/:month/:slug/count', 'AnnouncementsController.count');
            Route_1.default.post(':year/:month/:slug/share', 'AnnouncementsController.share');
        })
            .prefix('announcements');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'EventsController.index');
            Route_1.default.get('calendar', 'EventsController.calendar');
        })
            .prefix('events');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'RegentsController.index');
            Route_1.default.get('current', 'RegentsController.current');
        })
            .prefix('regents');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'GovernmentsController.index');
            Route_1.default.get(':page', 'GovernmentsController.page');
        })
            .prefix('governments');
        Route_1.default
            .group(() => {
            Route_1.default.get('wifis', 'GisController.wifis');
            Route_1.default.get('hotels', 'GisController.hotels');
            Route_1.default.get('tourism', 'GisController.tourism');
            Route_1.default.get('culinaries', 'GisController.culinaries');
            Route_1.default
                .group(() => {
                Route_1.default.get('/', 'GisController.minibuses');
                Route_1.default.get(':id', 'GisController.minibus');
            })
                .prefix('minibuses');
        })
            .prefix('gis');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'OfficersController.index');
            Route_1.default.get(':government(slug)', 'OfficersController.gov');
        })
            .prefix('officers');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'VisitorsController.index');
            Route_1.default.post('/', 'VisitorsController.collect');
            Route_1.default.post('feedback', 'VisitorsController.feedback');
        })
            .prefix('visitors');
        Route_1.default
            .group(() => {
            Route_1.default.get('subjects', 'BpsController.subjects');
            Route_1.default.get('indicators', 'BpsController.indicators');
            Route_1.default.get('characteristics', 'BpsController.characteristics');
            Route_1.default.get('periods', 'BpsController.periods');
            Route_1.default.get('verticals', 'BpsController.verticals');
            Route_1.default.get('data', 'BpsController.data');
        })
            .prefix('bps');
    })
        .middleware('api');
};
//# sourceMappingURL=v1.js.map