import { redirect } from 'next/navigation';

export default function AdminIdentityRedirectPage() {
    redirect('/admin/tools#identity-basic-settings');
}
