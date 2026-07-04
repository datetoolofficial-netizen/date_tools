import { Cairo } from 'next/font/google';
import ExternalIntegrations from './components/ExternalIntegrations';
import { i18n } from './i18n';
import SiteShell from './SiteShell';
import './globals.css';

const siteUrl = 'https://date-tool.com';
const meta = i18n.ar;
const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    weight: ['400', '600', '700', '800'],
    display: 'swap',
});

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: meta.pageTitle,
    description: meta.pageDescription,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: meta.pageTitle,
        description: meta.pageDescription,
        url: siteUrl,
        siteName: meta.pageTitle,
        locale: 'ar_SA',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: meta.pageTitle,
        description: meta.pageDescription,
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/* تحميل مكتبة FontAwesome الأساسية */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </head>
            <body className={cairo.className}>
                <ExternalIntegrations />
                <SiteShell>{children}</SiteShell>
            </body>
        </html>
    );
}
