'use client';

import ToolManagementShell from '../ToolManagementShell';
import ToolContentSettings from '../ToolContentSettings';

export default function AdminClockToolPage() {
    return (
        <ToolManagementShell
            active="tool-management"
            icon="fa-clock"
            loadingTitle="جاري فتح إدارة أداة الساعة..."
            title="إدارة أداة الساعة"
            description="إعدادات خاصة بصفحة الساعة: عنوان السكشن التعريفي، السلوغن، أسماء أدوات الساعة، والأسئلة الإضافية."
        >
            {({ firebaseApi, showMessage }) => (
                <ToolContentSettings firebaseApi={firebaseApi} showMessage={showMessage} toolKey="clock" />
            )}
        </ToolManagementShell>
    );
}
