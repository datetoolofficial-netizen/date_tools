import { SITE_URL, publicToolSeo } from '../seoConfig';
import { getPublicSiteConfigFromFirestore } from '../firestorePublicConfig';

export const revalidate = 3600;

const corePages = [
    { title: 'الرئيسية وأدوات التاريخ', path: '/' },
    { title: 'أدوات الساعة والوقت', path: publicToolSeo.clock.path },
    { title: 'أدوات الطقس', path: publicToolSeo.weather.path },
];

function pageUrl(path) {
    return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

function collectManagedPages(config = {}) {
    if (!Array.isArray(config.internalPages)) return [];

    return config.internalPages.flatMap((page) => {
        const slug = String(page?.slug || '').trim().replace(/^\/+|\/+$/g, '');
        if (!slug || slug.includes('/')) return [];
        if (page?.enabled === false || page?.isActive === false || page?.deleted === true) return [];

        return [{
            title: String(page?.title || page?.titleEn || slug).trim(),
            path: `/${slug}`,
        }];
    });
}

export async function GET() {
    const config = await getPublicSiteConfigFromFirestore({ revalidate });
    const publicPages = [...corePages, ...collectManagedPages(config)];
    const body = [
        '# الأدوات الشاملة',
        '',
        'موقع عربي يقدم أدوات عملية للتاريخ والوقت والطقس، مع صفحات معلومات وسياسات واضحة للزوار ومحركات البحث.',
        '',
        '## الصفحات العامة المهمة',
        '',
        ...publicPages.map((page) => `- [${page.title}](${pageUrl(page.path)})`),
        '',
        '## ملاحظات للزواحف',
        '',
        '- صفحات الإدارة وبوابة العميل وواجهات API ليست مخصصة للفهرسة.',
        '- أدوات الموقع تعرض النتائج داخل الصفحة ولا تضيف بيانات شخصية إلى الروابط.',
        '- ملف sitemap الرئيسي متاح على https://date-tool.com/sitemap.xml.',
        '',
    ].join('\n');

    return new Response(body, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
