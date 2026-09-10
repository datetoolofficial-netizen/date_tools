import { noIndexMetadata } from '../seoConfig';
import ClientLayoutShell from './ClientLayoutShell';
import './ClientPortal.css';

export const metadata = {
    title: 'بوابة المعلنين | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function ClientLayout({ children }) {
    return <ClientLayoutShell>{children}</ClientLayoutShell>;
}
