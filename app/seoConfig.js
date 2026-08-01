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
        faq: [
            {
                question: 'ما الذي تقدمه أدوات التاريخ؟',
                answer: 'تجمع الصفحة أدوات حساب العمر، تحويل التاريخ بين الميلادي والهجري، وحساب المدة بين تاريخين، مع نتائج مبسطة مناسبة للاستخدام اليومي والتنظيم الشخصي.',
            },
            {
                question: 'هل تظهر بيانات الميلاد في الرابط أو سجلات التتبع؟',
                answer: 'لا يتم وضع تاريخ الميلاد أو البريد الإلكتروني في عنوان URL أو query string أو أسماء أحداث التحليلات أو طلبات الإعلانات، وتستخدم المشاركة نصًا عامًا دون بيانات شخصية.',
            },
            {
                question: 'هل يعتمد تحويل التاريخ الهجري على تقويم أم القرى؟',
                answer: 'تعتمد الأداة على حسابات تقويمية عملية، وقد تختلف النتائج قليلًا عن بعض التقويمات الرسمية أو الرؤية الشرعية؛ لذلك يفضل الرجوع للجهة الرسمية في المعاملات الحساسة.',
            },
            {
                question: 'هل يمكن حساب مدة مستقبلية؟',
                answer: 'نعم، يمكن استخدام محول التاريخ وحساب المدة مع تواريخ مستقبلية، بينما تبقى حاسبة العمر مصممة لتاريخ ميلاد من الماضي حتى اليوم.',
            },
        ],
    },
    clock: {
        path: '/clock',
        name: 'أدوات الساعة والوقت',
        title: 'أدوات الساعة والوقت - تحويل 24 إلى 12 وحساب فرق التوقيت',
        description: 'حوّل الوقت من نظام 24 ساعة إلى 12 ساعة، واعرف الساعة الحالية، واحسب فرق التوقيت بين المدن عبر البحث عن المدينة مع نصائح واضحة للاستخدام اليومي.',
        keywords: ['تحويل الساعة', 'فرق التوقيت', 'الوقت الآن', 'نظام 24 ساعة', 'نظام 12 ساعة', 'الساعة الحالية في المدن'],
        faq: [
            {
                question: 'كيف أحول الوقت من نظام 24 ساعة إلى 12 ساعة؟',
                answer: 'اختر الساعة والدقيقة بنظام 24 ساعة ثم اضغط تحويل، وستظهر النتيجة بصيغة 12 ساعة مع الفترة المناسبة صباحًا أو مساءً.',
            },
            {
                question: 'هل يعتمد وقت المدينة الحالية على موقعي؟',
                answer: 'عند السماح من المتصفح فقط، تستخدم الأداة المنطقة الزمنية المناسبة لموقعك دون حفظ إحداثياتك في قاعدة البيانات، ويمكنك استخدام البحث اليدوي بدلًا من ذلك.',
            },
            {
                question: 'كيف يتم حساب فرق التوقيت بين مدينتين؟',
                answer: 'تبحث الأداة عن المنطقة الزمنية لكل مدينة ثم تقارن الفارق بينهما وتعرض النتيجة المختصرة بالساعات مع الوقت الحالي في كل مدينة.',
            },
            {
                question: 'هل أحتاج إلى حساب لإنشاء نص مشاركة الوقت؟',
                answer: 'لا تحتاج إلى حساب. زر المشاركة ينشئ نصًا مختصرًا للنتيجة دون إضافة بيانات شخصية إلى الرابط أو أحداث التحليلات.',
            },
        ],
    },
    weather: {
        path: '/weather',
        name: 'أدوات الطقس',
        title: 'أدوات الطقس - حالة الطقس ونسبة المطر وتوقعات 5 أيام',
        description: 'اعرف حالة الطقس الحالية، درجة الحرارة، الإحساس الحراري، الرطوبة، الرياح، توقع المطر، ومؤشر UV مع توقعات الأيام القادمة ونصائح للخروج.',
        keywords: ['حالة الطقس', 'توقع المطر', 'درجة الحرارة', 'مؤشر UV', 'طقس المدينة', 'الرطوبة والرياح'],
        faq: [
            {
                question: 'من أين تأتي بيانات الطقس؟',
                answer: 'تعرض صفحة الطقس بيانات من خدمة Open-Meteo العامة، وتشمل الحرارة والرطوبة والرياح ونسبة توقع المطر ومؤشر UV عند توفرها.',
            },
            {
                question: 'هل يمكن عرض طقس موقعي الحالي؟',
                answer: 'نعم، إذا سمحت من المتصفح باستخدام الموقع الحالي، تعرض الأداة الطقس الأقرب لك دون حفظ إحداثياتك في قاعدة البيانات.',
            },
            {
                question: 'لماذا قد تختلف توقعات الطقس عن تطبيقات أخرى؟',
                answer: 'قد تختلف النتائج حسب مصدر البيانات ووقت التحديث والنموذج الجوي أو أقرب نقطة بيانات للمدينة أو الإحداثيات المستخدمة.',
            },
            {
                question: 'ما فائدة مؤشر UV وتوقع المطر؟',
                answer: 'يساعد مؤشر UV على التخطيط للخروج نهارًا وتجنب التعرض الطويل للشمس، بينما يوضح توقع المطر احتمالية الهطول بدل الاكتفاء بوصف عام للطقس.',
            },
        ],
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
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'ar-SA',
        description: DEFAULT_SITE_DESCRIPTION,
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}

export function buildToolJsonLd(toolKey) {
    const tool = publicToolSeo[toolKey] || publicToolSeo.date;
    const url = absoluteSiteUrl(tool.path);

    return [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.name,
            url,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            inLanguage: 'ar-SA',
            description: tool.description,
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'SAR',
            },
        },
        {
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
}
