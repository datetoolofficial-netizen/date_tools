export const SITE_URL = 'https://date-tool.com';
export const SITE_NAME = 'الأدوات الشاملة';
export const DEFAULT_SITE_DESCRIPTION = 'مجموعة أدوات عملية لحساب التاريخ والوقت والطقس بسرعة ووضوح من المتصفح.';

export const publicToolSeo = {
    date: {
        path: '/',
        name: 'أدوات التاريخ',
        title: 'أدوات التاريخ - حاسبة العمر وتحويل التاريخ وحساب المدة',
        description: 'استخدم أدوات التاريخ لحساب العمر، تحويل التاريخ بين الميلادي والهجري، وحساب المدة بين تاريخين بطريقة واضحة وسريعة مع محتوى إرشادي يحافظ على الخصوصية.',
        keywords: ['حاسبة العمر', 'تحويل التاريخ', 'التاريخ الهجري', 'التاريخ الميلادي', 'حساب المدة بين تاريخين', 'مواعيد الرواتب'],
    },
    clock: {
        path: '/clock',
        name: 'أدوات الساعة والوقت',
        title: 'أدوات الساعة والوقت - تحويل 24 إلى 12 وحساب فرق التوقيت',
        description: 'حوّل الوقت من نظام 24 ساعة إلى 12 ساعة، واعرف الساعة الحالية، واحسب فرق التوقيت بين المدن عبر البحث عن المدينة مع نصائح واضحة للاستخدام اليومي.',
        keywords: ['تحويل الساعة', 'فرق التوقيت', 'الوقت الآن', 'نظام 24 ساعة', 'نظام 12 ساعة', 'الساعة الحالية في المدن'],
    },
    weather: {
        path: '/weather',
        name: 'أدوات الطقس',
        title: 'أدوات الطقس - حالة الطقس ونسبة المطر وتوقعات 5 أيام',
        description: 'اعرف حالة الطقس الحالية، درجة الحرارة، الإحساس الحراري، الرطوبة، الرياح، توقع المطر، ومؤشر UV مع توقعات الأيام القادمة ونصائح للخروج.',
        keywords: ['حالة الطقس', 'توقع المطر', 'درجة الحرارة', 'مؤشر UV', 'طقس المدينة', 'الرطوبة والرياح'],
    },
};

export const noIndexMetadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export function absoluteSiteUrl(path = '/') {
    return new URL(path, SITE_URL).toString();
}

export function buildToolMetadata(toolKey) {
    const tool = publicToolSeo[toolKey] || publicToolSeo.date;
    const url = absoluteSiteUrl(tool.path);

    return {
        metadataBase: new URL(SITE_URL),
        title: tool.title,
        description: tool.description,
        keywords: tool.keywords,
        alternates: {
            canonical: tool.path,
        },
        openGraph: {
            title: tool.title,
            description: tool.description,
            url,
            siteName: SITE_NAME,
            locale: 'ar_SA',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.title,
            description: tool.description,
        },
    };
}

export function buildSiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'ar-SA',
        description: DEFAULT_SITE_DESCRIPTION,
        publisher: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}

export function buildToolJsonLd(toolKey) {
    const tool = publicToolSeo[toolKey] || publicToolSeo.date;
    const url = absoluteSiteUrl(tool.path);

    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${url}#application`,
            name: tool.name,
            url,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            inLanguage: 'ar-SA',
            description: tool.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'SAR',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: SITE_NAME,
                    item: SITE_URL,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: tool.name,
                    item: url,
                },
            ],
        },
    ];

    if (Array.isArray(tool.faq) && tool.faq.length > 0) {
        schemas.splice(1, 0, {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                },
            })),
        });
    }

    return schemas;
}
