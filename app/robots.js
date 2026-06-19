const baseUrl = 'https://date-tool.com';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/admin_login', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
