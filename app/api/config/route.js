import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configPath = path.join(process.cwd(), 'config.json');
        console.log("🔍 جاري البحث عن ملف الإعدادات في المسار:", configPath);
        
        if (!fs.existsSync(configPath)) {
            return NextResponse.json({ error: 'الملف config.json غير موجود في المسار المحدد.' }, { status: 404 });
        }

        const fileContents = fs.readFileSync(configPath, 'utf8');
        return NextResponse.json(JSON.parse(fileContents));
    } catch (error) {
        console.error("❌ خطأ تفصيلي في السيرفر:", error.message);
        return NextResponse.json({ error: 'فشل قراءة الملف بسبب خطأ في التنسيق: ' + error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const configPath = path.join(process.cwd(), 'config.json');
        const data = await request.json();
        const fileContents = fs.readFileSync(configPath, 'utf8');
        const existingConfig = JSON.parse(fileContents);
        
        // تحديث الحقول
        existingConfig.toolDisplayName = data.toolDisplayName !== undefined ? data.toolDisplayName : existingConfig.toolDisplayName;
        existingConfig.toolSlogan = data.toolSlogan !== undefined ? data.toolSlogan : existingConfig.toolSlogan;
        existingConfig.hasLogo = data.hasLogo !== undefined ? data.hasLogo : existingConfig.hasLogo;
        existingConfig.logoUrl = data.logoUrl !== undefined ? data.logoUrl : existingConfig.logoUrl;
        existingConfig.copyrightText = data.copyrightText !== undefined ? data.copyrightText : existingConfig.copyrightText;
        existingConfig.externalLinks = data.externalLinks !== undefined ? data.externalLinks : existingConfig.externalLinks;
        existingConfig.events = data.events !== undefined ? data.events : existingConfig.events;
        
        fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 4), 'utf8');
        return NextResponse.json({ success: true, config: existingConfig });
    } catch (error) {
        console.error("❌ خطأ أثناء الحفظ:", error.message);
        return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
    }
}