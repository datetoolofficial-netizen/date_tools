'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import {
    ADMIN_PERMISSIONS,
    ADMIN_ROLES,
    ADMIN_ROLE_OPTIONS,
    getAdminRoleLabel,
    getRolePermissions,
    isPlatformOwner,
    resolveAdminRole,
} from '../../adminAccess';
import { recordAdminAudit } from '../../adminAudit';
import { useAdminShell } from '../AdminShell';

const ASSISTANT_PERMISSION_OPTIONS = [
    { value: ADMIN_PERMISSIONS.DASHBOARD_READ, label: 'قراءة لوحة المؤشرات' },
    { value: ADMIN_PERMISSIONS.SITE_SETTINGS_READ, label: 'قراءة إعدادات الموقع' },
    { value: ADMIN_PERMISSIONS.CONTENT_TOOLS_READ, label: 'قراءة محتوى الأدوات' },
    { value: ADMIN_PERMISSIONS.CONTENT_TOOLS_UPDATE, label: 'تعديل محتوى الأدوات' },
    { value: ADMIN_PERMISSIONS.CONTENT_PAGES_READ, label: 'قراءة الصفحات' },
    { value: ADMIN_PERMISSIONS.CONTENT_PAGES_UPDATE, label: 'تعديل الصفحات' },
    { value: ADMIN_PERMISSIONS.CAMPAIGNS_READ, label: 'قراءة الحملات' },
    { value: ADMIN_PERMISSIONS.CAMPAIGNS_UPDATE, label: 'تعديل الحملات' },
    { value: ADMIN_PERMISSIONS.ADVERTISERS_READ, label: 'قراءة حسابات المعلنين' },
    { value: ADMIN_PERMISSIONS.SUPPORT_READ, label: 'قراءة التذاكر' },
    { value: ADMIN_PERMISSIONS.SUPPORT_REPLY, label: 'الرد على التذاكر' },
    { value: ADMIN_PERMISSIONS.SUPPORT_STATUS, label: 'تغيير حالة التذاكر' },
    { value: ADMIN_PERMISSIONS.PERFORMANCE_READ, label: 'قراءة تقارير الأداء' },
];

const EMPTY_FORM = {
    name: '',
    email: '',
    platformRole: ADMIN_ROLES.ADMIN_ASSISTANT,
    active: true,
    permissions: [ADMIN_PERMISSIONS.DASHBOARD_READ],
};

function formatDate(value) {
    const source = typeof value?.toDate === 'function' ? value.toDate() : value;
    const parsed = source ? new Date(source) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}

function roleTone(role) {
    if (role === ADMIN_ROLES.PLATFORM_OWNER) return 'owner';
    if (role === ADMIN_ROLES.SUPER_ADMIN) return 'super';
    if (role === ADMIN_ROLES.ADMIN_ASSISTANT) return 'assistant';
    return 'manager';
}

function haveSamePermissions(first = [], second = []) {
    return JSON.stringify([...first].sort()) === JSON.stringify([...second].sort());
}

