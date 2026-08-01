import HomePageClient from './HomePageClient';
import ToolSeoContent from './components/ToolSeoContent';
import { buildToolJsonLd } from './seoConfig';

export default function Home() {
    const dateJsonLd = buildToolJsonLd('date');

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(dateJsonLd) }}
            />
            <HomePageClient>
                <ToolSeoContent tool="date" />
            </HomePageClient>
        </>
    );
}
