import { describe, expect, it } from 'vitest';
import { buildManagedPageJsonLd } from '../app/pageJsonLd';

describe('managed page JSON-LD', () => {
    it('uses a specific page type and stable graph identifiers', () => {
        const [page, breadcrumbs] = buildManagedPageJsonLd({
            slug: 'contact',
            title: 'اتصل بنا',
            description: 'تواصل معنا',
            siteName: 'الأدوات الشاملة',
        });

        expect(page).toMatchObject({
            '@type': 'ContactPage',
            '@id': 'https://date-tool.com/contact#webpage',
            url: 'https://date-tool.com/contact',
            isPartOf: { '@id': 'https://date-tool.com/#website' },
        });
        expect(breadcrumbs['@type']).toBe('BreadcrumbList');
        expect(breadcrumbs.itemListElement[1].item).toBe('https://date-tool.com/contact');
    });

    it('uses WebPage for ordinary managed pages', () => {
        const [page] = buildManagedPageJsonLd({
            slug: '/privacy/',
            title: 'سياسة الخصوصية',
            siteName: 'الأدوات الشاملة',
        });

        expect(page['@type']).toBe('WebPage');
        expect(page.url).toBe('https://date-tool.com/privacy');
        expect(page).not.toHaveProperty('description');
    });
});
