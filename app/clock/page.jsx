import ToolFaqSection from '../components/ToolFaqSection';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildToolJsonLd, buildToolMetadata, publicToolSeo } from '../seoConfig';
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
            <ToolFaqSection items={publicToolSeo.clock.faq} />
        </>
    );
}
