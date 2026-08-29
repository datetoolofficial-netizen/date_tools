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
                firstDate: 'التاريخ الأول المدخل',
                secondDate: 'التاريخ الثاني المدخل',
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
            shareImageUrl: '',
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
                shareImageUrl: '',
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
            durationResult: 'استخدمت {toolTitle} لحساب المدة بين تاريخين.\n\nالتاريخ الأول: {firstDate}\nالتاريخ الثاني: {secondDate}\nالنتيجة: {result}\n\nجرّب الأداة من هنا:\n{url}',
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
            shareImageUrl: '',
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
            shareImageUrl: '',
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
            currentWeatherResult: 'الطقس في {city}:\nدرجة الحرارة: {temperature}\nالحالة: {condition}\nالإحساس: {feelsLike}\nالرطوبة: {humidity}\nالرياح: {wind}\nتوقع المطر: {rainChance}\nمؤشر UV: {uv}\n\n{url}',
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

export const DEFAULT_TOOL_LOCALIZATIONS = {
    date: {
        en: {
            seo: {
                searchTitle: 'Age Calculator, Date Converter and Date Difference',
                metaDescription: 'Calculate age in Gregorian or Hijri, convert dates between both calendars, and find the exact duration between two dates.',
                h1: 'Age Calculator, Date Converter and Date Difference',
                primaryKeyword: 'age calculator and date converter',
                supportingKeywords: 'Hijri age calculator, Gregorian age calculator, date conversion, date difference calculator',
            },
            subtoolSeo: {
                ageCalc: { searchTitle: 'Gregorian and Hijri Age Calculator', metaDescription: 'Calculate your exact age in years, months and days from a Gregorian or Hijri birth date.', h1: 'Gregorian and Hijri Age Calculator', primaryKeyword: 'age calculator', supportingKeywords: 'calculate age, Hijri age, Gregorian age' },
                dateConverter: { searchTitle: 'Hijri to Gregorian Date Converter and Vice Versa', metaDescription: 'Convert a date from Hijri to Gregorian or Gregorian to Hijri quickly with a clear, accurate result.', h1: 'Hijri and Gregorian Date Converter', primaryKeyword: 'date converter', supportingKeywords: 'Hijri to Gregorian, Gregorian to Hijri, calendar converter' },
                durationCalc: { searchTitle: 'Calculate the Duration Between Two Dates', metaDescription: 'Calculate the difference between two dates in years, months and days for past or future dates.', h1: 'Duration Between Two Dates', primaryKeyword: 'date difference calculator', supportingKeywords: 'days between dates, duration calculator, Hijri and Gregorian dates' },
            },
            subtools: { ageCalc: 'Calculate Your Age', dateConverter: 'Convert Dates', durationCalc: 'Duration Between Dates' },
        },
    },
    clock: {
        en: {
            seo: { searchTitle: 'Time Converter and Time Difference Between Cities', metaDescription: 'Convert 24-hour time to 12-hour time, check the current time, and calculate the time difference between two cities.', h1: 'Time Converter and Time Difference', primaryKeyword: 'time converter', supportingKeywords: 'time difference, current time, 24 hour to 12 hour' },
            subtoolSeo: {
                timeConverter: { searchTitle: 'Convert 24-Hour Time to 12-Hour Time', metaDescription: 'Convert any time from the 24-hour clock to the 12-hour clock with a clear AM or PM result.', h1: '24-Hour to 12-Hour Time Converter', primaryKeyword: '24 hour to 12 hour converter', supportingKeywords: 'time converter, 12 hour clock, 24 hour clock' },
                timezoneDiff: { searchTitle: 'Time Difference Between Two Cities', metaDescription: 'Find the current time in two cities and calculate the time difference between them.', h1: 'Time Difference Between Two Cities', primaryKeyword: 'time difference between cities', supportingKeywords: 'world clock, current city time, timezone difference' },
            },
            subtools: { timeConverter: 'Convert 24-Hour Time', timezoneDiff: 'Time Difference Between Cities' },
        },
    },
    weather: {
        en: {
            seo: { searchTitle: 'Today’s Weather and 5-Day Forecast', metaDescription: 'Check current temperature, feels-like temperature, humidity, wind, rain chance, UV index and the coming forecast.', h1: 'Today’s Weather and Upcoming Forecast', primaryKeyword: 'today weather', supportingKeywords: 'weather forecast, rain chance, temperature, UV index' },
            subtoolSeo: {
                weatherSearch: { searchTitle: 'Search Weather by City', metaDescription: 'Search by city to view current weather, temperature and essential conditions.', h1: 'Weather by City', primaryKeyword: 'city weather', supportingKeywords: 'weather search, current weather, city temperature' },
                currentWeather: { searchTitle: 'Current Weather and Feels-Like Temperature', metaDescription: 'See current and feels-like temperature, humidity, wind, rain probability and UV index.', h1: 'Current Weather', primaryKeyword: 'current weather', supportingKeywords: 'feels like temperature, humidity, wind speed, rain chance' },
                outdoorAdvice: { searchTitle: 'Outdoor Advice Based on Today’s Weather', metaDescription: 'Get concise outdoor advice based on temperature, rain probability and UV index.', h1: 'Today’s Outdoor Advice', primaryKeyword: 'weather advice today', supportingKeywords: 'outdoor weather, UV index, rain chance' },
                forecast: { searchTitle: '5-Day Weather Forecast', metaDescription: 'View expected temperature, sky conditions and rain probability for the next five days.', h1: 'Weather Forecast for the Coming Days', primaryKeyword: '5 day weather forecast', supportingKeywords: 'upcoming weather, rain forecast, expected temperature' },
            },
            subtools: { weatherSearch: 'Search Weather', currentWeather: 'Current Weather', outdoorAdvice: 'Outdoor Advice', forecast: '5-Day Forecast' },
        },
    },
};

