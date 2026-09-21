import { buildManagedToolMetadata } from '../../../toolSeoServer';
import EnglishToolPage from '../../../en/EnglishToolPage';

export async function generateMetadata() {
    return buildManagedToolMetadata('clock', '', 'en');
}

export default function EnglishClockPage() {
    return <EnglishToolPage toolKey="clock" />;
}
