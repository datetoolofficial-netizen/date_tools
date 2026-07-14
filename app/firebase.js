import { initializeApp, getApps, getApp } from "firebase/app";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    deleteField
} from "firebase/firestore";

import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider
} from "firebase/app-check";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { sanitizeHtml } from "./sanitizeHtml";
import { DEFAULT_TOOL_SETTINGS, normalizeToolSettings } from "./toolSettings";
import { DEFAULT_LINK_PREVIEW, normalizeLinkPreviewSettings } from "./linkPreview";

const firebaseConfig = {
    apiKey: "AIzaSyAgdxyNBFrwJuAnoVq6OmZKZZvRknFyVQ8",
    authDomain: "date-tool-official.firebaseapp.com",
    projectId: "date-tool-official",
    storageBucket: "date-tool-official.firebasestorage.app",
    messagingSenderId: "219114793241",
    appId: "1:219114793241:web:ee933836c68f7e712fbd88",
    measurementId: "G-ZKCJC1Y7X7"
};

// منع تكرار تهيئة Firebase أثناء التطوير أو Hot Reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const defaultExternalIntegrations = {
    googleTagId: "",
    googleTagManagerId: "",
    googleAdsenseClient: "",
    googleSiteVerification: "",
    bingSiteVerification: "",
    microsoftClarityProjectId: "",
    metaPixelId: "",
    adsenseSnippet: "",
    adsTxtSnippet: ""
};

const defaultGoogleAdSlots = {
    dateTop: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    dateMiddle: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    dateBottom: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    clockTop: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    clockMiddle: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    clockBottom: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    weatherTop: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    weatherMiddle: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
    weatherBottom: {
        client: "",
        slot: "",
        format: "auto",
        fullWidthResponsive: true,
        enabledWhenNoAdvertiser: false,
        htmlSnippet: "",
        showHouseAd: false,
        houseAdText: ""
    },
};

function normalizeExternalIntegrations(value = {}) {
    return {
        googleTagId: String(value.googleTagId || "").trim(),
        googleTagManagerId: String(value.googleTagManagerId || "").trim(),
        googleAdsenseClient: String(value.googleAdsenseClient || "").trim(),
        googleSiteVerification: String(value.googleSiteVerification || "").trim(),
        bingSiteVerification: String(value.bingSiteVerification || "").trim(),
        microsoftClarityProjectId: String(value.microsoftClarityProjectId || "").trim(),
        metaPixelId: String(value.metaPixelId || "").trim(),
        adsenseSnippet: String(value.adsenseSnippet || "").slice(0, 4000),
        adsTxtSnippet: String(value.adsTxtSnippet || "").slice(0, 4000)
    };
}

function normalizeGoogleAdSlot(value = {}) {
    return {
        client: String(value.client || "").trim(),
        slot: String(value.slot || "").trim(),
        format: String(value.format || "auto").trim() || "auto",
        fullWidthResponsive: value.fullWidthResponsive !== false,
        enabledWhenNoAdvertiser: value.enabledWhenNoAdvertiser === true,
        htmlSnippet: String(value.htmlSnippet || "").slice(0, 4000),
        showHouseAd: value.showHouseAd === true,
        houseAdText: String(value.houseAdText || "").slice(0, 160)
    };
}

const legacyAdSlotAliases = {
    dateTop: ["top"],
    dateMiddle: ["middle"],
    dateBottom: ["bottom1", "bottom2"]
};

const legacyDateAdSlotKeys = ["top", "middle", "bottom1", "bottom2"];

function pickWithAliases(value = {}, key) {
    return [key, ...(legacyAdSlotAliases[key] || [])]
        .map((candidateKey) => value[candidateKey])
        .find(Boolean) || {};
}

function normalizeGoogleAdSlots(value = {}) {
    return Object.fromEntries(
        Object.keys(defaultGoogleAdSlots).map((slotId) => [
            slotId,
            normalizeGoogleAdSlot(pickWithAliases(value, slotId))
        ])
    );
}

// App Check يعمل فقط في المتصفح
if (typeof window !== "undefined") {
    try {
        initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(
                "6Ldch4ssAAAAAM0HeNiBNFlQBqXM9dUL4SNm1mxM"
            ),
            isTokenAutoRefreshEnabled: true
        });
    } catch (error) {
        console.warn("App Check already initialized or skipped:", error);
    }
}

