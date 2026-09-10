'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import { ADMIN_PERMISSIONS } from '../../adminAccess';
import { recordAdminAudit } from '../../adminAudit';
import {
    ADVERTISER_ROLES,
    buildAdvertiserRegistrationProfile,
    formatOrganizationNumber,
    getAdvertiserRoleLabel,
    normalizeOrganizationNumber,
    resolveOrganizationNumber,
    resolveAdvertiserRole,
} from '../../advertiserAccess';
import { useAdminShell } from '../AdminShell';

const ROLE_OPTIONS = [
    { value: ADVERTISER_ROLES.OWNER, label: 'مالك حساب المعلن' },
    { value: ADVERTISER_ROLES.ORGANIZATION_ADMIN, label: 'مدير المنظمة' },
    { value: ADVERTISER_ROLES.CAMPAIGN_MANAGER, label: 'مدير الحملات' },
    { value: ADVERTISER_ROLES.CAMPAIGN_EDITOR, label: 'محرر الحملات' },
    { value: ADVERTISER_ROLES.ANALYST, label: 'محلل تقارير' },
    { value: ADVERTISER_ROLES.BILLING_MANAGER, label: 'مسؤول الفوترة' },
    { value: ADVERTISER_ROLES.VIEWER, label: 'مشاهد' },
];

const STATUS_OPTIONS = [
    { value: 'pending_email', label: 'بانتظار توثيق البريد' },
    { value: 'active', label: 'نشط' },
    { value: 'suspended', label: 'معلّق' },
    { value: 'closed', label: 'مغلق' },
];

const EMPTY_ACCOUNT_FORM = {
    organizationMode: 'new',
    organizationNumber: '',
    storeName: '',
    contactName: '',
    email: '',
    phone: '',
    password: 'LocalMember2026!',
    role: ADVERTISER_ROLES.CAMPAIGN_MANAGER,
};

function statusLabel(status) {
    return STATUS_OPTIONS.find((item) => item.value === status)?.label || 'غير معروف';
}

function statusClass(status) {
    if (status === 'active') return 'active';
    if (status === 'suspended' || status === 'closed') return 'rejected';
    return 'pending';
}

function formatDate(value) {
    const source = typeof value?.toDate === 'function' ? value.toDate() : value;
    const parsed = source ? new Date(source) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return 'غير محدد';
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(parsed);
}

