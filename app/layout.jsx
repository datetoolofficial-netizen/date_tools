import './globals.css';

const siteUrl = 'https://date-tool.com';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: 'أدوات التاريخ الشاملة',
    description: 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'أدوات التاريخ الشاملة',
        description: 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة',
        url: siteUrl,
        siteName: 'أدوات التاريخ الشاملة',
        locale: 'ar_SA',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'أدوات التاريخ الشاملة',
        description: 'أداة شاملة لحساب العمر وتحويل التواريخ بدقة',
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/* استدعاء خطوط Google ومكتبة FontAwesome الأساسية */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
