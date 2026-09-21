import PublicRootLayout, {
    generateMetadata as generateSiteMetadata,
    viewport as publicViewport,
} from '../PublicRootLayout';

export const viewport = publicViewport;
export const generateMetadata = generateSiteMetadata;

export default function ArabicRootLayout({ children }) {
    return <PublicRootLayout lang="ar">{children}</PublicRootLayout>;
}