/* =========================
   الإعدادات الافتراضية للموقع
========================= */

export const defaultSiteConfig = {
    toolDisplayName: "أدوات التاريخ الشاملة",
    toolSlogan: "احسب عمرك وحول التواريخ بدقة",
    contactEmail: "",
    hasLogo: false,
    logoUrl: "",
    faviconUrl: "",
    googleAdSlots: defaultGoogleAdSlots,
    adCampaigns: [],
    externalIntegrations: defaultExternalIntegrations,
    copyrightName: "",
    copyrightText: "جميع الحقوق محفوظة",
    internalPages: [],
    socialLinks: [],
    externalLinks: [],
    events: [],
    toolSettings: DEFAULT_TOOL_SETTINGS,
    linkPreview: DEFAULT_LINK_PREVIEW,
    customPages: {},
    mainSEO: {
        title: "أدوات التاريخ الشاملة",
        description: "أداة شاملة لحساب العمر وتحويل التواريخ بدقة"
    }
};

/* =========================
   إعدادات الموقع من Firestore
   المسار: settings/main
========================= */

export async function getSiteConfig() {
    try {
        const configRef = doc(db, "settings", "main");
        const snap = await getDoc(configRef);

        // لا ننشئ المستند هنا حتى لا يفشل الزائر العام بسبب الصلاحيات
        if (!snap.exists()) {
            return defaultSiteConfig;
        }

        const data = snap.data();

        return {
            ...defaultSiteConfig,
            ...data,

            events: Array.isArray(data.events) ? data.events : [],
            externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks : [],
            internalPages: Array.isArray(data.internalPages) ? data.internalPages : [],
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
            adCampaigns: [],
            toolSettings: normalizeToolSettings(data.toolSettings || {}),
            linkPreview: normalizeLinkPreviewSettings(data.linkPreview || {}),

            googleAdSlots: {
                ...defaultGoogleAdSlots,
                ...normalizeGoogleAdSlots(data.googleAdSlots || {})
            },

            externalIntegrations: {
                ...defaultExternalIntegrations,
                ...normalizeExternalIntegrations(data.externalIntegrations || {})
            },

            customPages: data.customPages || {},

            mainSEO: {
                ...defaultSiteConfig.mainSEO,
                ...(data.mainSEO || {})
            }
        };
    } catch (error) {
        console.error("Error fetching site config:", error);
        return defaultSiteConfig;
    }
}

export async function saveSiteConfig(config) {
    const configRef = doc(db, "settings", "main");
    const customPages = Object.fromEntries(
        Object.entries(config.customPages || {}).map(([slug, page]) => [
            slug,
            {
                ...page,
                content: sanitizeHtml(page?.content || '')
            }
        ])
    );

    const cleanConfig = {
        ...defaultSiteConfig,
        ...config,

        // لا نحفظ حالات الخطأ المؤقتة داخل Firestore
        hasError: false,

        events: Array.isArray(config.events) ? config.events : [],
        externalLinks: Array.isArray(config.externalLinks) ? config.externalLinks : [],
        internalPages: Array.isArray(config.internalPages) ? config.internalPages : [],
        socialLinks: Array.isArray(config.socialLinks) ? config.socialLinks : [],
        adCampaigns: deleteField(),
        toolSettings: normalizeToolSettings(config.toolSettings || {}),
        linkPreview: normalizeLinkPreviewSettings(config.linkPreview || {}),

        adImages: deleteField(),

        googleAdSlots: {
            ...defaultGoogleAdSlots,
            ...normalizeGoogleAdSlots(config.googleAdSlots || {}),
            ...Object.fromEntries(legacyDateAdSlotKeys.map((slotId) => [slotId, deleteField()]))
        },

        externalIntegrations: {
            ...defaultExternalIntegrations,
            ...normalizeExternalIntegrations(config.externalIntegrations || {})
        },

        pages: deleteField(),
        ['toolSlogan ']: deleteField(),
        customPages,

        mainSEO: {
            ...defaultSiteConfig.mainSEO,
            ...(config.mainSEO || {})
        }
    };

    await setDoc(configRef, cleanConfig, { merge: true });

    return cleanConfig;
}

