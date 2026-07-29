const baseUrl = 'https://date-tool.com';

const sitemapEntries = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/clock', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/weather', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/month-names', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.4 },
];

export default function sitemap() {
    const now = new Date();

    return sitemapEntries.map(({ path, ...entry }) => ({
        url: path === '/' ? baseUrl : `${baseUrl}${path}`,
        lastModified: now,
        ...entry,
    }));
}
