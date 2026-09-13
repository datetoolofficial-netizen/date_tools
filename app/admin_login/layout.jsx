import { noIndexMetadata } from '../seoConfig';
import './AdminLogin.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'تسجيل دخول الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLoginLayout({ children }) {
    return children;
}
