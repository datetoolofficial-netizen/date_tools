import { describe, expect, it } from 'vitest';
import { getPwaConnectionMessage, PWA_RUNTIME_MODE } from '../app/pwaRuntimePolicy';

describe('PWA runtime policy', () => {
    it('declares the installed experience as online-only', () => {
        expect(PWA_RUNTIME_MODE).toBe('online-only');
        expect(getPwaConnectionMessage('ar')).toContain('اتصال بالإنترنت');
        expect(getPwaConnectionMessage('en')).toContain('internet connection');
    });
});
