import { noIndexMetadata } from '../seoConfig';

export const metadata = {
    title: 'تسجيل دخول الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLoginLayout({ children }) {
    return children;
}

