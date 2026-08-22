import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function collectSourceFiles(directory) {
    return readdirSync(directory).flatMap((entry) => {
        const fullPath = join(directory, entry);
        if (statSync(fullPath).isDirectory()) return collectSourceFiles(fullPath);
        return /\.(js|jsx)$/.test(entry) ? [fullPath] : [];
    });
}

describe('admin save and upload flows', () => {
    it('do not hard-refresh admin pages after saving or uploading', () => {
        const files = collectSourceFiles(join(process.cwd(), 'app', 'admin'));
        const forbiddenReloads = /(?:router\.refresh|location\.reload|window\.location\.href|document\.location)/;

        for (const file of files) {
            expect(readFileSync(file, 'utf8'), file).not.toMatch(forbiddenReloads);
        }
    });
});