export async function saveSiteConfigSection(sectionPatch) {
    const configRef = doc(db, "settings", "main");
    const cleanPatch = {
        ...sectionPatch,
        hasError: false,
        adCampaigns: deleteField(),
        adImages: deleteField(),
        pages: deleteField(),
        ['toolSlogan ']: deleteField()
    };

    if ('events' in cleanPatch && !Array.isArray(cleanPatch.events)) cleanPatch.events = [];
    if ('externalLinks' in cleanPatch && !Array.isArray(cleanPatch.externalLinks)) cleanPatch.externalLinks = [];
    if ('internalPages' in cleanPatch && !Array.isArray(cleanPatch.internalPages)) cleanPatch.internalPages = [];
    if ('socialLinks' in cleanPatch && !Array.isArray(cleanPatch.socialLinks)) cleanPatch.socialLinks = [];
    if ('adImages' in cleanPatch) {
        cleanPatch.adImages = deleteField();
    }

    if ('googleAdSlots' in cleanPatch) {
        cleanPatch.googleAdSlots = {
            ...defaultGoogleAdSlots,
            ...normalizeGoogleAdSlots(cleanPatch.googleAdSlots || {}),
            ...Object.fromEntries(legacyDateAdSlotKeys.map((slotId) => [slotId, deleteField()]))
        };
    }

    if ('externalIntegrations' in cleanPatch) {
        cleanPatch.externalIntegrations = {
            ...defaultExternalIntegrations,
            ...normalizeExternalIntegrations(cleanPatch.externalIntegrations || {})
        };
    }

    if ('toolSettings' in cleanPatch) {
        cleanPatch.toolSettings = normalizeToolSettings(cleanPatch.toolSettings || {});
    }

    if ('linkPreview' in cleanPatch) {
        cleanPatch.linkPreview = normalizeLinkPreviewSettings(cleanPatch.linkPreview || {});
    }

    if ('customPages' in cleanPatch) {
        cleanPatch.customPages = Object.fromEntries(
            Object.entries(cleanPatch.customPages || {}).map(([slug, page]) => [
                slug,
                page === null || page?.__delete === true
                    ? deleteField()
                    : {
                        ...page,
                        content: sanitizeHtml(page?.content || '')
                    }
            ])
        );
    }

    if ('mainSEO' in cleanPatch) {
        cleanPatch.mainSEO = {
            ...defaultSiteConfig.mainSEO,
            ...(cleanPatch.mainSEO || {})
        };
    }

    await setDoc(configRef, cleanPatch, { merge: true });

    return cleanPatch;
}

/* =========================
   صلاحيات الإدارة
   المسار: admins/{uid}
========================= */

export async function getAdminProfile(uid) {
    try {
        if (!uid) return null;

        const adminRef = doc(db, "admins", uid);
        const snap = await getDoc(adminRef);

        if (!snap.exists()) {
            return null;
        }

        return {
            id: snap.id,
            ...snap.data()
        };
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return null;
    }
}

/* =========================
   الإحصائيات
   المسار: statistics/main
========================= */

export async function initAndTrackVisit() {
    return sendStatisticEvent({ event: "visit" });
}

export async function trackToolUsage(toolName) {
    return sendStatisticEvent({ event: "tool", toolName });
}

export async function trackAdClick(adId) {
    return sendStatisticEvent({ event: "adClick", adId });
}

export async function trackAdImpression(adId) {
    return sendStatisticEvent({ event: "adImpression", adId });
}

async function sendStatisticEvent(payload) {
    if (typeof window === "undefined") return null;

    try {
        await fetch("/api/statistics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            keepalive: true,
        });
    } catch (error) {
        // الإحصائيات لا يجب أن تكسر تجربة الزائر إذا تعذر تسجيل الحدث.
    }

    return null;
}

export async function getAdminStats() {
    try {
        const statsRef = doc(db, "statistics", "main");
        const snap = await getDoc(statsRef);

        if (!snap.exists()) {
            return {
                visits: 0,
                ageCalc: 0,
                dateConverter: 0,
                durationCalc: 0,
                adClicks: 0,
                adImpressions: 0
            };
        }

        return snap.data();
    } catch (error) {
        console.error("Error fetching stats:", error);

        return {
            visits: 0,
            ageCalc: 0,
            dateConverter: 0,
            durationCalc: 0,
            adClicks: 0,
            adImpressions: 0
        };
    }
}
