import { describe, expect, it } from 'vitest';
import {
    calculateInstallConversion,
    normalizeAnonymousAnalyticsId,
} from '../app/statisticsPolicy';

describe('privacy-preserving installation statistics', () => {
    it('accepts random UUID identifiers and rejects personal or malformed values', () => {
        expect(normalizeAnonymousAnalyticsId('550e8400-e29b-41d4-a716-446655440000'))
            .toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(normalizeAnonymousAnalyticsId('person@example.com')).toBe('');
        expect(normalizeAnonymousAnalyticsId('../owner-admin')).toBe('');
    });

    it('calculates a bounded install conversion percentage', () => {
        expect(calculateInstallConversion(25, 100)).toBe(25);
        expect(calculateInstallConversion(4, 0)).toBe(0);
        expect(calculateInstallConversion(120, 100)).toBe(100);
    });
});
