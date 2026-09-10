import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function readProjectFile(...segments) {
    return readFileSync(join(process.cwd(), ...segments), 'utf8');
}

describe('HTTP security boundaries', () => {
    it('keeps the core browser security headers and internal noindex policy enabled', () => {
        const middleware = readProjectFile('middleware.js');

        expect(middleware).toContain("['X-Content-Type-Options', 'nosniff']");
        expect(middleware).toContain("['X-Frame-Options', 'DENY']");
        expect(middleware).toContain("['Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload']");
        expect(middleware).toContain("response.headers.set('Content-Language'");
        expect(middleware).toContain("['Referrer-Policy', 'strict-origin-when-cross-origin']");
        expect(middleware).toContain("response.headers.set('Content-Security-Policy-Report-Only'");
        expect(middleware).toContain("response.headers.set('Content-Security-Policy'");
        expect(middleware).toContain("response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')");
        expect(middleware).toContain("'/admin'");
        expect(middleware).toContain("'/client'");
        expect(middleware).toContain("'/api'");
        expect(middleware).toContain("pathname === '/index.html'");
        expect(middleware).toContain("'/after-14-days.html'");
        expect(middleware).toContain("'/ad_request.html'");
        expect(middleware).toContain('AUTOMATED_PROBE_PATH_PATTERN.test(pathname)');
        expect(middleware).toContain('https://static.cloudflareinsights.com');
        expect(middleware).toContain('https://apis.google.com');
        expect(middleware).toContain('https://date-tool-official.firebaseapp.com');
        expect(middleware).toContain('https://www.googletagmanager.com');
    });

    it('authenticates server-side public Firestore reads when service credentials are available', () => {
        const publicConfigReader = readProjectFile('app', 'firestorePublicConfig.js');
        const serverAuth = readProjectFile('app', 'serverFirestoreAuth.js');

        expect(publicConfigReader).toContain('getFirestoreServerAuthorization');
        expect(publicConfigReader).toContain('{ Authorization: authorization }');
        expect(serverAuth).toContain("TOKEN_SCOPE = 'https://www.googleapis.com/auth/datastore'");
        expect(serverAuth).toContain("crypto.subtle.sign(");
        expect(serverAuth).not.toMatch(/privateKey:\s*['\"][^-]/);
    });

    it('does not expose support attachments through the public media categories', () => {
        const mediaValidation = readProjectFile('app', 'api', '_lib', 'mediaValidation.js');
        const publicMediaRoute = readProjectFile('app', 'api', 'media', '[...key]', 'route.js');
        const adminSupportRoute = readProjectFile('app', 'api', 'admin', 'support', 'route.js');

        expect(mediaValidation).not.toMatch(/^\s*['"]support['"],?\s*$/m);
        expect(publicMediaRoute).toContain('getSafeMediaCategory(category)');
        expect(adminSupportRoute).toContain('ADMIN_PERMISSIONS.SUPPORT_READ');
        expect(adminSupportRoute).toContain('ADMIN_PERMISSIONS.SUPPORT_DELETE');
        expect(adminSupportRoute).toContain("attachmentKey.startsWith('support/')");
        expect(adminSupportRoute).toContain("'Cache-Control': 'private, no-store, max-age=0'");
    });

    it('keeps media uploads authenticated and validates file contents before R2 writes', () => {
        const uploadRoute = readProjectFile('app', 'api', 'media', 'upload', 'route.js');

        expect(uploadRoute).toContain('verifyFirebaseIdToken');
        expect(uploadRoute).toContain('hasExpectedImageSignature');
        expect(uploadRoute).toContain('MAX_IMAGE_BYTES');
        expect(uploadRoute).toContain('crypto.randomUUID()');
        expect(uploadRoute).toContain("return jsonResponse({ ok: false, error: 'unsupported_image_type' }, 400)");
    });

    it('keeps advertiser demo data local to the development host', () => {
        const localDemo = readProjectFile('app', 'client', 'localAdvertiserDemo.js');

        expect(localDemo).toContain("process.env.NODE_ENV !== 'development'");
        expect(localDemo).toContain("window.location.hostname === 'localhost'");
        expect(localDemo).toContain("window.location.hostname === '127.0.0.1'");
        expect(localDemo).not.toContain("import('../firebase')");
        expect(localDemo).not.toContain("import('../../firebase')");
    });

    it('enforces advertiser organizations and roles in Firestore rules', () => {
        const rules = readProjectFile('firestore.rules');

        expect(rules).toContain('function hasAdvertiserPermission(permission)');
        expect(rules).toContain('advertiserRole() == "campaign_manager"');
        expect(rules).toContain('advertiserRole() == "organization_admin"');
        expect(rules).toContain('advertiserRole() == "campaign_editor"');
        expect(rules).toContain('advertiserRole() == "analyst"');
        expect(rules).toContain('request.resource.data.get("organizationId", userId) == userId');
        expect(rules).toContain('request.resource.data.organizationNumber.matches(\'^[0-9]{12}$\')');
        expect(rules).toContain('request.resource.data.get("advertiserOrganizationId", request.auth.uid) == advertiserOrganizationId()');
        expect(rules).toContain('hasAdvertiserPermission("team.manage")');
        expect(rules).toContain('resource.data.get("organizationId", userId) == advertiserOrganizationId()');
    });

    it('provides an admin route for advertiser role and status management', () => {
        const shell = readProjectFile('app', 'admin', 'AdminShell.jsx');
        const page = readProjectFile('app', 'admin', 'advertisers', 'page.jsx');
        const accountsRoute = readProjectFile('app', 'admin', 'accounts', 'page.jsx');

        expect(shell).toContain("href: '/admin/accounts'");
        expect(shell).toContain("label: 'الحسابات'");
        expect(shell).toContain('permission: ADMIN_PERMISSIONS.ADVERTISERS_READ');
        expect(shell).toContain("currentPath === '/admin/advertisers'");
        expect(accountsRoute).toContain("../advertisers/page");
        expect(page).toContain("collection(db, 'advertisers')");
        expect(page).toContain('listLocalAdvertiserAccounts');
        expect(page).toContain("role: draft.role");
        expect(page).toContain("status: draft.status");
        expect(page).toContain('tools-item-actions admin-account-actions');
        expect(page).toContain('title="تعديل الحساب"');
        expect(page).toContain('legacy-modal-backdrop');
        expect(page).toContain('admin-account-edit-modal');
        expect(page).toContain('aria-labelledby="account-edit-modal-title"');
        expect(page).toContain('حفظ التعديل');
        expect(page).toContain('إضافة حساب معلن');
        expect(page).toContain('createLocalAdvertiserAccount');
        expect(page).toContain("import('firebase/app')");
        expect(page).toContain('sendPasswordResetEmail');
        expect(page).toContain('رقم المنظمة الموحد');
    });

    it('loads platform styles from route layouts and keeps the public body neutral', () => {
        const rootStyles = readProjectFile('app', 'globals.css');
        const siteShell = readProjectFile('app', 'SiteShell.jsx');
        const adminLayout = readProjectFile('app', 'admin', 'layout.jsx');
        const clientLayout = readProjectFile('app', 'client', 'layout.jsx');
        const adminLoginLayout = readProjectFile('app', 'admin_login', 'layout.jsx');
        const adminLoginStyles = readProjectFile('app', 'admin_login', 'AdminLogin.css');

        expect(adminLayout).toContain("import './AdminDashboard.css'");
        expect(clientLayout).toContain("import './ClientPortal.css'");
        expect(adminLoginLayout).toContain("import './AdminLogin.css'");
        expect(rootStyles).toMatch(/body\s*\{[^}]*padding:\s*0;/s);
        expect(rootStyles).toContain('.public-site-root');
        expect(siteShell).toContain('className="public-site-root"');
        expect(siteShell).toContain('if (!shouldUseShell) return undefined;');
        expect(adminLoginStyles).toContain('.login-page-wrapper .login-container');
        expect(existsSync(join(process.cwd(), 'app', 'admin', 'AdminPage.css'))).toBe(false);
    });

    it('keeps protected advertiser pages inside one persistent client shell', () => {
        const layout = readProjectFile('app', 'client', 'layout.jsx');
        const layoutShell = readProjectFile('app', 'client', 'ClientLayoutShell.jsx');
        const clientShell = readProjectFile('app', 'client', 'ClientShell.jsx');
        const clientStyles = readProjectFile('app', 'client', 'ClientPortal.css');
        const dashboard = readProjectFile('app', 'client', 'dashboard', 'page.jsx');
        const campaign = readProjectFile('app', 'client', 'create-campaign', 'page.jsx');

        expect(layout).toContain('<ClientLayoutShell>{children}</ClientLayoutShell>');
        expect(layoutShell).toContain("'/client/register'");
        expect(layoutShell).toContain('<ClientShell>{children}</ClientShell>');
        expect(clientShell).toContain('ClientPortalContext.Provider');
        expect(clientShell).toContain('client-footer');
        expect(clientShell).toContain('client-sidebar-collapse');
        expect(clientShell).toContain('client-page-hero');
        expect(clientShell).toContain('client-version-badge');
        expect(clientStyles).toContain('--client-sidebar-width: 260px');
        expect(clientStyles).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))');
        expect(clientStyles).toContain('border-top: 5px solid var(--client-primary)');
        expect(clientStyles).toContain('min-height: 178px');
        expect(dashboard).toContain('useClientPortal()');
        expect(dashboard).toContain('client-panel-icon');
        expect(dashboard).toContain('tone-cyan');
        expect(campaign).toContain('useClientPortal()');
        expect(dashboard).not.toContain('<ClientShell');
        expect(campaign).not.toContain('<ClientShell');
        expect(dashboard).not.toContain('onAuthStateChanged');
        expect(campaign).not.toContain('onAuthStateChanged');
    });
});
