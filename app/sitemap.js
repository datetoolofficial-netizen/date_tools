const baseUrl = 'https://date-tool.com';

export default function sitemap() {
    const now = new Date();

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
    ];
}
