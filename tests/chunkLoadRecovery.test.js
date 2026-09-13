import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
    clearChunkRecoveryMarker,
    getChunkRecoveryUrl,
    isChunkLoadError,
    recoverFromChunkLoadError,
} from '../app/chunkLoadRecovery';
import { APP_VERSION } from '../app/version';

function makeBrowserWindow(href) {
    return {
        location: {
            href,
            replace: vi.fn(),
        },
        history: {
            state: { navigation: 'test' },
            replaceState: vi.fn(),
        },
    };
}

describe('Next.js chunk load recovery', () => {
    it('keeps the admin login document out of shared HTML caches', () => {
        const layout = readFileSync(join(process.cwd(), 'app', 'admin_login', 'layout.jsx'), 'utf8');
        expect(layout).toContain("export const dynamic = 'force-dynamic'");
        expect(layout).toContain('export const revalidate = 0');
    });

    it('recognizes browser and webpack chunk loading failures', () => {
        expect(isChunkLoadError(new Error('Loading chunk 2825 failed.'))).toBe(true);
        expect(isChunkLoadError({ name: 'ChunkLoadError', message: 'request failed' })).toBe(true);
        expect(isChunkLoadError(new Error('Invalid credentials'))).toBe(false);
    });

    it('adds one versioned retry marker while preserving existing parameters', () => {
        const recoveryUrl = getChunkRecoveryUrl('https://date-tool.com/admin_login?source=admin', '0.3.57');
        expect(recoveryUrl).toBe('https://date-tool.com/admin_login?source=admin&chunk-retry=0.3.57');
        expect(getChunkRecoveryUrl(recoveryUrl, '0.3.57')).toBeNull();
    });

    it('replaces the page once and refuses a retry loop for the same release', () => {
        const firstWindow = makeBrowserWindow('https://date-tool.com/admin_login');
        expect(recoverFromChunkLoadError(new Error('Loading chunk 2825 failed.'), firstWindow)).toBe(true);
        expect(firstWindow.location.replace).toHaveBeenCalledWith(
            `https://date-tool.com/admin_login?chunk-retry=${APP_VERSION}`,
        );

        const retryWindow = makeBrowserWindow(`https://date-tool.com/admin_login?chunk-retry=${APP_VERSION}`);
        expect(recoverFromChunkLoadError(new Error('Loading chunk 2825 failed.'), retryWindow)).toBe(false);
        expect(retryWindow.location.replace).not.toHaveBeenCalled();
    });

    it('removes the retry marker after the current chunks load successfully', () => {
        const browserWindow = makeBrowserWindow(`https://date-tool.com/admin_login?source=admin&chunk-retry=${APP_VERSION}`);
        clearChunkRecoveryMarker(browserWindow);

        expect(browserWindow.history.replaceState).toHaveBeenCalledWith(
            browserWindow.history.state,
            '',
            'https://date-tool.com/admin_login?source=admin',
        );
    });
});
