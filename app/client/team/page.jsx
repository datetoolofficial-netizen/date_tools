'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import {
    ADVERTISER_PERMISSIONS,
    ADVERTISER_ROLES,
    buildAdvertiserRegistrationProfile,
    getAdvertiserRoleLabel,
    hasAdvertiserPermission,
    resolveAdvertiserRole,
    resolveOrganizationNumber,
} from '../../advertiserAccess';
import { useClientPortal } from '../ClientShell';

const MEMBER_ROLES = [
    { value: ADVERTISER_ROLES.ORGANIZATION_ADMIN, label: 'مدير المنظمة' },
    { value: ADVERTISER_ROLES.CAMPAIGN_MANAGER, label: 'مدير الحملات' },
    { value: ADVERTISER_ROLES.CAMPAIGN_EDITOR, label: 'محرر الحملات' },
    { value: ADVERTISER_ROLES.ANALYST, label: 'محلل تقارير' },
    { value: ADVERTISER_ROLES.BILLING_MANAGER, label: 'مسؤول الفوترة' },
    { value: ADVERTISER_ROLES.VIEWER, label: 'مشاهد' },
];

const EMPTY_MEMBER = { name: '', email: '', phone: '', role: ADVERTISER_ROLES.CAMPAIGN_MANAGER };

