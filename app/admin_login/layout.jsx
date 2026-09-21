import { noIndexMetadata } from '../seoConfig';
import InternalRootLayout, { internalViewport } from '../InternalRootLayout';
import './AdminLogin.css';

export const viewport = internalViewport;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'تسجيل دخول الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLoginLayout({ children }) {
    return <InternalRootLayout>{children}</InternalRootLayout>;
}
