import { DEFAULT_TOOL_SETTINGS, getToolSettings } from './toolSettings';
import { SITE_NAME, SITE_URL, absoluteSiteUrl } from './seoConfig';
import { getPublicSiteConfigFromFirestore } from './firestorePublicConfig';

export async function getManagedSiteConfig() {
    return getPublicSiteConfigFromFirestore({ revalidate: 300 });
}

function splitKeywords(value = '') {
    return String(value)
        .split(/[,،\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function getManagedToolPage(toolKey, subtoolKey = '') {
    const config = await getManagedSiteConfig();
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
