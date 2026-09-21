import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const weatherSource = readFileSync('app/weather/WeatherPageClient.jsx', 'utf8');

describe('weather default location', () => {
    it('uses the visitor location instead of a fixed default city', () => {
        expect(weatherSource).toContain("const [query, setQuery] = useState('');");
        expect(weatherSource).toContain('const location = currentLocation || await requestCurrentLocation();');
        expect(weatherSource).toContain('await loadWeatherByLocation(location);');
        expect(weatherSource).not.toContain("await loadWeather('Riyadh');");
    });

    it('keeps manual city search available when location access fails', () => {
        expect(weatherSource).toContain('setError(labels.locationError);');
        expect(weatherSource).toContain('setIsLoading(false);');
        expect(weatherSource).toContain('onSubmit={(event) => {');
        expect(weatherSource).toContain('loadWeather();');
    });
});
