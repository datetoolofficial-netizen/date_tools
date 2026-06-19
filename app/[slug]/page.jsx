import PageClient from './PageClient';

export const dynamic = 'force-dynamic';

function normalizeSlug(value = '') {
    return String(value)
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug || '');
    const canonicalPath = slug ? `/${slug}` : '/';

    return {
        title: 'صفحة داخلية | أدوات التاريخ الشاملة',
        description: 'صفحة داخلية من موقع أدوات التاريخ الشاملة.',
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: 'صفحة داخلية | أدوات التاريخ الشاملة',
            description: 'صفحة داخلية من موقع أدوات التاريخ الشاملة.',
            url: canonicalPath,
            type: 'article',
        },
    };
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug || '');

    return <PageClient slug={slug} />;
}
