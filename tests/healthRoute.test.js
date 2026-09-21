import { describe, expect, it } from 'vitest';
import { GET } from '../app/api/health/route';
import { APP_VERSION } from '../app/version';

describe('health endpoint', () => {
    it('returns a minimal uncached liveness response without internal details', async () => {
        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(response.headers.get('cache-control')).toContain('no-store');
        expect(body).toMatchObject({
            status: 'ok',
            service: 'date-tools-web',
            version: APP_VERSION,
        });
        expect(Number.isNaN(Date.parse(body.checkedAt))).toBe(false);
        expect(body).not.toHaveProperty('environment');
        expect(body).not.toHaveProperty('bindings');
        expect(body).not.toHaveProperty('secrets');
    });
});
