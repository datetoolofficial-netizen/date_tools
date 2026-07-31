import { noIndexMetadata } from '../seoConfig';

export const metadata = {
    title: 'الدعم الفني | الأدوات الشاملة',
    ...noIndexMetadata,
};

export default function SupportLayout({ children }) {
    return children;
}

