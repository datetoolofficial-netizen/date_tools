import ToolSeoContent from '../components/ToolSeoContent';
import { buildToolJsonLd, buildToolMetadata } from '../seoConfig';
import ClockPageClient from './ClockPageClient';

export const metadata = buildToolMetadata('clock');

export default function ClockPage() {
    const jsonLd = buildToolJsonLd('clock');

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClockPageClient />
            <ToolSeoContent tool="clock" />
        </>
    );
}
