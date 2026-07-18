import { Cairo } from 'next/font/google';
import ExternalIntegrations from './components/ExternalIntegrations';
import FontAwesomeLoader from './components/FontAwesomeLoader';
import { i18n } from './i18n';
import { resolveLinkPreview } from './linkPreview';
import SiteShell from './SiteShell';
import './globals.css';

const siteUrl = 'https://date-tool.com';
const firestoreSettingsUrl = 'https://firestore.googleapis.com/v1/projects/date-tool-official/databases/(default)/documents/settings/main';
const meta = i18n.ar;
const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    weight: ['400', '600', '700', '800'],
    display: 'swap',
});

function getStringField(fields = {}, key) {
    return fields?.[key]?.stringValue || '';
}

function getBooleanField(fields = {}, key, fallback = true) {
    const value = fields?.[key]?.booleanValue;
    return typeof value === 'boolean' ? value : fallback;
}

function getMapField(fields = {}, key) {
    return fields?.[key]?.mapValue?.fields || {};
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
        const fields = payload.fields || {};
        const mainSEO = getMapField(fields, 'mainSEO');
        const linkPreview = getMapField(fields, 'linkPreview');
        const externalIntegrations = getMapField(fields, 'externalIntegrations');

        return {
            toolDisplayName: getStringField(fields, 'toolDisplayName'),
            toolSlogan: getStringField(fields, 'toolSlogan'),
            logoUrl: getStringField(fields, 'logoUrl'),
            faviconUrl: getStringField(fields, 'faviconUrl'),
            mainSEO: {
                title: getStringField(mainSEO, 'title'),
                description: getStringField(mainSEO, 'description'),
            },
            linkPreview: {
                useSiteTitle: getBooleanField(linkPreview, 'useSiteTitle'),
                useSiteSlogan: getBooleanField(linkPreview, 'useSiteSlogan'),
                useLogoImage: getBooleanField(linkPreview, 'useLogoImage'),
                title: getStringField(linkPreview, 'title'),
                description: getStringField(linkPreview, 'description'),
                siteName: getStringField(linkPreview, 'siteName'),
                imageUrl: getStringField(linkPreview, 'imageUrl'),
            },
            externalIntegrations: {
                googleSiteVerification: getStringField(externalIntegrations, 'googleSiteVerification'),
                bingSiteVerification: getStringField(externalIntegrations, 'bingSiteVerification'),
            },
        };
    } catch {
        return {};
    }
}

export async function generateMetadata() {
    const config = await getMetadataConfig();
    const preview = resolveLinkPreview(config);
    const title = preview.title || meta.pageTitle;
    const description = preview.description || meta.pageDescription;
    const siteName = preview.siteName || title;
    const imageUrl = absoluteUrl(preview.imageUrl);
    const faviconUrl = absoluteUrl(config.faviconUrl) || '/favicon.ico';
    const images = imageUrl ? [{ url: imageUrl, alt: title }] : undefined;
    const googleSiteVerification = config.externalIntegrations?.googleSiteVerification || '';
    const bingSiteVerification = config.externalIntegrations?.bingSiteVerification || '';

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        applicationName: title,
        manifest: '/manifest.webmanifest',
        alternates: {
            canonical: '/',
        },
        appleWebApp: {
            capable: true,
            title,
            statusBarStyle: 'black-translucent',
        },
        formatDetection: {
            telephone: false,
        },
        openGraph: {
            title,
            description,
            url: siteUrl,
            siteName,
            locale: 'ar_SA',
            type: 'website',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
        icons: {
            icon: faviconUrl,
        },
        verification: {
            google: googleSiteVerification || undefined,
            other: bingSiteVerification ? { 'msvalidate.01': bingSiteVerification } : undefined,
        },
    };
}

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <body className={cairo.className}>
                <FontAwesomeLoader />
                <ExternalIntegrations />
                <SiteShell>{children}</SiteShell>
            </body>
        </html>
    );
}
