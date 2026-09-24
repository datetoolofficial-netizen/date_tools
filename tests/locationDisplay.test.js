import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLocationCityLabel, getPhotonCityLabel, resolveLocationLabel } from '../app/locationDisplay';

describe('location display labels', () => {
    it('uses the city or locality returned for the coordinates', () => {
        expect(getLocationCityLabel({ city: 'لندن', principalSubdivision: 'إنجلترا' })).toBe('لندن');
        expect(getLocationCityLabel({ city: '', locality: 'الدمام' })).toBe('الدمام');
        expect(getLocationCityLabel({ localityName: ' تبوك ' })).toBe('تبوك');
    });

    it('does not treat a region or timezone as a city', () => {
        expect(getLocationCityLabel({ principalSubdivision: 'الرياض' })).toBe('');
        expect(getLocationCityLabel({ city: 'الرياض', lookupSource: 'ipGeolocation' })).toBe('');
    });

    it('extracts a city from OpenStreetMap data without using a street or region name', () => {
        expect(getPhotonCityLabel({ features: [{ properties: { name: 'شارع', city: 'تبوك' } }] })).toBe('تبوك');
        expect(getPhotonCityLabel({ features: [{ properties: { name: 'تبوك', osm_key: 'place', osm_value: 'city' } }] })).toBe('تبوك');
        expect(getPhotonCityLabel({ features: [{ properties: { name: 'منطقة تبوك', osm_key: 'boundary', osm_value: 'administrative' } }] })).toBe('');
        expect(getPhotonCityLabel({ features: {} })).toBe('');
    });
});

describe('location name lookup', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('retries a temporary failure and preserves coordinates and language', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ ok: false, status: 503 })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ city: 'لندن' }) });
        vi.stubGlobal('fetch', fetchMock);
        expect(await resolveLocationLabel(51.5072, -0.1276, 'ar')).toEqual({ label: 'لندن', source: 'bigdatacloud' });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        const url = new URL(fetchMock.mock.calls[1][0]);
        expect(url.hostname).toBe('api-bdc.net');
        expect(Object.fromEntries(url.searchParams)).toEqual({ latitude: '51.5072', longitude: '-0.1276', localityLanguage: 'ar' });
    });

    it('does not fall back to IP lookup when coordinates are invalid', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        expect(await resolveLocationLabel(undefined, undefined, 'en')).toEqual({ label: '', source: '' });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('does not retry a rate limit or invent a city when both requests fail', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 429 });
        vi.stubGlobal('fetch', fetchMock);
        expect(await resolveLocationLabel(51.5072, -0.1276, 'en')).toEqual({ label: '', source: '' });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls.filter(([url]) => url.includes('/data/reverse-geocode-client'))).toHaveLength(1);
        fetchMock.mockReset().mockRejectedValue(new TypeError('network unavailable'));
        expect(await resolveLocationLabel(51.5072, -0.1276, 'en')).toEqual({ label: '', source: '' });
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('uses the independent fallback with rounded coordinates when the first provider is blocked', async () => {
        const fetchMock = vi.fn()
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockResolvedValueOnce({ ok: true, json: async () => ({ features: [{ properties: { city: 'London' } }] }) });
        vi.stubGlobal('fetch', fetchMock);
        expect(await resolveLocationLabel(51.50723456, -0.12763456, 'en')).toEqual({ label: 'London', source: 'photon' });
        const url = new URL(fetchMock.mock.calls[2][0]);
        expect(url.hostname).toBe('photon.komoot.io');
        expect(Object.fromEntries(url.searchParams)).toEqual({ lat: '51.507', lon: '-0.128', lang: 'en', limit: '5', radius: '10' });
    });
});
