import { noIndexMetadata } from '../seoConfig';
import './AdminLogin.css';

export const metadata = {
    title: 'تسجيل دخول الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLoginLayout({ children }) {
    return children;
}
