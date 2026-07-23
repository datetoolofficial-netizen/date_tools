export const TOOL_SETTING_KEYS = ['date', 'clock', 'weather'];

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
        faqs: [],
    },
    clock: {
        label: 'أداة الساعة',
        heroTitle: 'أدوات الساعة والوقت',
        heroDescription: 'تحويل نظام الساعة، معرفة الوقت الحالي، وحساب فرق التوقيت بسرعة.',
        subtools: {
            timeConverter: 'تحويل الساعة من 24 إلى 12',
            timezoneDiff: 'فرق التوقيت بين مدينتين',
        },
        shareTemplates: {
            timeConverterResult: 'الساعة {input} تساوي {result} بنظام 12 ساعة\n\n{url}',
            timezoneDiffResult: 'الفرق بين {fromCity} و{toCity}: {difference}\n\n{url}',
        },
        faqs: [],
    },
    weather: {
        label: 'أداة الطقس',
        heroTitle: 'أدوات الطقس',
        heroDescription: 'اعرف طقس مدينتك، مؤشر الحرارة المحسوسة، الرطوبة، الرياح وUV بسرعة.',
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
                    subtools: normalizeSubtools(toolKey, value.subtools),
                    shareTemplates: normalizeShareTemplates(toolKey, value.shareTemplates),
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

export function getToolFaqs(configData, toolKey, defaultFaqs = []) {
    const customFaqs = getToolSettings(configData, toolKey)?.faqs || [];
    return [...defaultFaqs, ...customFaqs];
}

export function renderShareTemplate(settings, templateKey, variables = {}) {
    const template = settings?.shareTemplates?.[templateKey] || '';

    return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
        const value = variables[key];
        return value === undefined || value === null ? '' : String(value);
    }).trim();
}

export function getShareButtonLabel(text, fallback = 'مشاركة النتيجة') {
    return String(text || '')
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line && !/^https?:\/\//i.test(line)) || fallback;
}
