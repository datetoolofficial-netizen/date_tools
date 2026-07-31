import AdminShell from './AdminShell';
import { noIndexMetadata } from '../seoConfig';

export const metadata = {
    title: 'بوابة الإدارة | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function AdminLayout({ children }) {
    return <AdminShell>{children}</AdminShell>;
}
