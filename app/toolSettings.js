import { TOOL_SECTION_ROUTES } from '../toolSectionRoutes';

export const TOOL_SETTING_KEYS = ['date', 'clock', 'weather'];

const DEFAULT_SEO_LAST_MODIFIED = '2026-08-04';

export const SHARE_TEMPLATE_DEFINITIONS = {
    date: {
        eventsResult: {
            label: 'مشاركة المواعيد',
            variables: {
                title: 'عنوان المشاركة',
                events: 'قائمة المواعيد القادمة',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        ageResult: {
            label: 'مشاركة نتيجة حساب العمر',
            variables: {
                toolTitle: 'اسم الأداة الفرعية',
                inputLabel: 'وصف المدخلات',
                input: 'التاريخ المدخل',
                result: 'نتيجة الحساب',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        dateConversionResult: {
            label: 'مشاركة نتيجة تحويل التاريخ',
            variables: {
                toolTitle: 'اسم الأداة الفرعية',
                inputLabel: 'وصف المدخلات',
                input: 'التاريخ المدخل',
                result: 'نتيجة التحويل',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        durationResult: {
            label: 'مشاركة نتيجة حساب المدة',
            variables: {
                toolTitle: 'اسم الأداة الفرعية',
                inputLabel: 'وصف المدخلات',
                input: 'التاريخان المدخلان',
                result: 'نتيجة حساب المدة',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
    },
    clock: {
        timeConverterResult: {
            label: 'مشاركة نتيجة تحويل الساعة',
            variables: {
                input: 'الوقت المدخل بنظام 24 ساعة',
                inputHour: 'الساعة المدخلة',
                inputMinute: 'الدقيقة المدخلة',
                result: 'الوقت الناتج بنظام 12 ساعة',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        timezoneDiffResult: {
            label: 'مشاركة نتيجة فرق التوقيت',
            variables: {
                fromCity: 'المدينة الأولى كما كتبها المستخدم',
                toCity: 'المدينة الثانية كما كتبها المستخدم',
                difference: 'فرق التوقيت المختصر',
                fromTime: 'الساعة الحالية في المدينة الأولى',
                toTime: 'الساعة الحالية في المدينة الثانية',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
    },
    weather: {
        currentWeatherResult: {
            label: 'مشاركة الطقس الحالي',
            variables: {
                city: 'اسم المدينة',
                temperature: 'درجة الحرارة',
                condition: 'حالة الطقس',
                feelsLike: 'درجة الإحساس',
                humidity: 'الرطوبة',
                wind: 'سرعة الرياح',
                rainChance: 'توقع المطر',
                uv: 'مؤشر UV',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        outdoorAdviceResult: {
            label: 'مشاركة نصيحة الخروج',
            variables: {
                city: 'اسم المدينة',
                advice: 'نص النصيحة الحالية',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
        forecastResult: {
            label: 'مشاركة التوقعات',
            variables: {
                city: 'اسم المدينة',
                forecast: 'ملخص التوقعات',
                url: 'رابط الصفحة الحالي بدون بيانات شخصية',
            },
        },
    },
};

export const DEFAULT_TOOL_SETTINGS = {
    date: {
        seo: {
            searchTitle: 'حاسبة العمر وتحويل التاريخ وحساب المدة | الأدوات الشاملة',
            metaDescription: 'احسب عمرك بالهجري والميلادي، وحوّل التاريخ بين التقويمين، واحسب المدة بين تاريخين عبر أدوات عربية سريعة وواضحة.',
            h1: 'حاسبة العمر وتحويل التاريخ وحساب المدة',
            primaryKeyword: 'حاسبة العمر وتحويل التاريخ',
            supportingKeywords: 'حساب العمر, تحويل التاريخ الهجري والميلادي, حساب المدة بين تاريخين',
            canonical: '/',
            lastModified: DEFAULT_SEO_LAST_MODIFIED,
        },
        subtoolSeo: {
            ageCalc: {
                searchTitle: 'حاسبة العمر بالهجري والميلادي - احسب عمرك بدقة',
                metaDescription: 'احسب عمرك بدقة بالسنوات والأشهر والأيام باستخدام تاريخ الميلاد الهجري أو الميلادي عبر حاسبة عمر عربية سهلة.',
                h1: 'حاسبة العمر بالهجري والميلادي',
                primaryKeyword: 'حاسبة العمر',
                supportingKeywords: 'حساب العمر بالهجري, حساب العمر بالميلادي, احسب عمرك',
                canonical: '/age-calculator',
                lastModified: DEFAULT_SEO_LAST_MODIFIED,
            },
            dateConverter: {
                searchTitle: 'تحويل التاريخ من هجري إلى ميلادي والعكس',
                metaDescription: 'حوّل التاريخ من هجري إلى ميلادي أو من ميلادي إلى هجري بسرعة، مع نتيجة واضحة مناسبة للمواعيد والوثائق.',
                h1: 'تحويل التاريخ الهجري والميلادي',
                primaryKeyword: 'تحويل التاريخ',
                supportingKeywords: 'تحويل هجري لميلادي, تحويل ميلادي لهجري, محول التاريخ',
                canonical: '/date-converter',
                lastModified: DEFAULT_SEO_LAST_MODIFIED,
            },
            durationCalc: {
                searchTitle: 'حساب المدة بين تاريخين بالهجري والميلادي',
                metaDescription: 'احسب الفرق والمدة بين تاريخين بالسنوات والأشهر والأيام، سواء كان التاريخان في الماضي أو المستقبل.',
                h1: 'حساب المدة بين تاريخين',
                primaryKeyword: 'حساب المدة بين تاريخين',
                supportingKeywords: 'الفرق بين تاريخين, حاسبة الأيام, حساب المدة بالهجري والميلادي',
                canonical: '/date-difference',
                lastModified: DEFAULT_SEO_LAST_MODIFIED,
            },
        },
        subtools: {
            ageCalc: 'احسب عمرك بدقة',
            dateConverter: 'تحويل التاريخ',
            durationCalc: 'حساب المدة بين تاريخين',
        },
        shareTemplates: {
            eventsResult: 'هذه مواعيدي القادمة عبر {title}:\n\n{events}\n\n{url}',
            ageResult: 'استخدمت {toolTitle} لمعرفة عمري بدقة.\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\nجرّب الأداة من هنا:\n{url}',
            dateConversionResult: 'استخدمت {toolTitle} لتحويل التاريخ بدقة.\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\nجرّب الأداة من هنا:\n{url}',
            durationResult: 'استخدمت {toolTitle} لحساب المدة بين تاريخين.\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\nجرّب الأداة من هنا:\n{url}',
        },
        shareEnabled: {
            eventsResult: true,
            ageResult: true,
            dateConversionResult: true,
            durationResult: true,
        },
        faqs: [],
    },
    clock: {
        seo: {
            searchTitle: 'تحويل الساعة وحساب فرق التوقيت بين المدن',
            metaDescription: 'حوّل الوقت من نظام 24 إلى 12 ساعة، واعرف الوقت الحالي، واحسب فرق التوقيت بين مدينتين بسهولة.',
            h1: 'تحويل الساعة وحساب فرق التوقيت',
            primaryKeyword: 'تحويل الساعة',
            supportingKeywords: 'فرق التوقيت بين المدن, الساعة الآن, تحويل 24 إلى 12',
            canonical: '/clock',
            lastModified: '2026-08-07',
        },
        subtoolSeo: {
            timeConverter: {
                searchTitle: 'تحويل الساعة من 24 إلى 12 ساعة بسهولة',
                metaDescription: 'حوّل أي وقت من نظام 24 ساعة إلى نظام 12 ساعة مع توضيح الفترة صباحًا أو مساءً بطريقة سريعة وواضحة.',
                h1: 'تحويل الساعة من 24 إلى 12 ساعة',
                primaryKeyword: 'تحويل الساعة من 24 إلى 12',
                supportingKeywords: 'محول الوقت, نظام 12 ساعة, نظام 24 ساعة, تحويل التوقيت',
                canonical: '/time-converter',
                lastModified: '2026-08-07',
            },
            timezoneDiff: {
                searchTitle: 'حساب فرق التوقيت بين مدينتين والوقت الحالي',
                metaDescription: 'ابحث عن مدينتين واحسب فرق التوقيت بينهما، مع عرض الوقت الحالي في كل مدينة دون الحاجة إلى حساب الفرق يدويًا.',
                h1: 'حساب فرق التوقيت بين مدينتين',
                primaryKeyword: 'فرق التوقيت بين مدينتين',
                supportingKeywords: 'حساب فرق التوقيت, الساعة الآن في المدن, فرق الساعات بين الدول',
                canonical: '/timezone-difference',
                lastModified: '2026-08-07',
            },
        },
        subtools: {
            timeConverter: 'تحويل الساعة من 24 إلى 12',
            timezoneDiff: 'فرق التوقيت بين مدينتين',
        },
        shareTemplates: {
            timeConverterResult: 'الساعة {input} تساوي {result} بنظام 12 ساعة\n\n{url}',
            timezoneDiffResult: 'الفرق بين {fromCity} و{toCity}: {difference}\n\n{url}',
        },
        shareEnabled: {
            timeConverterResult: true,
            timezoneDiffResult: true,
        },
        faqs: [],
    },
    weather: {
        seo: {
            searchTitle: 'حالة الطقس اليوم وتوقعات 5 أيام',
            metaDescription: 'اعرف طقس مدينتك ودرجة الحرارة المحسوسة والرطوبة والرياح وتوقع المطر ومؤشر UV مع توقعات الأيام القادمة.',
            h1: 'حالة الطقس اليوم وتوقعات الأيام القادمة',
            primaryKeyword: 'حالة الطقس اليوم',
            supportingKeywords: 'توقعات الطقس, نسبة المطر, درجة الحرارة, مؤشر UV',
            canonical: '/weather',
            lastModified: '2026-08-07',
        },
        subtoolSeo: {
            weatherSearch: {
                searchTitle: 'البحث عن حالة الطقس حسب المدينة',
                metaDescription: 'ابحث باسم المدينة واعرض حالة الطقس الحالية ودرجة الحرارة والبيانات الجوية الأساسية بسرعة.',
                h1: 'عرض الطقس حسب المدينة',
                primaryKeyword: 'طقس المدينة',
                supportingKeywords: 'البحث عن الطقس, حالة الطقس الآن, درجة الحرارة في مدينتي',
                canonical: '/weather-search',
                lastModified: '2026-08-07',
            },
            currentWeather: {
                searchTitle: 'حالة الطقس الآن ودرجة الحرارة المحسوسة',
                metaDescription: 'تعرف على درجة الحرارة الحالية والمحسوسة والرطوبة والرياح واحتمال هطول المطر ومؤشر الأشعة فوق البنفسجية.',
                h1: 'حالة الطقس الآن',
                primaryKeyword: 'حالة الطقس الآن',
                supportingKeywords: 'درجة الحرارة المحسوسة, الرطوبة, سرعة الرياح, احتمال المطر',
                canonical: '/current-weather',
                lastModified: '2026-08-07',
            },
            outdoorAdvice: {
                searchTitle: 'نصيحة الخروج اليوم حسب حالة الطقس',
                metaDescription: 'احصل على نصيحة مختصرة تساعدك على التخطيط للخروج وفق الحرارة واحتمال المطر ومؤشر الأشعة فوق البنفسجية.',
                h1: 'نصيحة الخروج اليوم',
                primaryKeyword: 'نصيحة الطقس اليوم',
                supportingKeywords: 'هل الطقس مناسب للخروج, مؤشر UV, احتمال المطر اليوم',
                canonical: '/outdoor-advice',
                lastModified: '2026-08-07',
            },
            forecast: {
                searchTitle: 'توقعات الطقس لمدة 5 أيام',
                metaDescription: 'تابع توقعات درجات الحرارة وحالة السماء واحتمال المطر للأيام الخمسة القادمة في المدينة التي تختارها.',
                h1: 'توقعات الطقس للأيام القادمة',
                primaryKeyword: 'توقعات الطقس 5 أيام',
                supportingKeywords: 'طقس الأيام القادمة, توقع المطر, درجات الحرارة المتوقعة',
                canonical: '/weather-forecast',
                lastModified: '2026-08-07',
            },
        },
        subtools: {
            weatherSearch: 'عرض الطقس',
            currentWeather: 'الطقس الحالي',
            outdoorAdvice: 'نصيحة الخروج اليوم',
            forecast: 'توقعات 5 أيام',
        },
        shareTemplates: {
            currentWeatherResult: 'الطقس في {city}: {temperature} - {condition}، الإحساس {feelsLike}\n\n{url}',
            outdoorAdviceResult: 'نصيحة الخروج اليوم في {city}: {advice}\n\n{url}',
            forecastResult: 'توقعات الطقس في {city}:\n{forecast}\n\n{url}',
        },
        shareEnabled: {
            currentWeatherResult: true,
            outdoorAdviceResult: true,
            forecastResult: true,
        },
        faqs: [],
    },
};

const LEGACY_SHARE_TEMPLATES = {
    date: {
        eventsResult: '{title}\n\n{events}\n\n{url}',
        ageResult: '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
        dateConversionResult: '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
        durationResult: '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
    },
};

export function normalizeFaqItems(items = []) {
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => ({
            q: String(item?.q || '').trim(),
            a: String(item?.a || '').trim(),
            active: item?.active !== false,
        }))
        .filter((item) => item.q && item.a)
        .slice(0, 12);
}

function normalizeSubtools(toolKey, subtools = {}) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey]?.subtools || {};

    return Object.fromEntries(
        Object.entries(defaults).map(([key, fallback]) => [
            key,
            String(subtools?.[key] || fallback).trim() || fallback,
        ])
    );
}

function normalizeSeoRecord(value = {}, defaults = {}) {
    const requestedCanonical = String(value?.canonical || defaults.canonical || '').trim();
    const canonical = requestedCanonical.startsWith('/') && !requestedCanonical.startsWith('//')
        ? requestedCanonical.split('?')[0].split('#')[0]
        : String(defaults.canonical || '/').trim();

    return {
        searchTitle: String(value?.searchTitle || defaults.searchTitle || '').trim(),
        metaDescription: String(value?.metaDescription || defaults.metaDescription || '').trim(),
        h1: String(value?.h1 || defaults.h1 || '').trim(),
        primaryKeyword: String(value?.primaryKeyword || defaults.primaryKeyword || '').trim(),
        supportingKeywords: Array.isArray(value?.supportingKeywords)
            ? value.supportingKeywords.join(', ')
            : String(value?.supportingKeywords || defaults.supportingKeywords || '').trim(),
        canonical,
        lastModified: String(value?.lastModified || defaults.lastModified || DEFAULT_SEO_LAST_MODIFIED).trim(),
    };
}

function normalizeSubtoolSeo(toolKey, subtoolSeo = {}) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey]?.subtoolSeo || {};
    const parentCanonical = DEFAULT_TOOL_SETTINGS[toolKey]?.seo?.canonical || '/';

    return Object.fromEntries(
        Object.entries(defaults).map(([key, fallback]) => {
            const normalized = normalizeSeoRecord(subtoolSeo?.[key], fallback);
            const publicPath = TOOL_SECTION_ROUTES[toolKey]?.[key]?.publicPath;
            const storedCanonical = String(subtoolSeo?.[key]?.canonical || '').trim();
            const canonical = !storedCanonical || storedCanonical === parentCanonical
                ? publicPath || normalized.canonical
                : normalized.canonical;

            return [
                key,
                {
                    ...normalized,
                    canonical,
                },
            ];
        })
    );
}

function normalizeShareTemplates(toolKey, shareTemplates = {}) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey]?.shareTemplates || {};
    const legacyDefaults = LEGACY_SHARE_TEMPLATES[toolKey] || {};

    return Object.fromEntries(
        Object.entries(defaults).map(([key, fallback]) => {
            const storedValue = String(shareTemplates?.[key] || '').trim();
            const legacyValue = String(legacyDefaults[key] || '').trim();
            const shouldUseFallback = !storedValue || (legacyValue && storedValue === legacyValue);

            return [
                key,
                shouldUseFallback ? fallback : storedValue,
            ];
        })
    );
}

function normalizeShareEnabled(toolKey, shareEnabled = {}) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey]?.shareTemplates || {};

    return Object.fromEntries(
        Object.keys(defaults).map((key) => [
            key,
            shareEnabled?.[key] !== false,
        ])
    );
}

export function normalizeToolSettings(settings = {}) {
    return Object.fromEntries(
        TOOL_SETTING_KEYS.map((toolKey) => {
            const defaults = DEFAULT_TOOL_SETTINGS[toolKey];
            const value = settings?.[toolKey] || {};

            return [
                toolKey,
                {
                    seo: normalizeSeoRecord(value.seo, defaults.seo),
                    subtoolSeo: normalizeSubtoolSeo(toolKey, value.subtoolSeo),
                    subtools: normalizeSubtools(toolKey, value.subtools),
                    shareTemplates: normalizeShareTemplates(toolKey, value.shareTemplates),
                    shareEnabled: normalizeShareEnabled(toolKey, value.shareEnabled),
                    faqs: normalizeFaqItems(value.faqs),
                },
            ];
        })
    );
}

export function serializeToolSettings(settings = {}) {
    const normalized = normalizeToolSettings(settings);

    return Object.fromEntries(
        Object.entries(normalized).map(([toolKey, value]) => [
            toolKey,
            {
                seo: value.seo,
                subtoolSeo: value.subtoolSeo,
                subtools: value.subtools,
                shareTemplates: value.shareTemplates,
                shareEnabled: value.shareEnabled,
                faqs: value.faqs,
            },
        ])
    );
}

export function getToolSettings(configData, toolKey) {
    const normalized = normalizeToolSettings(configData?.toolSettings || {});
    return normalized[toolKey] || DEFAULT_TOOL_SETTINGS[toolKey];
}

export function getToolFaqs(configData, toolKey) {
    return (getToolSettings(configData, toolKey)?.faqs || []).filter((item) => item.active !== false);
}

export function renderShareTemplate(settings, templateKey, variables = {}) {
    const template = settings?.shareTemplates?.[templateKey] || '';

    return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
        const value = variables[key];
        return value === undefined || value === null ? '' : String(value);
    }).trim();
}

export function isShareTemplateEnabled(settings, templateKey) {
    return settings?.shareEnabled?.[templateKey] !== false;
}
