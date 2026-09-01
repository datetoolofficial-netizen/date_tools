import { notFound } from 'next/navigation';
import { buildManagedToolMetadata } from '../../toolSeoServer';
import { getToolSectionRouteBySlug } from '../../../toolSectionRoutes';
import EnglishToolPage from '../EnglishToolPage';

export const dynamic = 'force-dynamic';

function normalizeSlug(value = '') {
    return String(value).trim().replace(/^\/+|\/+$/g, '');
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const route = getToolSectionRouteBySlug(normalizeSlug(resolvedParams?.slug));
    if (!route) {
        return {
            title: 'Page not found',
            robots: { index: false, follow: false },
        };
    }

    return buildManagedToolMetadata(route.toolKey, route.subtoolKey, 'en');
}

export default async function EnglishStandaloneToolPage({ params }) {
    const resolvedParams = await params;
    const route = getToolSectionRouteBySlug(normalizeSlug(resolvedParams?.slug));
    if (!route) notFound();

    return (
        <EnglishToolPage
            toolKey={route.toolKey}
            subtoolKey={route.subtoolKey}
            sectionId={route.sectionId}
        />
    );
}
