export default function manifest() {
    return {
        name: 'أدوات التاريخ الشاملة',
        short_name: 'أدوات التاريخ',
        description: 'أداة شاملة لحساب العمر وتحويل التواريخ وأدوات الساعة والطقس.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'ar',
        background_color: '#0f172a',
        theme_color: '#1e3a8a',
        categories: ['utilities', 'productivity'],
        icons: [
            {
                src: '/pwa-icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa-icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/pwa-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: 'أدوات التاريخ',
                short_name: 'التاريخ',
                url: '/',
                icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
                name: 'أدوات الساعة',
                short_name: 'الساعة',
                url: '/clock',
                icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
                name: 'أدوات الطقس',
                short_name: 'الطقس',
                url: '/weather',
                icons: [{ src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
        ],
    };
}
