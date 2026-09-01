import { buildManagedToolMetadata } from '../../toolSeoServer';
import EnglishToolPage from '../EnglishToolPage';

export async function generateMetadata() {
    return buildManagedToolMetadata('clock', '', 'en');
}

export default function EnglishClockPage() {
    return <EnglishToolPage toolKey="clock" />;
}
