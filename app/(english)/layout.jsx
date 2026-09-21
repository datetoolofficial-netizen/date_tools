import PublicRootLayout, {
    generateMetadata as generateSiteMetadata,
    viewport as publicViewport,
} from '../PublicRootLayout';

export const viewport = publicViewport;
export const generateMetadata = generateSiteMetadata;

export default function EnglishRootLayout({ children }) {
    return <PublicRootLayout lang="en">{children}</PublicRootLayout>;
}
