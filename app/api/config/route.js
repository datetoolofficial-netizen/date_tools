import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// هذه هي الإعدادات الافتراضية السليمة 100%
const defaultConfig = {
  toolDisplayName: "أدوات التاريخ الشاملة",
  toolSlogan: "احسب عمرك وحول التواريخ بدقة",
  hasLogo: false,
  logoUrl: "",
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

export async function GET() {
    const configPath = path.join(process.cwd(), 'config.json');
    
    try {
        // 1. إذا كان الملف غير موجود نهائياً، قم بإنشائه تلقائياً
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), 'utf8');
            return NextResponse.json(defaultConfig);
        }

        const fileContents = fs.readFileSync(configPath, 'utf8');
        
        // 2. إذا كان الملف فارغاً، قم بتعبئته تلقائياً
        if (!fileContents || fileContents.trim() === "") {
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), 'utf8');
            return NextResponse.json(defaultConfig);
        }

        // 3. قراءة الملف الطبيعية
        const parsedData = JSON.parse(fileContents);
        return NextResponse.json(parsedData);

    } catch (error) {
        // 4. السحر هنا: لو كان هناك أي خطأ (فاصلة زائدة، تنسيق خربان) سيصلحه تلقائياً!
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), 'utf8');
        return NextResponse.json(defaultConfig);
    }
}

export async function POST(request) {
    try {
        const configPath = path.join(process.cwd(), 'config.json');
        const newData = await request.json();
        
        let existingConfig = defaultConfig;
        if (fs.existsSync(configPath)) {
            try {
                const fileContents = fs.readFileSync(configPath, 'utf8');
                existingConfig = JSON.parse(fileContents);
            } catch(e) {
                // تجاهل أي خطأ أثناء الحفظ واستخدم الافتراضي للدمج
            }
        }
        
        const updatedConfig = { ...existingConfig, ...newData };
        fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 4), 'utf8');
        
        return NextResponse.json({ success: true, config: updatedConfig });
    } catch (error) {
        return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
    }
}