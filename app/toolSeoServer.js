import { DEFAULT_TOOL_SETTINGS, getToolSettings } from './toolSettings';
import { SITE_NAME, SITE_URL, absoluteSiteUrl } from './seoConfig';

const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
    if ('mapValue' in value) return decodeFirestoreFields(value.mapValue.fields || {});
    return undefined;
}

function decodeFirestoreFields(fields = {}) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)])
    );
}

async function getSiteConfig() {
    try {
        const response = await fetch(firestoreSettingsUrl, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) return {};
        const payload = await response.json();
        return decodeFirestoreFields(payload.fields || {});
    } catch {
        return {};
    }
}

function splitKeywords(value = '') {
    return String(value)
        .split(/[,،\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function getManagedToolPage(toolKey, subtoolKey = '') {
    const config = await getSiteConfig();
    const settings = getToolSettings(config, toolKey) || DEFAULT_TOOL_SETTINGS[toolKey];
    const seo = subtoolKey
        ? settings.subtoolSeo?.[subtoolKey] || DEFAULT_TOOL_SETTINGS[toolKey]?.subtoolSeo?.[subtoolKey]
        : settings.seo || DEFAULT_TOOL_SETTINGS[toolKey]?.seo;

    return {
        config,
        settings,
        seo,
        title: seo?.h1,
        description: seo?.metaDescription,
        path: seo?.canonical || '/',
        keywords: [seo?.primaryKeyword, ...splitKeywords(seo?.supportingKeywords)].filter(Boolean),
    };
}

export async function buildManagedToolMetadata(toolKey, subtoolKey = '') {
    const page = await getManagedToolPage(toolKey, subtoolKey);
    const title = page.seo?.searchTitle || page.title;
    const description = page.seo?.metaDescription || page.description;
    const url = absoluteSiteUrl(page.path);

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords: page.keywords,
        alternates: { canonical: page.path },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'ar_SA',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export function buildManagedToolJsonLd(page, faqs = []) {
    const url = absoluteSiteUrl(page.path);
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: page.title,
            url,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            inLanguage: 'ar-SA',
            description: page.seo?.metaDescription || page.description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: page.title, item: url },
            ],
        },
    ];

    const activeFaqs = (faqs || []).filter((item) => item?.active !== false && item?.q && item?.a);
    if (activeFaqs.length > 0) {
        schemas.splice(1, 0, {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: activeFaqs.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
        });
    }

    return schemas;
}
