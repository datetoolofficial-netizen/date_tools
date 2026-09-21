import AdminShell from './AdminShell';
import { noIndexMetadata } from '../seoConfig';
import InternalRootLayout, { internalViewport } from '../InternalRootLayout';
import './AdminDashboard.css';

export const viewport = internalViewport;

export const metadata = {
    title: 'بوابة الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLayout({ children }) {
    return <InternalRootLayout><AdminShell>{children}</AdminShell></InternalRootLayout>;
}
