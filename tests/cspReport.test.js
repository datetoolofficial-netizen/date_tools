import { describe, expect, it } from 'vitest';
import { stripSensitiveUrl } from '../app/api/csp-report/cspReportUtils';

describe('CSP report URL filtering', () => {
    it('removes query strings and fragments from absolute URLs', () => {
        expect(stripSensitiveUrl('https://date-tool.com/privacy?token=sensitive#details'))
            .toBe('https://date-tool.com/privacy');
    });

    it('removes query strings and fragments from malformed report values', () => {
        expect(stripSensitiveUrl('/broken path?token=sensitive#details')).toBe('/broken path');
        expect(stripSensitiveUrl('/broken path#details?token=sensitive')).toBe('/broken path');
    });

    it('limits uncontrolled report values', () => {
        expect(stripSensitiveUrl('x'.repeat(1000))).toHaveLength(240);
    });
});
