import { resolveLinkPreview } from '../linkPreview';
import { DEFAULT_SITE_DESCRIPTION, SITE_NAME } from '../seoConfig';
import { buildManagedToolJsonLd, buildManagedToolMetadata, getManagedToolPage } from '../toolSeoServer';
import { serializeJsonLd } from '../safeJsonLd';
import { buildManagedPageJsonLd } from '../pageJsonLd';
import { sanitizeHtmlServer } from '../sanitizeHtmlServer';
import { getToolSectionRouteBySlug } from '../../toolSectionRoutes';
import HomePageClient from '../HomePageClient';
import ClockPageClient from '../clock/ClockPageClient';
import WeatherPageClient from '../weather/WeatherPageClient';
import ToolPageHero from '../components/ToolPageHero';
import ToolSeoContent from '../components/ToolSeoContent';
import PageClient from './PageClient';
import { notFound } from 'next/navigation';
import { getPublicSiteConfigFromFirestore } from '../firestorePublicConfig';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://date-tool.com';

function normalizeSlug(value = '') {
    return String(value)
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

function findPageInList(pages, slug) {
    const currentSlug = normalizeSlug(slug);

    return pages.find((page) => {
        const pageSlug = normalizeSlug(
            page?.slug ||
            page?.path ||
            page?.url ||
            page?.link ||
            ''
        );

        return pageSlug === currentSlug;
    });
}

function findPageBySlug(config, slug) {
    if (!config) return null;

    const currentSlug = normalizeSlug(slug);
    const customPages = config.customPages || {};
    const pages = config.pages || {};
    const internalPage = Array.isArray(config.internalPages)
        ? findPageInList(config.internalPages, currentSlug)
        : null;

    if (!currentSlug) return null;

    if (customPages && !Array.isArray(customPages) && customPages[currentSlug]) {
        return {
            ...(internalPage || {}),
            ...customPages[currentSlug],
            slug: currentSlug,
            title: customPages[currentSlug].title || internalPage?.title,
        };
    }

    if (pages && !Array.isArray(pages) && pages[currentSlug]) {
        return {
            ...pages[currentSlug],
            slug: currentSlug,
        };
    }

    if (Array.isArray(customPages)) {
        const customPage = findPageInList(customPages, currentSlug);
        if (customPage) return customPage;
    }

    if (internalPage) return internalPage;

    if (Array.isArray(pages)) {
        return findPageInList(pages, currentSlug);
    }

    return null;
}

function getPageTitle(page) {
    return (
        page?.title ||
        page?.pageTitle ||
        page?.name ||
        page?.label ||
        'صفحة داخلية'
    );
}

function getPageDescription(page) {
    return (
        page?.description ||
        page?.seoDescription ||
        page?.summary ||
        ''
    );
}

function absoluteUrl(value = '') {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (!raw.startsWith('/') && !/^https?:\/\//i.test(raw)) return '';

    try {
        const url = new URL(raw, siteUrl);
        return /^https?:$/i.test(url.protocol) ? url.toString() : '';
    } catch {
        return '';
    }
}

async function getMetadataConfig() {
    return getPublicSiteConfigFromFirestore({ revalidate: 300 });
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug || '');
    const toolRoute = getToolSectionRouteBySlug(slug);
    if (toolRoute) return buildManagedToolMetadata(toolRoute.toolKey, toolRoute.subtoolKey);

    const canonicalPath = slug ? `/${slug}` : '/';
    const config = await getMetadataConfig();
    const page = findPageBySlug(config, slug);
    if (!page || page?.isActive === false || page?.enabled === false) {
        return {
            title: 'الصفحة غير موجودة',
            robots: {
                index: false,
                follow: false,
                nocache: true,
            },
        };
    }
    const preview = resolveLinkPreview(config);
    const pageTitle = getPageTitle(page);
    const pageDescription = getPageDescription(page);
    const siteName = preview.siteName || preview.title || config.toolDisplayName || SITE_NAME;
    const title = `${pageTitle} | ${siteName}`;
    const description = pageDescription || preview.description || config.toolSlogan || DEFAULT_SITE_DESCRIPTION;
    const imageUrl = absoluteUrl(preview.imageUrl);

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: canonicalPath,
            siteName,
            type: 'article',
            images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug || '');
    const toolRoute = getToolSectionRouteBySlug(slug);

    if (toolRoute) {
        const page = await getManagedToolPage(toolRoute.toolKey, toolRoute.subtoolKey);
        const jsonLd = buildManagedToolJsonLd(page);
        const icons = {
            date: 'fa-solid fa-calendar-days',
            clock: 'fa-solid fa-clock',
            weather: 'fa-solid fa-cloud-sun-rain',
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
                />
                <ToolPageHero
                    title={page.title}
                    description={page.description}
                    icon={icons[toolRoute.toolKey]}
                    className={`${toolRoute.toolKey}-hero`}
                    toolKey={toolRoute.toolKey}
                    subtoolKey={toolRoute.subtoolKey}
                />
                {toolRoute.toolKey === 'date' && (
                    <>
                        <HomePageClient hideHero standaloneSectionId={toolRoute.sectionId} />
                        <ToolSeoContent tool="date" subtool={toolRoute.subtoolKey} />
                    </>
                )}
                {toolRoute.toolKey === 'clock' && (
                    <>
                        <ClockPageClient hideHero standaloneSectionId={toolRoute.sectionId} />
                        <ToolSeoContent tool="clock" subtool={toolRoute.subtoolKey} />
                    </>
                )}
                {toolRoute.toolKey === 'weather' && (
                    <>
                        <WeatherPageClient hideHero standaloneSectionId={toolRoute.sectionId} />
                        <ToolSeoContent tool="weather" subtool={toolRoute.subtoolKey} />
                    </>
                )}
            </>
        );
    }

    if (slug === 'about') notFound();

    const config = await getMetadataConfig();
    const page = findPageBySlug(config, slug);
    if (!page || page?.isActive === false || page?.enabled === false) notFound();

    const pageTitle = getPageTitle(page);
    const pageDescription = getPageDescription(page);
    const siteName = config.toolDisplayName || SITE_NAME;
    const pageJsonLd = buildManagedPageJsonLd({
        slug,
        title: pageTitle,
        description: pageDescription,
        siteName,
    });
    const initialPage = {
        ...page,
        content: sanitizeHtmlServer(page?.content || ''),
        html: sanitizeHtmlServer(page?.html || ''),
        body: sanitizeHtmlServer(page?.body || ''),
        text: sanitizeHtmlServer(page?.text || ''),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }}
            />
            <PageClient
                slug={slug}
                initialPage={initialPage}
                initialConfig={{ contactEmail: config.contactEmail || '' }}
            />
        </>
    );
}
