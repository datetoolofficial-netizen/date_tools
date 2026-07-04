'use client';

import { createContext, useContext } from 'react';

export const defaultFirebaseApi = {
    initAndTrackVisit: async () => {},
    trackToolUsage: async () => {},
    trackAdClick: async () => {},
    trackAdImpression: async () => {},
    getSiteConfig: async () => null,
};

export const SiteContext = createContext({
    lang: 'ar',
    isDarkMode: false,
    configData: null,
    isSiteLoading: true,
    firebaseApiRef: { current: defaultFirebaseApi },
});

export function useSiteContext() {
    return useContext(SiteContext);
}
