import PageClient from './PageClient';

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';

    return <PageClient slug={slug} />;
}