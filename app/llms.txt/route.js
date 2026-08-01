import { SITE_URL, publicToolSeo } from '../seoConfig';

export const revalidate = 3600;

const publicPages = [
    { title: 'الرئيسية وأدوات التاريخ', path: '/' },
    { title: 'أدوات الساعة والوقت', path: publicToolSeo.clock.path },
    { title: 'أدوات الطقس', path: publicToolSeo.weather.path },
    { title: 'جدول الأشهر', path: '/month-names' },
    { title: 'اتصل بنا', path: '/contact' },
    { title: 'سياسة الخصوصية', path: '/privacy' },
    { title: 'شروط الاستخدام', path: '/terms' },
];

function pageUrl(path) {
    return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

export function GET() {
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