export default function AdminTeamPage() {
    const { adminProfile, can } = useAdminShell();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [message, setMessage] = useState({ text: '', type: 'info' });

    const currentIsOwner = isPlatformOwner(adminProfile);
    const canUpdateRoles = can(ADMIN_PERMISSIONS.ADMINS_UPDATE_ROLE);
    const canSuspendAdmins = can(ADMIN_PERMISSIONS.ADMINS_SUSPEND);
    const canEditAdmins = canUpdateRoles || canSuspendAdmins;
    const roleOptions = useMemo(() => ADMIN_ROLE_OPTIONS.filter((option) => (
        option.value !== ADMIN_ROLES.PLATFORM_OWNER || currentIsOwner
    )), [currentIsOwner]);

    const loadAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const [{ db }, { collection, getDocs }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            const snapshot = await getDocs(collection(db, 'admins'));
            setAdmins(snapshot.docs
                .map((item) => ({ id: item.id, ...item.data() }))
                .sort((a, b) => String(a.name || a.email || '').localeCompare(String(b.name || b.email || ''), 'ar')));
        } catch {
            setMessage({ text: 'تعذر تحميل فريق الإدارة. تحتاج القواعد الجديدة وصلاحية قراءة المديرين.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAdmins();
    }, [loadAdmins]);

    const openAdd = () => {
        setForm({ ...EMPTY_FORM, permissions: [...EMPTY_FORM.permissions] });
        setEditing(null);
        setAdding(true);
    };

    const openEdit = (admin) => {
        setForm({
            name: admin.name || '',
            email: admin.email || '',
            platformRole: resolveAdminRole(admin),
            active: admin.active === true,
            permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
        });
        setEditing(admin);
        setAdding(false);
    };

    const updateRole = (platformRole) => {
        setForm((current) => ({
            ...current,
            platformRole,
            permissions: platformRole === ADMIN_ROLES.ADMIN_ASSISTANT
                ? current.permissions
                : [],
        }));
    };

    const togglePermission = (permission) => {
        setForm((current) => ({
            ...current,
            permissions: current.permissions.includes(permission)
                ? current.permissions.filter((item) => item !== permission)
                : [...current.permissions, permission],
        }));
    };

    const saveExisting = async (event) => {
        event.preventDefault();
        if (!editing || !canEditAdmins) return;
        const roleChanged = form.name.trim() !== String(editing.name || '').trim()
            || form.platformRole !== resolveAdminRole(editing)
            || !haveSamePermissions(form.permissions, editing.permissions || []);
        const statusChanged = form.active !== (editing.active === true);
        if (roleChanged && !canUpdateRoles) {
            setMessage({ text: 'لا تملك صلاحية تعديل الاسم أو الدور أو الصلاحيات.', type: 'error' });
            return;
        }
        if (statusChanged && !canSuspendAdmins) {
            setMessage({ text: 'لا تملك صلاحية تغيير حالة الحساب.', type: 'error' });
            return;
        }
        if (editing.id === adminProfile?.id && (roleChanged || !form.active)) {
            setMessage({ text: 'لا يمكن تغيير دور حسابك الحالي أو تعطيله من داخل جلسته.', type: 'error' });
            return;
        }
        if (form.platformRole === ADMIN_ROLES.PLATFORM_OWNER && !currentIsOwner) {
            setMessage({ text: 'مالك المنصة وحده يستطيع منح هذا الدور.', type: 'error' });
            return;
        }

        setSaving(true);
        try {
            const [{ db }, { doc, serverTimestamp, updateDoc }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            await updateDoc(doc(db, 'admins', editing.id), {
                name: form.name.trim(),
                active: Boolean(form.active),
                platformRole: form.platformRole,
                role: form.platformRole,
                permissions: form.platformRole === ADMIN_ROLES.ADMIN_ASSISTANT ? form.permissions : [],
                updatedAt: serverTimestamp(),
                updatedBy: adminProfile.id,
            });
            await recordAdminAudit({
                action: roleChanged && statusChanged
                    ? 'admin.account_updated'
                    : roleChanged ? 'admin.role_updated' : 'admin.status_updated',
                resourceType: 'admin',
                resourceId: editing.id,
                details: { role: form.platformRole, status: form.active ? 'active' : 'inactive' },
            });
            setEditing(null);
            await loadAdmins();
            setMessage({ text: 'تم تحديث الحساب الإداري وتسجيل العملية.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر تحديث الحساب. تحقق من صلاحيتك ومن نشر قواعد Firestore الجديدة.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const createAdmin = async (event) => {
        event.preventDefault();
        if (!can(ADMIN_PERMISSIONS.ADMINS_CREATE)) return;
        if (form.platformRole === ADMIN_ROLES.PLATFORM_OWNER && !currentIsOwner) {
            setMessage({ text: 'مالك المنصة وحده يستطيع إنشاء مالك منصة آخر.', type: 'error' });
            return;
        }

        setSaving(true);
        let secondaryApp = null;
        let createdUser = null;
        try {
            const [firebaseModule, appModule, authModule, firestoreModule] = await Promise.all([
                import('../../firebase'),
                import('firebase/app'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);
            const temporaryPassword = `Dt!${window.crypto.randomUUID().replaceAll('-', '')}`;
            secondaryApp = appModule.initializeApp(firebaseModule.firebaseConfig, `admin-invite-${window.crypto.randomUUID()}`);
            const secondaryAuth = authModule.getAuth(secondaryApp);
            const credential = await authModule.createUserWithEmailAndPassword(secondaryAuth, form.email.trim().toLowerCase(), temporaryPassword);
            createdUser = credential.user;
            await authModule.updateProfile(createdUser, { displayName: form.name.trim() });
            await firestoreModule.setDoc(firestoreModule.doc(firebaseModule.db, 'admins', createdUser.uid), {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                active: true,
                platformRole: form.platformRole,
                role: form.platformRole,
                permissions: form.platformRole === ADMIN_ROLES.ADMIN_ASSISTANT ? form.permissions : [],
                createdAt: firestoreModule.serverTimestamp(),
                updatedAt: firestoreModule.serverTimestamp(),
                createdBy: adminProfile.id,
                updatedBy: adminProfile.id,
            });
            const actionSettings = { url: `${window.location.origin}/admin_login` };
            await Promise.allSettled([
                authModule.sendEmailVerification(createdUser, actionSettings),
                authModule.sendPasswordResetEmail(secondaryAuth, form.email.trim().toLowerCase(), actionSettings),
            ]);
            await recordAdminAudit({
                action: 'admin.invited',
                resourceType: 'admin',
                resourceId: createdUser.uid,
                details: { role: form.platformRole, status: 'active' },
            });
            setAdding(false);
            await loadAdmins();
            setMessage({ text: 'تم إنشاء الحساب وإرسال رابط التحقق وتعيين كلمة المرور.', type: 'success' });
        } catch {
            if (createdUser) {
                try {
                    const { deleteUser } = await import('firebase/auth');
                    await deleteUser(createdUser);
                } catch {
                    // Keep the original error visible when rollback is unavailable.
                }
            }
            setMessage({ text: 'تعذر إنشاء الحساب الإداري. تحقق من البريد والصلاحيات والقواعد.', type: 'error' });
        } finally {
            if (secondaryApp) {
                try {
                    const { deleteApp } = await import('firebase/app');
                    await deleteApp(secondaryApp);
                } catch {
                    // The temporary app is discarded with the page session.
                }
            }
            setSaving(false);
        }
    };

    const visiblePermissions = form.platformRole === ADMIN_ROLES.ADMIN_ASSISTANT
        ? form.permissions.length
        : getRolePermissions(form.platformRole).length;

    return (
        <div className="admin-section-page admin-team-page">
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />
            <header className="admin-page-hero">
                <div>
                    <span>الحوكمة والصلاحيات</span>
                    <h1>فريق الإدارة</h1>
                    <p>إدارة الأدوار وحالة الحسابات وفق أقل صلاحية لازمة.</p>
                </div>
                {can(ADMIN_PERMISSIONS.ADMINS_CREATE) && (
                    <button type="button" className="legacy-primary-btn" onClick={openAdd}>
                        <i className="fa-solid fa-user-plus"></i> إضافة مدير
                    </button>
                )}
            </header>

            <section className="legacy-section-card">
                <div className="legacy-section-heading">
                    <span className="legacy-section-icon"><i className="fa-solid fa-users-gear"></i></span>
                    <div><h2>الحسابات الإدارية</h2><p>لا يمكن للحساب تعطيل نفسه أو تغيير دوره من الجلسة الحالية.</p></div>
                </div>
                <div className="tools-list tools-managed-table admin-team-table">
                    <div className="tools-managed-table-head">
                        <span>الحساب</span><span>الدور</span><span>الصلاحيات</span><span>الحالة</span><span>آخر تحديث</span><span>الإجراء</span>
                    </div>
                    {loading ? <div className="admin-table-empty">جاري تحميل الفريق...</div> : admins.map((admin) => {
                        const role = resolveAdminRole(admin);
                        return (
                            <div className="tools-item-card tools-managed-table-row" key={admin.id}>
                                <div><strong>{admin.name || 'مدير بلا اسم'}</strong><small dir="ltr">{admin.email || admin.id}</small>{admin.id === adminProfile?.id && <em>الحساب الحالي</em>}</div>
                                <div><span className={`admin-role-badge ${roleTone(role)}`}>{getAdminRoleLabel(role)}</span></div>
                                <div><strong>{role === ADMIN_ROLES.ADMIN_ASSISTANT ? (admin.permissions?.length || 0) : getRolePermissions(role).length}</strong><small>صلاحية فعالة</small></div>
                                <div><span className={`client-status ${admin.active ? 'active' : 'rejected'}`}>{admin.active ? 'نشط' : 'معلّق'}</span></div>
                                <div><small>{formatDate(admin.updatedAt || admin.createdAt)}</small></div>
                                <div className="tools-item-actions"><button type="button" className="edit" onClick={() => openEdit(admin)} disabled={!canEditAdmins} title="تعديل الحساب"><i className="fa-solid fa-pen"></i></button></div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {(editing || adding) && (
                <div className="legacy-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-role-modal-title">
                    <form className="legacy-modal-card admin-role-modal" onSubmit={adding ? createAdmin : saveExisting}>
                        <div className="legacy-modal-head"><div><h3 id="admin-role-modal-title">{adding ? 'إضافة مدير' : 'تعديل حساب إداري'}</h3><p>{visiblePermissions} صلاحية مرتبطة بالدور المحدد.</p></div><button type="button" className="legacy-icon-btn" onClick={() => { setAdding(false); setEditing(null); }} disabled={saving} aria-label="إغلاق"><i className="fa-solid fa-xmark"></i></button></div>
                        <div className="legacy-form-grid two-columns">
                            <label className="legacy-field"><span>الاسم</span><input required disabled={!adding && !canUpdateRoles} maxLength="120" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
                            <label className="legacy-field"><span>البريد الإلكتروني</span><input required type="email" dir="ltr" disabled={!adding} maxLength="160" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
                            <label className="legacy-field"><span>الدور الوظيفي</span><select value={form.platformRole} disabled={editing?.id === adminProfile?.id || (!adding && !canUpdateRoles)} onChange={(event) => updateRole(event.target.value)}>{roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                            {!adding && <label className="legacy-field"><span>حالة الحساب</span><select value={form.active ? 'active' : 'inactive'} disabled={editing?.id === adminProfile?.id || !canSuspendAdmins} onChange={(event) => setForm((current) => ({ ...current, active: event.target.value === 'active' }))}><option value="active">نشط</option><option value="inactive">معلّق</option></select></label>}
                        </div>
                        {form.platformRole === ADMIN_ROLES.ADMIN_ASSISTANT && <div className="admin-permission-grid">{ASSISTANT_PERMISSION_OPTIONS.map((option) => <label key={option.value}><input type="checkbox" disabled={!adding && !canUpdateRoles} checked={form.permissions.includes(option.value)} onChange={() => togglePermission(option.value)} /><span>{option.label}</span><code>{option.value}</code></label>)}</div>}
                        <div className="legacy-modal-actions"><button type="button" className="legacy-secondary-btn" onClick={() => { setAdding(false); setEditing(null); }} disabled={saving}>إلغاء</button><button type="submit" className="legacy-primary-btn" disabled={saving}><i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>{saving ? 'جاري الحفظ...' : 'حفظ الحساب'}</button></div>
                    </form>
                </div>
            )}
        </div>
    );
}
