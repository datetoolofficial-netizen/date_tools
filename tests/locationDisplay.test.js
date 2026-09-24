import { describe, expect, it } from 'vitest';
import { getLocationCityLabel } from '../app/locationDisplay';

describe('location display labels', () => {
    it('uses a city only when coordinates are sufficiently accurate', () => {
        expect(getLocationCityLabel({ city: 'لندن', principalSubdivision: 'إنجلترا' }, 50)).toBe('لندن');
        expect(getLocationCityLabel({ city: 'الرياض' }, 50000)).toBe('');
    });

    it('does not treat a region or timezone as a city', () => {
        expect(getLocationCityLabel({ principalSubdivision: 'الرياض' }, 50)).toBe('');
        expect(getLocationCityLabel({ city: 'الرياض', lookupSource: 'ipGeolocation' }, 50)).toBe('');
    });
});
