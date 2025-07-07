"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sidebar = {
    dashboard: {
        title: 'Dasbor',
    },
    overview: {
        title: 'Ikhtisar',
        route: 'studio.overview',
        icon: 'dashboard',
    },
    content: {
        title: 'Konten',
        permissions: [0, 2, 3],
    },
    news: {
        title: 'Berita',
        permissions: [0, 2, 3],
        route: null,
        icon: 'rss',
        childrens: {
            categories: {
                title: 'Kategori',
                route: ['studio.categories.show', { type: 'news' }],
            },
            manage: {
                title: 'Kelola',
                route: 'studio.news.show',
            },
        },
    },
    articles: {
        title: 'Artikel',
        permissions: [0, 2, 3],
        route: null,
        icon: 'article',
        childrens: {
            categories: {
                title: 'Kategori',
                route: ['studio.categories.show', { type: 'articles' }],
            },
            manage: {
                title: 'Kelola',
                route: 'studio.articles.show',
            },
        },
    },
    infographics: {
        title: 'Infografis',
        permissions: [0, 2],
        route: 'studio.infographics.show',
        icon: 'img',
    },
    city: {
        title: 'Profil Kota',
        permissions: [0, 2],
        route: null,
        icon: 'building',
        childrens: {
            history: {
                title: 'Sejarah',
                route: ['studio.pages.show', { slug: 'sejarah' }],
            },
            resources: {
                title: 'Sumber Daya Alam',
                route: 'studio.natres.show',
            },
            logo: {
                title: 'Lambang & Identitas',
                route: ['studio.pages.show', { slug: 'lambang-identitas' }],
            },
            vm: {
                title: 'Visi & Misi',
                route: ['studio.pages.show', { slug: 'visi-misi' }],
            },
        },
    },
    governance: {
        title: 'Pemerintahan',
        permissions: [0, 2],
        route: null,
        icon: 'bookmark',
        childrens: {
            functions: {
                title: 'Tugas & Fungsi',
                route: ['studio.pages.show', { slug: 'tugas-fungsi' }],
            },
            chief: {
                title: 'Profil Bupati',
                route: ['studio.pages.show', { slug: 'bupati' }],
            },
            deputy: {
                title: 'Profil Wakil Bupati',
                route: ['studio.pages.show', { slug: 'wakil-bupati' }],
            },
            secretariat: {
                title: 'Profil Sekretaris Daerah',
                route: ['studio.pages.show', { slug: 'sekretaris-daerah' }],
            },
            organizational: {
                title: 'Struktur Organisasi',
                route: ['studio.pages.show', { slug: 'struktur-organisasi' }],
            },
            structure: {
                title: 'Pejabat Struktural',
                route: 'studio.officers.show',
            },
        },
    },
    manage: {
        title: 'Kelola',
        permissions: [0, 1, 2, 3],
    },
    announcements: {
        title: 'Pengumuman',
        permissions: [0, 2, 3],
        route: 'studio.announcements.show',
        icon: 'folders',
    },
    events: {
        title: 'Agenda',
        permissions: [0, 2],
        route: 'studio.events.show',
        icon: 'calendar-alt',
    },
    wifi: {
        title: 'Wi-Fi Publik',
        permissions: [0, 2],
        route: 'studio.wifi.show',
        icon: 'wifi',
    },
    services: {
        title: 'Layanan',
        permissions: [0, 2, 3],
        route: 'studio.services.show',
        icon: 'share-alt',
    },
    governments: {
        title: 'Perangkat Daerah',
        permissions: [0, 2],
        route: 'studio.governments.show',
        icon: 'network',
    },
    regents: {
        title: 'Bupati',
        permissions: [0, 2],
        route: 'studio.regents.show',
        icon: 'shield-check',
    },
    studio: {
        title: 'Situs',
        permissions: [0, 2],
    },
    feedbacks: {
        title: 'Umpan Balik',
        permissions: [0, 2],
        route: 'studio.feedbacks.show',
        icon: 'comments',
    },
    integrations: {
        title: 'Integrasi',
        permissions: [0, 1],
        route: 'studio.integrations.show',
        icon: 'link',
    },
    csp: {
        title: 'Laporan CSP',
        permissions: [0],
        route: 'studio.csp.show',
        icon: 'report',
    },
    users: {
        title: 'Pengguna',
        permissions: [0, 2],
        route: 'studio.users.show',
        icon: 'users',
    },
    settings: {
        title: 'Pengaturan',
        permissions: [0, 2],
        route: 'studio.settings.entry',
        icon: 'setting',
    },
};
exports.default = Sidebar;
//# sourceMappingURL=Sidebar.js.map