const LEGACY_SHARE_TEMPLATES = {
    date: {
        eventsResult: '{title}\n\n{events}\n\n{url}',
        ageResult: '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
        dateConversionResult: '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
        durationResult: [
            '{toolTitle}\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\n{url}',
            'استخدمت {toolTitle} لحساب المدة بين تاريخين.\n\n{inputLabel}: {input}\nالنتيجة: {result}\n\nجرّب الأداة من هنا:\n{url}',
        ],
    },
    weather: {
        currentWeatherResult: 'الطقس في {city}: {temperature} - {condition}، الإحساس {feelsLike}\n\n{url}',
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
        shareImageUrl: String(value?.shareImageUrl || defaults.shareImageUrl || '').trim().slice(0, 500),
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

function normalizeLocalizedSeoRecord(value = {}, defaults = {}) {
    return {
        searchTitle: String(value?.searchTitle || defaults.searchTitle || '').trim(),
        metaDescription: String(value?.metaDescription || defaults.metaDescription || '').trim(),
        h1: String(value?.h1 || defaults.h1 || '').trim(),
        primaryKeyword: String(value?.primaryKeyword || defaults.primaryKeyword || '').trim(),
        supportingKeywords: String(value?.supportingKeywords || defaults.supportingKeywords || '').trim(),
    };
}

function normalizeToolLocalizations(toolKey, value = {}) {
    const defaults = DEFAULT_TOOL_LOCALIZATIONS[toolKey]?.en || {};
    const english = value?.en || {};
    return {
        en: {
            seo: normalizeLocalizedSeoRecord(english.seo, defaults.seo),
            subtoolSeo: Object.fromEntries(Object.entries(defaults.subtoolSeo || {}).map(([key, fallback]) => [
                key,
                normalizeLocalizedSeoRecord(english.subtoolSeo?.[key], fallback),
            ])),
            subtools: Object.fromEntries(Object.entries(defaults.subtools || {}).map(([key, fallback]) => [
                key,
                String(english.subtools?.[key] || fallback).trim() || fallback,
            ])),
            faqs: normalizeFaqItems(english.faqs),
        },
    };
}

function normalizeShareTemplates(toolKey, shareTemplates = {}) {
    const defaults = DEFAULT_TOOL_SETTINGS[toolKey]?.shareTemplates || {};
    const legacyDefaults = LEGACY_SHARE_TEMPLATES[toolKey] || {};

    return Object.fromEntries(
        Object.entries(defaults).map(([key, fallback]) => {
            const storedValue = String(shareTemplates?.[key] || '').trim();
            const legacyValues = (Array.isArray(legacyDefaults[key])
                ? legacyDefaults[key]
                : [legacyDefaults[key]])
                .map((value) => String(value || '').trim())
                .filter(Boolean);
            const shouldUseFallback = !storedValue || legacyValues.includes(storedValue);

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
                    localizations: normalizeToolLocalizations(toolKey, value.localizations),
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
                localizations: value.localizations,
            },
        ])
    );
}

export function getToolSettings(configData, toolKey, lang = 'ar') {
    const normalized = normalizeToolSettings(configData?.toolSettings || {});
    const settings = normalized[toolKey] || DEFAULT_TOOL_SETTINGS[toolKey];
    if (lang !== 'en') return settings;

    const english = settings.localizations?.en || DEFAULT_TOOL_LOCALIZATIONS[toolKey]?.en;
    if (!english) return settings;
    return {
        ...settings,
        seo: { ...settings.seo, ...english.seo },
        subtoolSeo: Object.fromEntries(Object.entries(settings.subtoolSeo || {}).map(([key, value]) => [
            key,
            { ...value, ...(english.subtoolSeo?.[key] || {}) },
        ])),
        subtools: { ...settings.subtools, ...english.subtools },
        faqs: english.faqs || [],
    };
}

export function getToolFaqs(configData, toolKey, lang = 'ar') {
    return (getToolSettings(configData, toolKey, lang)?.faqs || []).filter((item) => item.active !== false);
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
