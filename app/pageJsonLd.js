import { SITE_URL } from './seoConfig';

const PAGE_TYPES = {
    contact: 'ContactPage',
    'about-us': 'AboutPage',
};

export function buildManagedPageJsonLd({ slug = '', title = '', description = '', siteName = '' } = {}) {
    const normalizedSlug = String(slug).replace(/^\/+|\/+$/g, '');
    const url = new URL(`/${normalizedSlug}`, SITE_URL).toString();
    const pageType = PAGE_TYPES[normalizedSlug] || 'WebPage';

    return [
        {
            '@context': 'https://schema.org',
            '@type': pageType,
            '@id': `${url}#webpage`,
            url,
            name: title,
            ...(description ? { description } : {}),
            inLanguage: 'ar-SA',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: siteName,
                    item: SITE_URL,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: title,
                    item: url,
                },
            ],
        },
    ];
}
