import { noIndexMetadata } from '../seoConfig';
import InternalRootLayout, { internalViewport } from '../InternalRootLayout';

export const viewport = internalViewport;

export const metadata = {
    title: 'الدعم الفني | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function SupportLayout({ children }) {
    return <InternalRootLayout>{children}</InternalRootLayout>;
}
