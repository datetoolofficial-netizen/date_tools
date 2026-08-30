import { describe, expect, it } from 'vitest';
import { resolvePrivacyUiState } from '../app/privacyUiState';

describe('privacy notice visibility', () => {
    it('keeps a first-time collapsed notice reachable on every page', () => {
        expect(resolvePrivacyUiState({
            isReady: true,
            consent: null,
            isCollapsed: true,
            isSettingsOpen: false,
            isConfiguredPage: false,
            isLoading: false,
        })).toEqual({
            isPanelOpen: false,
            showPendingButton: true,
            showSettingsButton: true,
        });
    });

    it('limits the settings button to configured pages after consent', () => {
        const consent = { necessary: true, analytics: true, marketing: false };
        expect(resolvePrivacyUiState({
            isReady: true,
            consent,
            isCollapsed: false,
            isSettingsOpen: false,
            isConfiguredPage: false,
            isLoading: false,
        }).showSettingsButton).toBe(false);
        expect(resolvePrivacyUiState({
            isReady: true,
            consent,
            isCollapsed: false,
            isSettingsOpen: false,
            isConfiguredPage: true,
            isLoading: false,
        }).showSettingsButton).toBe(true);
    });

    it('closes reviewed settings without reverting to pending consent', () => {
        const consent = { necessary: true, analytics: true, marketing: true };
        const open = resolvePrivacyUiState({
            isReady: true,
            consent,
            isCollapsed: false,
            isSettingsOpen: true,
            isConfiguredPage: true,
            isLoading: false,
        });
        const closed = resolvePrivacyUiState({
            isReady: true,
            consent,
            isCollapsed: false,
            isSettingsOpen: false,
            isConfiguredPage: false,
            isLoading: false,
        });

        expect(open.isPanelOpen).toBe(true);
        expect(open.showPendingButton).toBe(false);
        expect(closed).toEqual({
            isPanelOpen: false,
            showPendingButton: false,
            showSettingsButton: false,
        });
    });
});
