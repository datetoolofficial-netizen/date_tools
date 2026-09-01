import { DEFAULT_TOOL_SETTINGS, getToolSettings } from './toolSettings';
import { SITE_NAME, SITE_URL, absoluteSiteUrl } from './seoConfig';
import { getPublicSiteConfigFromFirestore } from './firestorePublicConfig';
import { getLocalizedSiteConfig } from './localizedConfig';
import { getToolLanguageAlternates } from './localizedToolRoutes';

function absoluteHttpUrl(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return '';

    try {
        const url = new URL(raw, SITE_URL);
        return /^https?:$/i.test(url.protocol) ? url.toString() : '';
    } catch {
        return '';
    }
}

export async function getManagedSiteConfig() {
    return getPublicSiteConfigFromFirestore({ revalidate: 300 });
}

function splitKeywords(value = '') {
    return String(value)
        .split(/[,،\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function getManagedToolPage(toolKey, subtoolKey = '', lang = 'ar') {
    const config = await getManagedSiteConfig();
    const currentLang = lang === 'en' ? 'en' : 'ar';
    const settings = getToolSettings(config, toolKey, currentLang) || DEFAULT_TOOL_SETTINGS[toolKey];
    const seo = subtoolKey
        ? settings.subtoolSeo?.[subtoolKey] || DEFAULT_TOOL_SETTINGS[toolKey]?.subtoolSeo?.[subtoolKey]
        : settings.seo || DEFAULT_TOOL_SETTINGS[toolKey]?.seo;
    const paths = getToolLanguageAlternates(seo?.canonical || '/');
    const localizedConfig = getLocalizedSiteConfig(config, currentLang);

    return {
        config,
        settings,
        seo,
        lang: currentLang,
        siteName: localizedConfig.toolDisplayName || SITE_NAME,
        title: seo?.h1,
        description: seo?.metaDescription,
        path: paths[currentLang],
        alternatePaths: paths,
        keywords: [seo?.primaryKeyword, ...splitKeywords(seo?.supportingKeywords)].filter(Boolean),
    };
}

export async function buildManagedToolMetadata(toolKey, subtoolKey = '', lang = 'ar') {
    const page = await getManagedToolPage(toolKey, subtoolKey, lang);
    const title = page.seo?.searchTitle || page.title;
    const description = page.seo?.metaDescription || page.description;
    const url = absoluteSiteUrl(page.path);
    const shareImageUrl = absoluteHttpUrl(page.seo?.shareImageUrl);
    const images = shareImageUrl ? [{ url: shareImageUrl, alt: page.title || title }] : undefined;

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords: page.keywords,
        alternates: {
            canonical: page.path,
            languages: {
                'ar-SA': page.alternatePaths.ar,
                'en-US': page.alternatePaths.en,
                'x-default': page.alternatePaths.ar,
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: page.siteName,
            locale: page.lang === 'en' ? 'en_US' : 'ar_SA',
            alternateLocale: page.lang === 'en' ? ['ar_SA'] : ['en_US'],
            type: 'website',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: shareImageUrl ? [shareImageUrl] : undefined,
        },
    };
}

export function buildManagedToolJsonLd(page, faqs = []) {
    const url = absoluteSiteUrl(page.path);
    const homeUrl = absoluteSiteUrl(page.lang === 'en' ? '/en' : '/');
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${url}#application`,
            name: page.title,
            url,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            inLanguage: page.lang === 'en' ? 'en-US' : 'ar-SA',
            description: page.seo?.metaDescription || page.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: page.siteName || SITE_NAME, item: homeUrl },
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
