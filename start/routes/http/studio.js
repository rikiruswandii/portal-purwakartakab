"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
exports.default = () => {
    Route_1.default.on('/').redirect('studio.overview').as('redirect');
    Route_1.default.get('overview', 'OverviewController.index').as('overview');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'CategoriesController.index').as('show');
        Route_1.default.get('datatable', 'CategoriesController.datatable').as('datatable');
        Route_1.default.post('insert', 'CategoriesController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'CategoriesController.update').as('update');
        Route_1.default.get('delete/:uuid', 'CategoriesController.delete').as('delete');
    })
        .as('categories')
        .prefix('categories/:type')
        .middleware('bouncer:0,2,3');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'NewsController.index').as('show');
        Route_1.default.get('datatable', 'NewsController.datatable').as('datatable');
        Route_1.default.get('add', 'NewsController.add').as('add');
        Route_1.default.get('edit/:uuid', 'NewsController.edit').as('edit');
        Route_1.default.post('add', 'NewsController.insert').as('insert');
        Route_1.default.post('edit/:uuid', 'NewsController.update').as('update');
        Route_1.default.get('delete/:uuid', 'NewsController.delete').as('delete');
    })
        .as('news')
        .prefix('news')
        .middleware('bouncer:0,2,3');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'ArticlesController.index').as('show');
        Route_1.default.get('datatable', 'ArticlesController.datatable').as('datatable');
        Route_1.default.get('add', 'ArticlesController.add').as('add');
        Route_1.default.get('edit/:uuid', 'ArticlesController.edit').as('edit');
        Route_1.default.post('add', 'ArticlesController.insert').as('insert');
        Route_1.default.post('edit/:uuid', 'ArticlesController.update').as('update');
        Route_1.default.get('delete/:uuid', 'ArticlesController.delete').as('delete');
    })
        .as('articles')
        .prefix('articles')
        .middleware('bouncer:0,2,3');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'InfographicsController.index').as('show');
        Route_1.default.get('datatable', 'InfographicsController.datatable').as('datatable');
        Route_1.default.post('insert', 'InfographicsController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'InfographicsController.update').as('update');
        Route_1.default.get('delete/:uuid', 'InfographicsController.delete').as('delete');
    })
        .as('infographics')
        .prefix('infographics')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get(':slug', 'PagesController.index').as('show');
        Route_1.default.post(':slug', 'PagesController.save').as('save');
        Route_1.default.post('sekretaris-daerah/save', 'PagesController.secretary').as('secretary');
        Route_1.default.post('tugas-fungsi/save', 'PagesController.roles').as('roles');
        Route_1.default
            .group(() => {
            Route_1.default.post('pre', 'LogoController.pre').as('pre');
            Route_1.default.post('section', 'LogoController.section').as('section');
            Route_1.default.post('color', 'LogoController.color').as('color');
        })
            .as('logo')
            .prefix('logo');
        Route_1.default
            .group(() => {
            Route_1.default.post('vision', 'GoalsController.vision').as('vision');
            Route_1.default.post('mission', 'GoalsController.mission').as('mission');
        })
            .as('goals')
            .prefix('goals');
        Route_1.default.get('visi-misi/delete/:index', 'GoalsController.pop').as('goals.pop');
    })
        .as('pages')
        .prefix('pages')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'NatresController.index').as('show');
        Route_1.default.get('articles', 'NatresController.articles').as('articles');
        Route_1.default.get('datatable', 'NatresController.datatable').as('datatable');
        Route_1.default.get('unlink/:uuid', 'NatresController.unlink').as('unlink');
        Route_1.default.post('insert', 'NatresController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'NatresController.update').as('update');
        Route_1.default.post('articles', 'NatresController.link').as('link');
        Route_1.default.get('delete/:uuid', 'NatresController.delete').as('delete');
    })
        .as('natres')
        .prefix('natres')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'OfficersController.index').as('show');
        Route_1.default.get('articles', 'OfficersController.articles').as('articles');
        Route_1.default.get('datatable', 'OfficersController.datatable').as('datatable');
        Route_1.default.post('insert', 'OfficersController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'OfficersController.update').as('update');
        Route_1.default.get('delete/:uuid', 'OfficersController.delete').as('delete');
    })
        .as('officers')
        .prefix('officers')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'AnnouncementsController.index').as('show');
        Route_1.default.get('datatable', 'AnnouncementsController.datatable').as('datatable');
        Route_1.default.get('add', 'AnnouncementsController.add').as('add');
        Route_1.default.get('edit/:uuid', 'AnnouncementsController.edit').as('edit');
        Route_1.default.post('add', 'AnnouncementsController.insert').as('insert');
        Route_1.default.post('add/upload', 'AnnouncementsController.upload').as('post');
        Route_1.default.post('edit/:uuid', 'AnnouncementsController.update').as('update');
        Route_1.default.post('edit/:uuid/upload', 'AnnouncementsController.upload').as('put');
        Route_1.default.get('delete/:uuid', 'AnnouncementsController.delete').as('delete');
        Route_1.default.get('access/:uuid', 'AnnouncementsController.access').as('access');
        Route_1.default.get('access/:uuid/:filename', 'AnnouncementsController.access').as('download');
    })
        .as('announcements')
        .prefix('announcements')
        .middleware('bouncer:0,2,3');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'EventsController.index').as('show');
        Route_1.default.get('synchronize', 'EventsController.synchronize').as('synchronize');
        Route_1.default.get('datatable', 'EventsController.datatable').as('datatable');
        Route_1.default.post('insert', 'EventsController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'EventsController.update').as('update');
        Route_1.default.get('delete/:uuid', 'EventsController.delete').as('delete');
    })
        .as('events')
        .prefix('events')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'WifiController.index').as('show');
        Route_1.default.get('datatable', 'WifiController.datatable').as('datatable');
        Route_1.default.post('insert', 'WifiController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'WifiController.update').as('update');
        Route_1.default.get('delete/:uuid', 'WifiController.delete').as('delete');
    })
        .as('wifi')
        .prefix('wifi')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'ServicesController.index').as('show');
        Route_1.default.get('datatable', 'ServicesController.datatable').as('datatable');
        Route_1.default.get('up/:uuid', 'ServicesController.up').as('up');
        Route_1.default.get('down/:uuid', 'ServicesController.down').as('down');
        Route_1.default.post('insert', 'ServicesController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'ServicesController.update').as('update');
        Route_1.default.get('delete/:uuid', 'ServicesController.delete').as('delete');
    })
        .as('services')
        .prefix('services')
        .middleware('bouncer:0,2,3');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'GovernmentsController.index').as('show');
        Route_1.default.get('datatable', 'GovernmentsController.datatable').as('datatable');
        Route_1.default.get('add', 'GovernmentsController.add').as('add');
        Route_1.default.get('edit/:uuid', 'GovernmentsController.edit').as('edit');
        Route_1.default.post('add', 'GovernmentsController.insert').as('insert');
        Route_1.default.post('edit/:uuid', 'GovernmentsController.update').as('update');
        Route_1.default.get('delete/:uuid', 'GovernmentsController.delete').as('delete');
    })
        .as('governments')
        .prefix('governments')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'RegentsController.index').as('show');
        Route_1.default.get('datatable', 'RegentsController.datatable').as('datatable');
        Route_1.default.get('add', 'RegentsController.add').as('add');
        Route_1.default.get('edit/:uuid', 'RegentsController.edit').as('edit');
        Route_1.default.post('add', 'RegentsController.insert').as('insert');
        Route_1.default.post('edit/:uuid', 'RegentsController.update').as('update');
        Route_1.default.get('delete/:uuid', 'RegentsController.delete').as('delete');
    })
        .as('regents')
        .prefix('regents')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'UsersController.index').as('show');
        Route_1.default.get('datatable', 'UsersController.datatable').as('datatable');
        Route_1.default.post('insert', 'UsersController.insert').as('insert');
        Route_1.default.post('update/:uuid', 'UsersController.update').as('update');
        Route_1.default.get('delete/:uuid', 'UsersController.delete').as('delete');
    })
        .as('users')
        .prefix('users')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.on('/').redirect('studio.settings.general.show').as('entry');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'GeneralController.index').as('show');
            Route_1.default.post('/', 'GeneralController.save').as('save');
        })
            .as('general')
            .prefix('general');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'LogoController.index').as('show');
            Route_1.default.post('/', 'LogoController.save').as('save');
        })
            .as('logo')
            .prefix('logo');
        Route_1.default
            .group(() => {
            Route_1.default.get('/', 'ContactController.index').as('show');
            Route_1.default.post('/', 'ContactController.save').as('save');
        })
            .as('contact')
            .prefix('contact');
    })
        .namespace('App/Controllers/Http/Studio/Settings')
        .as('settings')
        .prefix('settings')
        .middleware('bouncer:0,2');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'ProfileController.index').as('show');
        Route_1.default.post('/', 'ProfileController.save').as('save');
    })
        .as('profile')
        .prefix('profile');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'PasswordController.index').as('show');
        Route_1.default.post('/', 'PasswordController.save').as('save');
    })
        .as('password')
        .prefix('password');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'IntegrationsController.index').as('show');
        Route_1.default.post('/', 'IntegrationsController.create').as('create');
        Route_1.default.get('revoke/:hash', 'IntegrationsController.revoke').as('revoke');
    })
        .as('integrations')
        .prefix('integrations')
        .middleware('bouncer:0,1');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'CspsController.index').as('show');
        Route_1.default.get('/solve', 'CspsController.all').as('all');
        Route_1.default.get('/solve/:uuid', 'CspsController.solve').as('solve');
    })
        .as('csp')
        .prefix('csp')
        .middleware('bouncer:0');
    Route_1.default
        .group(() => {
        Route_1.default.get('/', 'FeedbacksController.index').as('show');
        Route_1.default.get('datatable', 'FeedbacksController.datatable').as('datatable');
    })
        .as('feedbacks')
        .prefix('feedbacks')
        .middleware('bouncer:0,2');
};
//# sourceMappingURL=studio.js.map