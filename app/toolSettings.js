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
        label: 'أداة التاريخ',
        heroTitle: 'أدوات التاريخ الشاملة',
        heroDescription: 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة',
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
                canonical: '/',
                lastModified: DEFAULT_SEO_LAST_MODIFIED,
            },
            dateConverter: {
                searchTitle: 'تحويل التاريخ من هجري إلى ميلادي والعكس',
                metaDescription: 'حوّل التاريخ من هجري إلى ميلادي أو من ميلادي إلى هجري بسرعة، مع نتيجة واضحة مناسبة للمواعيد والوثائق.',
                h1: 'تحويل التاريخ الهجري والميلادي',
                primaryKeyword: 'تحويل التاريخ',
                supportingKeywords: 'تحويل هجري لميلادي, تحويل ميلادي لهجري, محول التاريخ',
                canonical: '/',
                lastModified: DEFAULT_SEO_LAST_MODIFIED,
            },
            durationCalc: {
                searchTitle: 'حساب المدة بين تاريخين بالهجري والميلادي',
                metaDescription: 'احسب الفرق والمدة بين تاريخين بالسنوات والأشهر والأيام، سواء كان التاريخان في الماضي أو المستقبل.',
                h1: 'حساب المدة بين تاريخين',
                primaryKeyword: 'حساب المدة بين تاريخين',
                supportingKeywords: 'الفرق بين تاريخين, حاسبة الأيام, حساب المدة بالهجري والميلادي',
                canonical: '/',
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
        label: 'أداة الساعة',
        heroTitle: 'أدوات الساعة والوقت',
        heroDescription: 'تحويل نظام الساعة، معرفة الوقت الحالي، وحساب فرق التوقيت بسرعة.',
        seo: {
            searchTitle: 'تحويل الساعة وحساب فرق التوقيت بين المدن',
            metaDescription: 'حوّل الوقت من نظام 24 إلى 12 ساعة، واعرف الوقت الحالي، واحسب فرق التوقيت بين مدينتين بسهولة.',
            h1: 'تحويل الساعة وحساب فرق التوقيت',
            primaryKeyword: 'تحويل الساعة',
            supportingKeywords: 'فرق التوقيت بين المدن, الساعة الآن, تحويل 24 إلى 12',
            canonical: '/clock',
            lastModified: DEFAULT_SEO_LAST_MODIFIED,
        },
        subtoolSeo: {},
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
        label: 'أداة الطقس',
        heroTitle: 'أدوات الطقس',
        heroDescription: 'اعرف طقس مدينتك، مؤشر الحرارة المحسوسة، الرطوبة، الرياح وUV بسرعة.',
        seo: {
            searchTitle: 'حالة الطقس اليوم وتوقعات 5 أيام',
            metaDescription: 'اعرف طقس مدينتك ودرجة الحرارة المحسوسة والرطوبة والرياح وتوقع المطر ومؤشر UV مع توقعات الأيام القادمة.',
            h1: 'حالة الطقس اليوم وتوقعات الأيام القادمة',
            primaryKeyword: 'حالة الطقس اليوم',
            supportingKeywords: 'توقعات الطقس, نسبة المطر, درجة الحرارة, مؤشر UV',
            canonical: '/weather',
            lastModified: DEFAULT_SEO_LAST_MODIFIED,
        },
        subtoolSeo: {},
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

    return Object.fromEntries(
        Object.entries(defaults).map(([key, fallback]) => [
            key,
            normalizeSeoRecord(subtoolSeo?.[key], fallback),
        ])
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
                    label: String(value.label || defaults.label).trim() || defaults.label,
                    heroTitle: String(value.heroTitle || defaults.heroTitle).trim() || defaults.heroTitle,
                    heroDescription: String(value.heroDescription || defaults.heroDescription).trim() || defaults.heroDescription,
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
