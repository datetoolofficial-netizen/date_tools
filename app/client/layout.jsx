import { noIndexMetadata } from '../seoConfig';

export const metadata = {
    title: 'بوابة المعلنين | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function ClientLayout({ children }) {
    return children;
}

