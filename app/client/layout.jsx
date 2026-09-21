import { noIndexMetadata } from '../seoConfig';
import InternalRootLayout, { internalViewport } from '../InternalRootLayout';
import ClientLayoutShell from './ClientLayoutShell';
import './ClientPortal.css';

export const viewport = internalViewport;

export const metadata = {
    title: 'بوابة المعلنين | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function ClientLayout({ children }) {
    return <InternalRootLayout><ClientLayoutShell>{children}</ClientLayoutShell></InternalRootLayout>;
}
