import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('media route compatibility', () => {
    it('awaits dynamic route params before reading the media key', () => {
        const route = readFileSync(
            join(process.cwd(), 'app', 'api', 'media', '[...key]', 'route.js'),
            'utf8',
        );

        expect(route).toContain('getKey(await params)');
        expect(route).not.toContain('getKey(params);');
    });
});
