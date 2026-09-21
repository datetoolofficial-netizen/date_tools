import { Cairo } from 'next/font/google';
import FontAwesomeLoader from './components/FontAwesomeLoader';
import './globals.css';

const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    weight: ['400', '600', '700', '800'],
    display: 'swap',
});

export const internalViewport = {
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
};

export default function InternalRootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={cairo.className}>
                <FontAwesomeLoader />
                {children}
            </body>
        </html>
    );
}