export default function AdminAdvertisersPage() {
    const adminShell = useAdminShell();
    const [advertisers, setAdvertisers] = useState([]);
    const [drafts, setDrafts] = useState({});
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState('');
    const [editingId, setEditingId] = useState('');
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    const [addingAccount, setAddingAccount] = useState(false);
    const [accountForm, setAccountForm] = useState(EMPTY_ACCOUNT_FORM);
    const [dataSource, setDataSource] = useState('');
    const [message, setMessage] = useState({ text: '', type: 'info' });

    const openAddAccount = () => {
        setAccountForm({ ...EMPTY_ACCOUNT_FORM });
        setIsAddingAccount(true);
    };

    const updateAccountForm = (field, value) => {
        setAccountForm((current) => ({ ...current, [field]: value }));
    };

    const loadAdvertisers = useCallback(async () => {
        if (!adminShell?.isCurrentPageAllowed) return;
        setLoading(true);
        try {
            const localDemo = await import('../../client/localAdvertiserDemo');
            if (localDemo.isLocalAdvertiserDemoEnabled()) {
                const nextAdvertisers = await localDemo.listLocalAdvertiserAccounts();
                setAdvertisers(nextAdvertisers);
                setDrafts(Object.fromEntries(nextAdvertisers.map((advertiser) => [
                    advertiser.id,
                    {
                        role: resolveAdvertiserRole(advertiser),
                        status: advertiser.status || 'pending_email',
                        organizationNumber: resolveOrganizationNumber(advertiser),
                    },
                ])));
                setDataSource('local');
                return;
            }

            const [{ db }, { collection, getDocs }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            const snapshot = await getDocs(collection(db, 'advertisers'));
            const nextAdvertisers = snapshot.docs
                .map((item) => ({ id: item.id, ...item.data() }))
                .sort((a, b) => String(a.storeName || a.email || '').localeCompare(String(b.storeName || b.email || ''), 'ar'));
            setAdvertisers(nextAdvertisers);
            setDrafts(Object.fromEntries(nextAdvertisers.map((advertiser) => [
                advertiser.id,
                {
                    role: resolveAdvertiserRole(advertiser),
                    status: advertiser.status || 'pending_email',
                    organizationNumber: resolveOrganizationNumber(advertiser),
                },
            ])));
            setDataSource('firebase');
        } catch {
            setMessage({ text: 'تعذر تحميل حسابات المعلنين. تحقق من صلاحية الصفحة.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [adminShell?.isCurrentPageAllowed]);

    useEffect(() => {
        loadAdvertisers();
    }, [loadAdvertisers]);

    useEffect(() => {
        if (!editingId && !isAddingAccount) return undefined;
        const closeOnEscape = (event) => {
            if (event.key !== 'Escape' || savingId || addingAccount) return;
            setEditingId('');
            setIsAddingAccount(false);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [addingAccount, editingId, isAddingAccount, savingId]);

    const visibleAdvertisers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return advertisers;
        return advertisers.filter((advertiser) => [
            advertiser.storeName,
            advertiser.contactName,
            advertiser.email,
            advertiser.organizationId,
            resolveOrganizationNumber(advertiser),
            advertiser.id,
        ].some((value) => String(value || '').toLowerCase().includes(query)));
    }, [advertisers, search]);

    const totals = useMemo(() => ({
        all: advertisers.length,
        active: advertisers.filter((item) => item.status === 'active').length,
        pending: advertisers.filter((item) => item.status === 'pending_email').length,
        suspended: advertisers.filter((item) => ['suspended', 'closed'].includes(item.status)).length,
    }), [advertisers]);

    const updateDraft = (id, field, value) => {
        setDrafts((current) => ({
            ...current,
            [id]: { ...(current[id] || {}), [field]: value },
        }));
    };

    const getPersistedDraft = (advertiser) => ({
        role: resolveAdvertiserRole(advertiser),
        status: advertiser.status || 'pending_email',
        organizationNumber: resolveOrganizationNumber(advertiser),
    });

    const startEditing = (advertiser) => {
        setDrafts((current) => ({
            ...current,
            [advertiser.id]: getPersistedDraft(advertiser),
        }));
        setEditingId(advertiser.id);
    };

    const cancelEditing = (advertiser) => {
        setDrafts((current) => ({
            ...current,
            [advertiser.id]: getPersistedDraft(advertiser),
        }));
        setEditingId('');
    };

    const saveAdvertiser = async (advertiser) => {
        if (!adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_UPDATE)) {
            setMessage({ text: 'لا يملك حسابك صلاحية تعديل حسابات المعلنين.', type: 'error' });
            return;
        }
        const draft = drafts[advertiser.id];
        if (!draft) return;
        const organizationNumber = normalizeOrganizationNumber(draft.organizationNumber);
        const organizationAccount = advertisers.find((item) => (
            resolveOrganizationNumber(item) === organizationNumber
        ));
        if (organizationNumber.length !== 12 || !organizationAccount) {
            setMessage({ text: 'رقم المنظمة غير موجود. اختر رقمًا ظاهرًا في جدول الحسابات.', type: 'error' });
            return;
        }

        const organizationPatch = {
            organizationId: organizationAccount.organizationId || organizationAccount.id,
            organizationNumber,
        };
        setSavingId(advertiser.id);
        try {
            if (dataSource === 'local') {
                const { updateLocalAdvertiserAccount } = await import('../../client/localAdvertiserDemo');
                const updated = await updateLocalAdvertiserAccount(advertiser.id, { ...draft, ...organizationPatch });
                setAdvertisers((current) => current.map((item) => (
                    item.id === advertiser.id ? updated : item
                )));
                setMessage({ text: `تم حفظ صلاحية وحالة ${updated.storeName || updated.email} محليًا.`, type: 'success' });
                setEditingId('');
                return;
            }

            const [{ db }, { doc, serverTimestamp, updateDoc }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            await updateDoc(doc(db, 'advertisers', advertiser.id), {
                role: draft.role,
                status: draft.status,
                ...organizationPatch,
                updatedAt: serverTimestamp(),
            });
            await recordAdminAudit({
                action: 'advertiser.updated',
                resourceType: 'advertiser',
                resourceId: advertiser.id,
                details: {
                    role: draft.role,
                    status: draft.status,
                    organizationId: organizationPatch.organizationId,
                },
            });
            setAdvertisers((current) => current.map((item) => (
                item.id === advertiser.id ? { ...item, ...draft, ...organizationPatch } : item
            )));
            setMessage({ text: `تم حفظ صلاحية وحالة ${advertiser.storeName || advertiser.email}.`, type: 'success' });
            setEditingId('');
        } catch {
            setMessage({ text: 'تعذر حفظ الحساب. لا يملك المستخدم الحالي صلاحية إدارة المعلنين.', type: 'error' });
        } finally {
            setSavingId('');
        }
    };

    const addAdvertiserAccount = async (event) => {
        event.preventDefault();
        if (!adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_CREATE)) {
            setMessage({ text: 'لا يملك حسابك صلاحية إنشاء حسابات المعلنين.', type: 'error' });
            return;
        }
        const cleanEmail = accountForm.email.trim().toLowerCase();
        const cleanOrganizationNumber = normalizeOrganizationNumber(accountForm.organizationNumber);
        const linkedAccount = accountForm.organizationMode === 'existing'
            ? advertisers.find((item) => resolveOrganizationNumber(item) === cleanOrganizationNumber)
            : null;

        if (!accountForm.storeName.trim() || !accountForm.contactName.trim() || !cleanEmail) {
            setMessage({ text: 'أكمل اسم الجهة واسم المسؤول والبريد الإلكتروني.', type: 'error' });
            return;
        }
        if (advertisers.some((item) => String(item.email || '').toLowerCase() === cleanEmail)) {
            setMessage({ text: 'يوجد حساب معلن مسجل بهذا البريد.', type: 'error' });
            return;
        }
        if (accountForm.organizationMode === 'existing' && (!linkedAccount || cleanOrganizationNumber.length !== 12)) {
            setMessage({ text: 'أدخل رقم منظمة صحيحًا وموجودًا في جدول الحسابات.', type: 'error' });
            return;
        }

        setAddingAccount(true);
        let secondaryApp = null;
        let createdUser = null;
        try {
            if (dataSource === 'local') {
                const { createLocalAdvertiserAccount } = await import('../../client/localAdvertiserDemo');
                const created = await createLocalAdvertiserAccount({
                    ...accountForm,
                    email: cleanEmail,
                    organizationNumber: cleanOrganizationNumber,
                });
                await loadAdvertisers();
                setIsAddingAccount(false);
                setMessage({
                    text: `تم إنشاء حساب ${created.storeName} محليًا. كلمة المرور التجريبية: ${accountForm.password}`,
                    type: 'success',
                });
                return;
            }

            const [firebaseModule, appModule, authModule, firestoreModule] = await Promise.all([
                import('../../firebase'),
                import('firebase/app'),
                import('firebase/auth'),
                import('firebase/firestore'),
            ]);
            const temporaryPassword = `Dt!${window.crypto.randomUUID().replaceAll('-', '')}`;
            secondaryApp = appModule.initializeApp(
                firebaseModule.firebaseConfig,
                `admin-create-advertiser-${window.crypto.randomUUID()}`,
            );
            const secondaryAuth = authModule.getAuth(secondaryApp);
            const credential = await authModule.createUserWithEmailAndPassword(secondaryAuth, cleanEmail, temporaryPassword);
            createdUser = credential.user;
            await authModule.updateProfile(createdUser, { displayName: accountForm.storeName.trim() });

            const organizationId = linkedAccount?.organizationId || linkedAccount?.id || createdUser.uid;
            const organizationNumber = linkedAccount
                ? resolveOrganizationNumber(linkedAccount)
                : resolveOrganizationNumber({ organizationId });
            const role = linkedAccount ? accountForm.role : ADVERTISER_ROLES.OWNER;

            await firestoreModule.setDoc(firestoreModule.doc(firebaseModule.db, 'advertisers', createdUser.uid), {
                ...buildAdvertiserRegistrationProfile({
                    uid: createdUser.uid,
                    storeName: accountForm.storeName,
                    contactName: accountForm.contactName,
                    email: cleanEmail,
                    phone: accountForm.phone,
                    portalVersion: 'admin-created',
                    organizationId,
                    organizationNumber,
                    role,
                }),
                createdAt: firestoreModule.serverTimestamp(),
                updatedAt: firestoreModule.serverTimestamp(),
            });
            await recordAdminAudit({
                action: 'advertiser.created',
                resourceType: 'advertiser',
                resourceId: createdUser.uid,
                details: { role, status: 'pending_email', organizationId },
            });

            const emailActionSettings = { url: `${window.location.origin}/client` };
            await Promise.allSettled([
                authModule.sendEmailVerification(createdUser, emailActionSettings),
                authModule.sendPasswordResetEmail(secondaryAuth, cleanEmail, emailActionSettings),
            ]);
            await loadAdvertisers();
            setIsAddingAccount(false);
            setMessage({
                text: 'تم إنشاء الحساب وإرسال رابط توثيق البريد ورابط تعيين كلمة المرور إلى المعلن.',
                type: 'success',
            });
        } catch (error) {
            if (createdUser) {
                try {
                    const { deleteUser } = await import('firebase/auth');
                    await deleteUser(createdUser);
                } catch {
                    // The account may already have a profile; avoid hiding the original error.
                }
            }
            const friendly = error?.code === 'auth/email-already-in-use'
                ? 'هذا البريد مسجل مسبقًا في نظام الدخول.'
                : error?.message === 'weak_password'
                ? 'كلمة المرور التجريبية يجب ألا تقل عن 8 أحرف.'
                : 'تعذر إنشاء حساب المعلن. تحقق من البيانات وصلاحية إدارة الحسابات.';
            setMessage({ text: friendly, type: 'error' });
        } finally {
            if (secondaryApp) {
                try {
                    const { deleteApp } = await import('firebase/app');
                    await deleteApp(secondaryApp);
                } catch {
                    // Secondary Firebase apps are short-lived and isolated from the admin session.
                }
            }
            setAddingAccount(false);
        }
    };

    const editingAdvertiser = advertisers.find((advertiser) => advertiser.id === editingId) || null;
    const editingDraft = editingAdvertiser ? (drafts[editingAdvertiser.id] || getPersistedDraft(editingAdvertiser)) : null;
    const editingChanged = Boolean(editingAdvertiser && editingDraft) && (
        editingDraft.role !== resolveAdvertiserRole(editingAdvertiser)
        || editingDraft.status !== (editingAdvertiser.status || 'pending_email')
        || normalizeOrganizationNumber(editingDraft.organizationNumber) !== resolveOrganizationNumber(editingAdvertiser)
    );
    const canCreateAdvertiser = adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_CREATE);
    const canUpdateAdvertiser = adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_UPDATE);
    const canAssignAdvertiserRole = adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_ROLES);
    const canChangeAdvertiserStatus = adminShell?.can?.(ADMIN_PERMISSIONS.ADVERTISERS_STATUS);

    return (
        <div className="admin-advertisers-page" dir="rtl">
            <Toast
                visible={Boolean(message.text)}
                message={message.text}
                type={message.type}
                onClose={() => setMessage({ text: '', type: 'info' })}
            />

            <section className="admin-overview-hero admin-advertisers-hero">
                <div className="admin-overview-hero-copy">
                    <span className="admin-overview-eyebrow">إدارة المعلنين</span>
                    <h1>الحسابات</h1>
                    <p>استعرض حسابات المعلنين وابحث فيها، ثم حدّد دور كل حساب وحالته التشغيلية.</p>
                </div>
                <div className="admin-advertisers-hero-actions">
                    <button type="button" className="legacy-primary-btn" onClick={openAddAccount} disabled={!canCreateAdvertiser}>
                        <i className="fa-solid fa-user-plus"></i>
                        إضافة حساب معلن
                    </button>
                    <button type="button" className="admin-overview-refresh" onClick={loadAdvertisers} disabled={loading}>
                        <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
                        تحديث
                    </button>
                </div>
            </section>

            {dataSource === 'local' && (
                <div className="admin-accounts-source-note" role="status">
                    <i className="fa-solid fa-laptop-code" aria-hidden="true"></i>
                    <div>
                        <strong>حسابات تجريبية محلية</strong>
                        <span>التعديلات في هذه المعاينة محفوظة داخل هذا المتصفح فقط ولا تصل إلى Firebase أو الموقع المنشور.</span>
                    </div>
                </div>
            )}

            <section className="admin-advertisers-kpis" aria-label="ملخص حسابات المعلنين">
                <div><span>كل الحسابات</span><strong>{totals.all}</strong></div>
                <div><span>نشطة</span><strong>{totals.active}</strong></div>
                <div><span>بانتظار البريد</span><strong>{totals.pending}</strong></div>
                <div><span>معلقة أو مغلقة</span><strong>{totals.suspended}</strong></div>
            </section>

            <section className="legacy-table-card admin-advertisers-card">
                <div className="legacy-page-heading">
                    <div>
                        <h2 className="legacy-section-title"><i className="fa-solid fa-users-gear"></i> الحسابات والأدوار</h2>
                        <p>الحساب القديم بلا دور محفوظ يعامل كمالك للحفاظ على التوافق، ويُحفظ الدور صراحة عند أول تعديل.</p>
                    </div>
                    <label className="admin-advertisers-search">
                        <span>بحث</span>
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="المتجر أو البريد أو المعرّف" />
                    </label>
                </div>

                <div className="admin-advertisers-table-wrap">
                    <table className="legacy-ads-table admin-advertisers-table">
                        <thead>
                            <tr>
                                <th>المعلن</th>
                                <th>المنظمة</th>
                                <th>الدور</th>
                                <th>الحالة</th>
                                <th>التسجيل</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="legacy-empty-table">جاري تحميل الحسابات...</td></tr>
                            ) : visibleAdvertisers.length === 0 ? (
                                <tr><td colSpan="6" className="legacy-empty-table">لا توجد حسابات مطابقة.</td></tr>
                            ) : visibleAdvertisers.map((advertiser) => {
                                return (
                                    <tr key={advertiser.id}>
                                        <td>
                                            <strong>{advertiser.storeName || 'معلن بلا اسم'}</strong>
                                            <small>{advertiser.contactName || 'مسؤول غير محدد'}</small>
                                            <small dir="ltr">{advertiser.email || '-'}</small>
                                        </td>
                                        <td>
                                            <strong className="admin-organization-number" dir="ltr">{formatOrganizationNumber(resolveOrganizationNumber(advertiser))}</strong>
                                            <small>{resolveAdvertiserRole(advertiser) === ADVERTISER_ROLES.OWNER ? 'المنظمة الرئيسية' : 'عضو مرتبط'}</small>
                                        </td>
                                        <td><span>{getAdvertiserRoleLabel(advertiser)}</span></td>
                                        <td>
                                            <span className={`legacy-status-pill ${statusClass(advertiser.status || 'pending_email')}`}>{statusLabel(advertiser.status || 'pending_email')}</span>
                                        </td>
                                        <td><small>{formatDate(advertiser.createdAt)}</small></td>
                                        <td>
                                            <div className="tools-item-actions admin-account-actions">
                                                <button type="button" onClick={() => startEditing(advertiser)} disabled={!canUpdateAdvertiser} title="تعديل الحساب" aria-label="تعديل الحساب">
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {editingAdvertiser && editingDraft && (
                <div
                    className="legacy-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="account-edit-modal-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !savingId) cancelEditing(editingAdvertiser);
                    }}
                >
                    <div className="legacy-modal-card admin-account-edit-modal">
                        <div className="legacy-modal-head">
                            <div>
                                <h3 id="account-edit-modal-title">تعديل حساب المعلن</h3>
                                <p>غيّر دور الحساب أو حالته، ثم احفظ التعديل.</p>
                            </div>
                            <button type="button" className="legacy-icon-btn" onClick={() => cancelEditing(editingAdvertiser)} disabled={Boolean(savingId)} aria-label="إغلاق النافذة">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="admin-account-modal-identity">
                            <span><i className="fa-solid fa-store" aria-hidden="true"></i></span>
                            <div>
                                <strong>{editingAdvertiser.storeName || 'معلن بلا اسم'}</strong>
                                <small>{editingAdvertiser.contactName || 'مسؤول غير محدد'}</small>
                                <small dir="ltr">{editingAdvertiser.email || '-'}</small>
                            </div>
                        </div>

                        <div className="legacy-form-grid admin-account-modal-fields">
                            <label className="legacy-field">
                                <span>دور الحساب</span>
                                <select autoFocus value={editingDraft.role} disabled={!canAssignAdvertiserRole} onChange={(event) => updateDraft(editingAdvertiser.id, 'role', event.target.value)}>
                                    {ROLE_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                                </select>
                            </label>
                            <label className="legacy-field">
                                <span>حالة الحساب</span>
                                <select value={editingDraft.status} disabled={!canChangeAdvertiserStatus} onChange={(event) => updateDraft(editingAdvertiser.id, 'status', event.target.value)}>
                                    {STATUS_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                                </select>
                            </label>
                            <label className="legacy-field admin-account-field-wide">
                                <span>رقم المنظمة الموحد</span>
                                <input
                                    dir="ltr"
                                    inputMode="numeric"
                                    maxLength="14"
                                    value={formatOrganizationNumber(editingDraft.organizationNumber)}
                                    onChange={(event) => updateDraft(editingAdvertiser.id, 'organizationNumber', normalizeOrganizationNumber(event.target.value))}
                                />
                                <small>اربط الحساب بمنظمة أخرى بإدخال رقمها الظاهر في الجدول.</small>
                            </label>
                        </div>

                        <div className="legacy-modal-actions admin-account-modal-actions">
                            <button type="button" className="legacy-secondary-btn" onClick={() => cancelEditing(editingAdvertiser)} disabled={Boolean(savingId)}>إلغاء</button>
                            <button type="button" className="legacy-primary-btn" onClick={() => saveAdvertiser(editingAdvertiser)} disabled={!editingChanged || Boolean(savingId)}>
                                <i className={`fa-solid ${savingId ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
                                {savingId ? 'جاري الحفظ...' : 'حفظ التعديل'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddingAccount && (
                <div
                    className="legacy-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="account-add-modal-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !addingAccount) setIsAddingAccount(false);
                    }}
                >
                    <form className="legacy-modal-card admin-account-edit-modal admin-account-add-modal" onSubmit={addAdvertiserAccount}>
                        <div className="legacy-modal-head">
                            <div>
                                <h3 id="account-add-modal-title">إضافة حساب معلن</h3>
                                <p>أنشئ منظمة جديدة أو اربط عضوًا بمنظمة موجودة باستخدام رقمها الموحد.</p>
                            </div>
                            <button type="button" className="legacy-icon-btn" onClick={() => setIsAddingAccount(false)} disabled={addingAccount} aria-label="إغلاق النافذة">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="admin-account-organization-mode" role="group" aria-label="نوع الحساب">
                            <button
                                type="button"
                                className={accountForm.organizationMode === 'new' ? 'active' : ''}
                                onClick={() => updateAccountForm('organizationMode', 'new')}
                            >
                                <i className="fa-solid fa-building-circle-check"></i>
                                منظمة جديدة
                            </button>
                            <button
                                type="button"
                                className={accountForm.organizationMode === 'existing' ? 'active' : ''}
                                onClick={() => updateAccountForm('organizationMode', 'existing')}
                            >
                                <i className="fa-solid fa-user-group"></i>
                                عضو في منظمة
                            </button>
                        </div>

                        <div className="legacy-form-grid admin-account-modal-fields">
                            <label className="legacy-field">
                                <span>اسم المتجر أو الجهة</span>
                                <input autoFocus required maxLength="120" value={accountForm.storeName} onChange={(event) => updateAccountForm('storeName', event.target.value)} />
                            </label>
                            <label className="legacy-field">
                                <span>اسم المسؤول</span>
                                <input required maxLength="120" value={accountForm.contactName} onChange={(event) => updateAccountForm('contactName', event.target.value)} />
                            </label>
                            <label className="legacy-field">
                                <span>البريد الإلكتروني</span>
                                <input required type="email" dir="ltr" maxLength="160" value={accountForm.email} onChange={(event) => updateAccountForm('email', event.target.value)} />
                            </label>
                            <label className="legacy-field">
                                <span>رقم التواصل</span>
                                <input type="tel" dir="ltr" maxLength="40" value={accountForm.phone} onChange={(event) => updateAccountForm('phone', event.target.value)} placeholder="+966..." />
                            </label>

                            {accountForm.organizationMode === 'existing' ? (
                                <>
                                    <label className="legacy-field">
                                        <span>رقم المنظمة الموحد</span>
                                        <input
                                            required
                                            dir="ltr"
                                            inputMode="numeric"
                                            maxLength="14"
                                            value={formatOrganizationNumber(accountForm.organizationNumber)}
                                            onChange={(event) => updateAccountForm('organizationNumber', normalizeOrganizationNumber(event.target.value))}
                                            placeholder="0000 0000 0000"
                                        />
                                    </label>
                                    <label className="legacy-field">
                                        <span>دور العضو</span>
                                        <select value={accountForm.role} onChange={(event) => updateAccountForm('role', event.target.value)}>
                                            {ROLE_OPTIONS.filter((option) => option.value !== ADVERTISER_ROLES.OWNER).map((option) => (
                                                <option value={option.value} key={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                </>
                            ) : (
                                <div className="admin-account-number-note admin-account-field-wide">
                                    <i className="fa-solid fa-hashtag"></i>
                                    <div>
                                        <strong>سيُنشأ رقم منظمة موحد تلقائيًا</strong>
                                        <span>يظهر الرقم بعد الإنشاء ويمكن استخدامه لاحقًا لربط أعضاء آخرين من هذه الصفحة.</span>
                                    </div>
                                </div>
                            )}

                            {dataSource === 'local' && (
                                <label className="legacy-field admin-account-field-wide">
                                    <span>كلمة المرور التجريبية</span>
                                    <input required type="text" dir="ltr" minLength="8" value={accountForm.password} onChange={(event) => updateAccountForm('password', event.target.value)} />
                                    <small>محلية فقط ولا تُرسل أو تُحفظ في Firebase.</small>
                                </label>
                            )}
                        </div>

                        <div className="admin-account-security-note">
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>رقم المنظمة معرّف للربط فقط ولا يسمح بالدخول. في الموقع المنشور يتلقى المعلن روابط توثيق البريد وتعيين كلمة المرور.</span>
                        </div>

                        <div className="legacy-modal-actions admin-account-modal-actions">
                            <button type="button" className="legacy-secondary-btn" onClick={() => setIsAddingAccount(false)} disabled={addingAccount}>إلغاء</button>
                            <button type="submit" className="legacy-primary-btn" disabled={addingAccount}>
                                <i className={`fa-solid ${addingAccount ? 'fa-spinner fa-spin' : 'fa-user-plus'}`}></i>
                                {addingAccount ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
