import { initializeApp, getApps, getApp } from "firebase/app";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider
} from "firebase/app-check";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { sanitizeHtml } from "./sanitizeHtml";

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
    hasLogo: false,
    logoUrl: "",
    faviconUrl: "",
    adImages: {
        top: "",
        middle: "",
        bottom1: "",
        bottom2: ""
    },
    adCampaigns: [],
    copyrightName: "",
    copyrightText: "جميع الحقوق محفوظة",
    internalPages: [],
    socialLinks: [],
    externalLinks: [],
    events: [],
    pages: {},
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
            adCampaigns: Array.isArray(data.adCampaigns) ? data.adCampaigns : [],

            adImages: {
                ...defaultSiteConfig.adImages,
                ...(data.adImages || {})
            },

            pages: data.pages || {},
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
        adCampaigns: Array.isArray(config.adCampaigns) ? config.adCampaigns : [],

        adImages: {
            ...defaultSiteConfig.adImages,
            ...(config.adImages || {})
        },

        pages: config.pages || {},
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
    const cleanPatch = { ...sectionPatch, hasError: false };

    if ('events' in cleanPatch && !Array.isArray(cleanPatch.events)) cleanPatch.events = [];
    if ('externalLinks' in cleanPatch && !Array.isArray(cleanPatch.externalLinks)) cleanPatch.externalLinks = [];
    if ('internalPages' in cleanPatch && !Array.isArray(cleanPatch.internalPages)) cleanPatch.internalPages = [];
    if ('socialLinks' in cleanPatch && !Array.isArray(cleanPatch.socialLinks)) cleanPatch.socialLinks = [];
    if ('adCampaigns' in cleanPatch && !Array.isArray(cleanPatch.adCampaigns)) cleanPatch.adCampaigns = [];

    if ('adImages' in cleanPatch) {
        cleanPatch.adImages = {
            ...defaultSiteConfig.adImages,
            ...(cleanPatch.adImages || {})
        };
    }

    if ('customPages' in cleanPatch) {
        cleanPatch.customPages = Object.fromEntries(
            Object.entries(cleanPatch.customPages || {}).map(([slug, page]) => [
                slug,
                {
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
                adClicks: 0
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
            adClicks: 0
        };
    }
}
