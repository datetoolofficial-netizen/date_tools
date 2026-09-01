import HomePageClient from '../HomePageClient';
import ClockPageClient from '../clock/ClockPageClient';
import WeatherPageClient from '../weather/WeatherPageClient';
import ToolPageHero from '../components/ToolPageHero';
import ToolSeoContent from '../components/ToolSeoContent';
import { buildManagedToolJsonLd, getManagedToolPage } from '../toolSeoServer';
import { serializeJsonLd } from '../safeJsonLd';

const TOOL_ICONS = {
    date: 'fa-solid fa-calendar-days',
    clock: 'fa-solid fa-clock',
    weather: 'fa-solid fa-cloud-sun-rain',
};

function EnglishToolBody({ toolKey, subtoolKey, sectionId }) {
    if (toolKey === 'date') {
        return subtoolKey ? (
            <>
                <HomePageClient hideHero standaloneSectionId={sectionId} />
                <ToolSeoContent tool="date" subtool={subtoolKey} />
            </>
        ) : (
            <HomePageClient hideHero>
                <ToolSeoContent tool="date" />
            </HomePageClient>
        );
    }

    if (toolKey === 'clock') {
        return subtoolKey ? (
            <>
                <ClockPageClient hideHero standaloneSectionId={sectionId} />
                <ToolSeoContent tool="clock" subtool={subtoolKey} />
            </>
        ) : (
            <ClockPageClient hideHero>
                <ToolSeoContent tool="clock" />
            </ClockPageClient>
        );
    }

    return subtoolKey ? (
        <>
            <WeatherPageClient hideHero standaloneSectionId={sectionId} />
            <ToolSeoContent tool="weather" subtool={subtoolKey} />
        </>
    ) : (
        <WeatherPageClient hideHero>
            <ToolSeoContent tool="weather" />
        </WeatherPageClient>
    );
}

export default async function EnglishToolPage({ toolKey, subtoolKey = '', sectionId = '' }) {
    const page = await getManagedToolPage(toolKey, subtoolKey, 'en');
    const jsonLd = buildManagedToolJsonLd(page, page.settings.faqs);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <ToolPageHero
                title={page.title}
                description={page.description}
                icon={TOOL_ICONS[toolKey]}
                className={`${toolKey}-hero`}
                toolKey={toolKey}
                subtoolKey={subtoolKey}
            />
            <EnglishToolBody toolKey={toolKey} subtoolKey={subtoolKey} sectionId={sectionId} />
        </>
    );
}
