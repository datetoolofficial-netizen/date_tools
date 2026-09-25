import { ADMIN_ROLES, resolveAdminRole } from './adminAccess';

export const TOTP_FACTOR_ID = 'totp';

const MFA_PROTECTED_ROLES = new Set([
    ADMIN_ROLES.PLATFORM_OWNER,
    ADMIN_ROLES.SUPER_ADMIN,
    ADMIN_ROLES.SECURITY_MANAGER,
]);

export function isAdminMfaRequired() {
    return process.env.NEXT_PUBLIC_FIREBASE_MFA_REQUIRED === 'true';
}

export function isMfaProtectedAdmin(profile = {}) {
    return MFA_PROTECTED_ROLES.has(resolveAdminRole(profile));
}

export function hasTotpFactor(factors = []) {
    return factors.some((factor) => factor?.factorId === TOTP_FACTOR_ID);
}

export function hasTotpSecondFactorClaim(claims = {}) {
    return typeof claims?.firebase?.sign_in_second_factor === 'string'
        && claims.firebase.sign_in_second_factor.trim().length > 0;
}

export function findTotpFactor(factors = []) {
    return factors.find((factor) => factor?.factorId === TOTP_FACTOR_ID) || null;
}

export function normalizeTotpCode(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 6);
}

export function isValidTotpCode(value) {
    return /^\d{6}$/.test(String(value || '').replace(/\D/g, ''));
}

export function getMfaErrorMessage(error) {
    const code = String(error?.code || '');

    if (code === 'auth/invalid-verification-code') {
        return 'رمز تطبيق المصادقة غير صحيح أو انتهت صلاحيته.';
    }
    if (code === 'auth/code-expired') {
        return 'انتهت صلاحية الرمز. استخدم الرمز الجديد الظاهر في تطبيق المصادقة.';
    }
    if (code === 'auth/requires-recent-login') {
        return 'انتهت صلاحية جلسة التحقق. سجّل الخروج ثم ادخل مجددًا قبل تعديل المصادقة الثنائية.';
    }
    if (code === 'auth/unverified-email') {
        return 'يجب توثيق بريد الحساب أولًا قبل تفعيل المصادقة الثنائية.';
    }
    if (code === 'auth/too-many-requests') {
        return 'أُرسلت طلبات كثيرة خلال وقت قصير. انتظر قليلًا ثم أعد المحاولة.';
    }
    if (code === 'auth/operation-not-allowed' || code === 'auth/unsupported-first-factor') {
        return 'ميزة TOTP غير مفعّلة بعد في إعدادات Firebase Authentication.';
    }
    if (code === 'auth/maximum-second-factor-count-exceeded') {
        return 'وصل الحساب إلى الحد الأقصى لوسائل التحقق الإضافية.';
    }

    return 'تعذر إكمال المصادقة الثنائية. لم تُحفظ أي وسيلة جديدة.';
}
