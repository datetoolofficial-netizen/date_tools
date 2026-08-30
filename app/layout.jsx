import { Cairo } from 'next/font/google';
import ExternalIntegrations from './components/ExternalIntegrations';
import FontAwesomeLoader from './components/FontAwesomeLoader';
import { resolveLinkPreview } from './linkPreview';
import { pickPublicSiteConfig } from './publicSiteConfig';
import { DEFAULT_SITE_DESCRIPTION, SITE_NAME, buildSiteJsonLd } from './seoConfig';
import { serializeJsonLd } from './safeJsonLd';
import SiteShell from './SiteShell';
import { getManagedSiteConfig } from './toolSeoServer';
import { APP_VERSION } from './version';
import './globals.css';

const siteUrl = 'https://date-tool.com';
const fontAwesomeHref = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
const themeBootstrapScript = `(() => {
    try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolvedTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.dataset.siteTheme = resolvedTheme;
        document.documentElement.style.colorScheme = resolvedTheme;
    } catch {}
})();`;

export const viewport = {
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
};
const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    weight: ['400', '600', '700', '800'],
    display: 'swap',
});

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
    return getManagedSiteConfig();
}

function versionedUrl(value = '') {
    if (!value) return '';
    try {
        const url = new URL(value);
        url.searchParams.set('v', APP_VERSION);
        return url.toString();
    } catch {
        return value;
    }
}

export async function generateMetadata() {
    const config = await getMetadataConfig();
    const preview = resolveLinkPreview(config);
    const title = preview.title || config.mainSEO?.title || config.toolDisplayName || SITE_NAME;
    const description = preview.description || config.mainSEO?.description || config.toolSlogan || DEFAULT_SITE_DESCRIPTION;
    const siteName = preview.siteName || title;
    const imageUrl = absoluteUrl(preview.imageUrl);
    const faviconUrl = absoluteUrl(config.faviconUrl || config.appIconUrl || config.logoUrl);
    const appIconUrl = versionedUrl(absoluteUrl(config.appIconUrl || config.logoUrl || config.faviconUrl));
    const images = imageUrl ? [{ url: imageUrl, alt: title }] : undefined;
    const googleSiteVerification = config.externalIntegrations?.googleSiteVerification || '';
    const bingSiteVerification = config.externalIntegrations?.bingSiteVerification || '';

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        applicationName: title,
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
        icons: faviconUrl ? {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: appIconUrl || faviconUrl,
        } : undefined,
        verification: {
            google: googleSiteVerification || undefined,
            other: bingSiteVerification ? { 'msvalidate.01': bingSiteVerification } : undefined,
        },
    };
}

export default async function RootLayout({ children }) {
    const siteJsonLd = buildSiteJsonLd();
    const initialSiteConfig = pickPublicSiteConfig(await getManagedSiteConfig());

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
                <link rel="manifest" href={`/manifest.webmanifest?v=${APP_VERSION}`} />
                <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
                <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
                <link rel="preload" href={fontAwesomeHref} as="style" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
                />
            </head>
            <body className={cairo.className}>
                <FontAwesomeLoader />
                <ExternalIntegrations />
                <SiteShell initialConfig={initialSiteConfig}>{children}</SiteShell>
            </body>
        </html>
    );
}
