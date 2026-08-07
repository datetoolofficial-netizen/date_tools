'use client';

import ToolManagementShell from '../ToolManagementShell';
import ToolContentSettings from '../ToolContentSettings';

export default function AdminWeatherToolPage() {
    return (
        <ToolManagementShell
            active="tool-management"
            icon="fa-cloud-sun"
            loadingTitle="جاري فتح إدارة أداة الطقس..."
            title="إدارة أداة الطقس"
            description="إعدادات خاصة بصفحة الطقس: SEO، أسماء أدوات الطقس، نصوص المشاركة، والأسئلة الإضافية."
        >
            {({ firebaseApi, showMessage }) => (
                <ToolContentSettings firebaseApi={firebaseApi} showMessage={showMessage} toolKey="weather" />
            )}
        </ToolManagementShell>
    );
}