export default function ClientTeamPage() {
    const { profile, currentUser, isLocalDemo } = useClientPortal();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_MEMBER);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const canManage = hasAdvertiserPermission(profile, ADVERTISER_PERMISSIONS.TEAM_MANAGE);

    const loadMembers = useCallback(async () => {
        if (!profile || !currentUser) return;
        setLoading(true);
        try {
            if (isLocalDemo) {
                const { listLocalAdvertiserAccounts } = await import('../localAdvertiserDemo');
                const all = await listLocalAdvertiserAccounts();
                setMembers(all.filter((item) => item.organizationId === profile.organizationId));
                return;
            }
            const [{ db }, { collection, getDocs, query, where }] = await Promise.all([
                import('../../firebase'),
                import('firebase/firestore'),
            ]);
            const snapshot = await getDocs(query(
                collection(db, 'advertisers'),
                where('organizationId', '==', profile.organizationId || currentUser.uid),
            ));
            setMembers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        } catch {
            setMessage({ text: 'تعذر تحميل أعضاء المنظمة. تحقق من صلاحيات الحساب.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [currentUser, isLocalDemo, profile]);

    useEffect(() => { loadMembers(); }, [loadMembers]);

    const totals = useMemo(() => ({
        all: members.length,
        active: members.filter((item) => item.status === 'active').length,
        pending: members.filter((item) => item.status === 'pending_email').length,
    }), [members]);

    const saveMember = async (event) => {
        event.preventDefault();
        if (!editing || !canManage || editing.id === currentUser.uid || resolveAdvertiserRole(editing) === ADVERTISER_ROLES.OWNER) return;
        setSaving(true);
        try {
            if (isLocalDemo) {
                const { updateLocalAdvertiserAccount } = await import('../localAdvertiserDemo');
                await updateLocalAdvertiserAccount(editing.id, { role: form.role, status: form.status });
            } else {
                const [{ db }, { doc, serverTimestamp, updateDoc }] = await Promise.all([
                    import('../../firebase'),
                    import('firebase/firestore'),
                ]);
                await updateDoc(doc(db, 'advertisers', editing.id), {
                    role: form.role,
                    status: form.status,
                    updatedAt: serverTimestamp(),
                });
            }
            setEditing(null);
            await loadMembers();
            setMessage({ text: 'تم تحديث دور العضو وحالته.', type: 'success' });
        } catch {
            setMessage({ text: 'تعذر تحديث العضو. لا يمكن تعديل المالك أو عضو خارج المنظمة.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const inviteMember = async (event) => {
        event.preventDefault();
        if (!canManage) return;
        if (isLocalDemo) {
            setMessage({ text: 'إضافة عضو جديد من داخل المنظمة متاحة مع Firebase، ويمكن تجربة الأدوار من صفحة حسابات الإدارة.', type: 'info' });
            return;
        }
        setSaving(true);
        let secondaryApp = null;
        let createdUser = null;
        try {
            const [firebaseModule, appModule, authModule, firestoreModule] = await Promise.all([
                import('../../firebase'), import('firebase/app'), import('firebase/auth'), import('firebase/firestore'),
            ]);
            secondaryApp = appModule.initializeApp(firebaseModule.firebaseConfig, `advertiser-member-${window.crypto.randomUUID()}`);
            const secondaryAuth = authModule.getAuth(secondaryApp);
            const password = `Dt!${window.crypto.randomUUID().replaceAll('-', '')}`;
            const credential = await authModule.createUserWithEmailAndPassword(secondaryAuth, form.email.trim().toLowerCase(), password);
            createdUser = credential.user;
            await authModule.updateProfile(createdUser, { displayName: form.name.trim() });
            await firestoreModule.setDoc(firestoreModule.doc(firebaseModule.db, 'advertisers', createdUser.uid), {
                ...buildAdvertiserRegistrationProfile({
                    uid: createdUser.uid,
                    storeName: profile.storeName,
                    contactName: form.name,
                    email: form.email,
                    phone: form.phone,
                    portalVersion: 'organization-invite',
                    organizationId: profile.organizationId || currentUser.uid,
                    organizationNumber: resolveOrganizationNumber(profile),
                    role: form.role,
                }),
                invitedBy: currentUser.uid,
                createdAt: firestoreModule.serverTimestamp(),
                updatedAt: firestoreModule.serverTimestamp(),
            });
            const actionSettings = { url: `${window.location.origin}/client` };
            await Promise.allSettled([
                authModule.sendEmailVerification(createdUser, actionSettings),
                authModule.sendPasswordResetEmail(secondaryAuth, form.email.trim().toLowerCase(), actionSettings),
            ]);
            setAdding(false);
            await loadMembers();
            setMessage({ text: 'تمت دعوة العضو وإرسال رابط التحقق وتعيين كلمة المرور.', type: 'success' });
        } catch {
            if (createdUser) {
                try { await (await import('firebase/auth')).deleteUser(createdUser); } catch { /* rollback unavailable */ }
            }
            setMessage({ text: 'تعذر دعوة العضو. تحقق من البريد والصلاحيات.', type: 'error' });
        } finally {
            if (secondaryApp) {
                try { await (await import('firebase/app')).deleteApp(secondaryApp); } catch { /* temporary app */ }
            }
            setSaving(false);
        }
    };

    return (
        <>
            <Toast visible={Boolean(message.text)} message={message.text} type={message.type} onClose={() => setMessage({ text: '', type: 'info' })} />
            <section className="client-stats-grid client-team-stats"><article className="client-stat-card tone-teal"><span className="client-stat-icon"><i className="fa-solid fa-users"></i></span><div><span>كل الأعضاء</span><strong>{totals.all}</strong><small>ضمن المنظمة نفسها</small></div></article><article className="client-stat-card tone-green"><span className="client-stat-icon"><i className="fa-solid fa-user-check"></i></span><div><span>نشطون</span><strong>{totals.active}</strong><small>يمكنهم تسجيل الدخول</small></div></article><article className="client-stat-card tone-orange"><span className="client-stat-icon"><i className="fa-solid fa-envelope-circle-check"></i></span><div><span>بانتظار التحقق</span><strong>{totals.pending}</strong><small>دعوات غير مكتملة</small></div></article></section>
            <section className="client-panel">
                <header className="client-panel-header"><div><span className="client-panel-icon"><i className="fa-solid fa-users-gear"></i></span><div><h2>أعضاء المنظمة</h2><p>الرقم الموحد يربط الأعضاء بالمنظمة ولا يمنح صلاحية دخول.</p></div></div>{canManage && <button className="client-primary-btn" type="button" onClick={() => { setForm(EMPTY_MEMBER); setAdding(true); }}><i className="fa-solid fa-user-plus"></i> دعوة عضو</button>}</header>
                <div className="client-table-wrap"><table className="client-table"><thead><tr><th>العضو</th><th>الدور</th><th>الحالة</th><th>الإجراء</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="client-empty">جاري التحميل...</td></tr> : members.map((member) => <tr key={member.id}><td><strong>{member.contactName || member.storeName}</strong><small dir="ltr">{member.email}</small></td><td>{getAdvertiserRoleLabel(member)}</td><td><span className={`client-status ${member.status === 'active' ? 'active' : member.status === 'pending_email' ? 'pending' : 'rejected'}`}>{member.status === 'active' ? 'نشط' : member.status === 'pending_email' ? 'بانتظار البريد' : 'معلّق'}</span></td><td><button className="client-icon-btn" type="button" title="تعديل العضو" disabled={!canManage || member.id === currentUser.uid || resolveAdvertiserRole(member) === ADVERTISER_ROLES.OWNER} onClick={() => { setEditing(member); setForm({ role: resolveAdvertiserRole(member), status: member.status }); }}><i className="fa-solid fa-pen"></i></button></td></tr>)}</tbody></table></div>
            </section>
            {(editing || adding) && <div className="client-modal-backdrop" role="dialog" aria-modal="true"><form className="client-modal" onSubmit={adding ? inviteMember : saveMember}><div className="client-modal-head"><div><h2>{adding ? 'دعوة عضو' : 'تعديل العضو'}</h2><p>{adding ? 'سينضم العضو إلى منظمتك فقط.' : editing?.email}</p></div><button type="button" className="client-icon-btn" onClick={() => { setEditing(null); setAdding(false); }}><i className="fa-solid fa-xmark"></i></button></div>{adding && <><div className="client-form-group"><label>اسم العضو</label><input required maxLength="120" value={form.name || ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></div><div className="client-form-group"><label>البريد الإلكتروني</label><input required type="email" dir="ltr" maxLength="160" value={form.email || ''} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></div><div className="client-form-group"><label>رقم التواصل</label><input type="tel" dir="ltr" maxLength="40" value={form.phone || ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></div></>}<div className="client-form-group"><label>الدور</label><select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>{MEMBER_ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></div>{editing && <div className="client-form-group"><label>الحالة</label><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}><option value="active">نشط</option><option value="suspended">معلّق</option><option value="closed">مغلق</option></select></div>}<div className="client-modal-actions"><button type="button" className="client-secondary-btn" onClick={() => { setEditing(null); setAdding(false); }}>إلغاء</button><button type="submit" className="client-primary-btn" disabled={saving}>{saving ? 'جاري الحفظ...' : adding ? 'إرسال الدعوة' : 'حفظ التعديل'}</button></div></form></div>}
        </>
    );
}
