import { resolveLinkPreview } from '../linkPreview';
import { DEFAULT_SITE_DESCRIPTION, SITE_NAME } from '../seoConfig';
import PageClient from './PageClient';
import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://date-tool.com';
const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';

function normalizeSlug(value = '') {
    return String(value)
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

function decodeFirestoreValue(value) {
    if (!value || typeof value !== 'object') return undefined;
    if ('stringValue' in value) return value.stringValue || '';
    if ('booleanValue' in value) return Boolean(value.booleanValue);
    if ('integerValue' in value) return Number(value.integerValue || 0);
    if ('doubleValue' in value) return Number(value.doubleValue || 0);
    if ('arrayValue' in value) {
        return (value.arrayValue.values || []).map(decodeFirestoreValue);
    }
    if ('mapValue' in value) {
        return decodeFirestoreFields(value.mapValue.fields || {});
    }
    return undefined;
}

function decodeFirestoreFields(fields = {}) {
    return Object.entries(fields).reduce((result, [key, value]) => {
        result[key] = decodeFirestoreValue(value);
        return result;
    }, {});
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
    try {
        const response = await fetch(firestoreSettingsUrl, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) return {};

        const payload = await response.json();
        return decodeFirestoreFields(payload.fields || {});
    } catch {
        return {};
    }
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const slug = normalizeSlug(resolvedParams?.slug || '');
    const canonicalPath = slug === 'about' ? '/about-us' : (slug ? `/${slug}` : '/');
    const config = await getMetadataConfig();
    const page = findPageBySlug(config, slug);
    const preview = resolveLinkPreview(config);
    const pageTitle = page ? getPageTitle(page) : 'صفحة داخلية';
    const pageDescription = page ? getPageDescription(page) : '';
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

    if (slug === 'about') permanentRedirect('/about-us');

    return <PageClient slug={slug} />;
}
