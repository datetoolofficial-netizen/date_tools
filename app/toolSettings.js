export const TOOL_SETTING_KEYS = ['date', 'clock', 'weather'];

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
        faqs: [],
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
