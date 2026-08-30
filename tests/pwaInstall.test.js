import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('PWA install identity', () => {
    it('prioritizes the app icon for iOS home-screen shortcuts', () => {
        const layout = readFileSync(join(process.cwd(), 'app', 'layout.jsx'), 'utf8');
        const shell = readFileSync(join(process.cwd(), 'app', 'SiteShell.jsx'), 'utf8');

        expect(layout).toContain('config.appIconUrl || config.logoUrl || config.faviconUrl');
        expect(layout).toContain('apple: appIconUrl || faviconUrl');
        expect(shell).toContain("link[rel='apple-touch-icon']");
        expect(shell).toContain("versionedIcon.searchParams.set('v', APP_VERSION)");
    });

    it('does not let a legacy decision permanently hide install help in a browser tab', () => {
        const prompt = readFileSync(join(process.cwd(), 'app', 'components', 'PwaInstallPrompt.jsx'), 'utf8');

        expect(prompt).toContain('localStorage.removeItem(COMPLETED_KEY)');
        expect(prompt).toContain('PROMPT_STATE_VERSION_KEY');
        expect(prompt).toContain('localStorage.removeItem(COLLAPSED_KEY)');
        expect(prompt).not.toContain("const hasDecided = localStorage.getItem(COMPLETED_KEY) === 'true'");
        expect(prompt).toContain("setView(wasCollapsed ? 'compact' : 'full')");
        expect(prompt).toContain('(display-mode: standalone)');
    });
});
