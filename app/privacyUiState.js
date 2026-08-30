export function resolvePrivacyUiState({
    isReady,
    consent,
    isCollapsed,
    isSettingsOpen,
    isConfiguredPage,
    isLoading,
}) {
    const hasConsent = consent !== null;
    const showPendingButton = Boolean(isReady && !hasConsent && isCollapsed);
    const showConfiguredButton = Boolean(hasConsent && !isSettingsOpen && isConfiguredPage);

    return {
        isPanelOpen: Boolean(
            isReady
            && ((!hasConsent && !isCollapsed) || (hasConsent && isSettingsOpen))
        ),
        showPendingButton,
        showSettingsButton: Boolean(!isLoading && (showPendingButton || showConfiguredButton)),
    };
}
