import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readAppFile(...parts) {
    return readFileSync(join(process.cwd(), 'app', ...parts), 'utf8');
}

describe('public tool field presentation', () => {
    it('uses one field class across date, clock, and weather tools', () => {
        const dateTools = readAppFile('components', 'home', 'HomeSections.jsx');
        const clockTools = readAppFile('clock', 'ClockPageClient.jsx');
        const weatherTools = readAppFile('weather', 'WeatherPageClient.jsx');

        expect(dateTools.match(/className="public-tool-field"/g)).toHaveLength(3);
        expect(clockTools.match(/className="public-tool-field"/g)).toHaveLength(4);
        expect(weatherTools.match(/className="public-tool-field"/g)).toHaveLength(1);
    });

    it('scopes the borderless field system to the public site shell', () => {
        const styles = readAppFile('globals.css');

        expect(styles).toContain('.public-site-root .public-tool-field');
        expect(styles).toMatch(/\.public-site-root \.public-tool-field \{[\s\S]*?border: 0 !important;/);
        expect(styles).not.toContain('.client-shell .public-tool-field');
    });

    it('does not render the removed city-provider footer row', () => {
        const footer = readAppFile('Footer.jsx');

        expect(footer).not.toContain('أسماء المدن:');
        expect(footer).not.toContain('City names:');
        expect(footer).not.toContain('OpenStreetMap');
    });
});
