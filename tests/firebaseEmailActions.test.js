import { describe, expect, it } from 'vitest';
import {
    getSafeEmailActionContinueUrl,
    normalizeEmailActionMode,
} from '../app/firebaseEmailActions';

describe('Firebase email action links', () => {
    it('accepts only supported Firebase email action modes', () => {
        expect(normalizeEmailActionMode('verifyEmail')).toBe('verifyEmail');
        expect(normalizeEmailActionMode('resetPassword')).toBe('resetPassword');
        expect(normalizeEmailActionMode('recoverEmail')).toBe('recoverEmail');
        expect(normalizeEmailActionMode('signIn')).toBe('');
    });

    it('keeps continuation URLs on the current origin', () => {
        expect(getSafeEmailActionContinueUrl('/admin/security', 'https://date-tool.com'))
            .toBe('https://date-tool.com/admin/security');
        expect(getSafeEmailActionContinueUrl('https://date-tool.com/client', 'https://date-tool.com'))
            .toBe('https://date-tool.com/client');
        expect(getSafeEmailActionContinueUrl('https://evil.example/steal', 'https://date-tool.com'))
            .toBe('');
        expect(getSafeEmailActionContinueUrl('not a url', '')).toBe('');
    });
});
