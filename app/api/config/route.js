import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. تحديد المسار المطلق (Absolute Path)
    const configPath = path.join(process.cwd(), 'config.json');
    
    console.log("--- فحص السيرفر ---");
    console.log("المسار الفعلي الذي يبحث فيه السيرفر:", configPath);
    console.log("هل الملف موجود فعلاً؟", fs.existsSync(configPath));

    try {
        if (!fs.existsSync(configPath)) {
            return NextResponse.json({ error: "الملف غير موجود في المسار: " + configPath }, { status: 404 });
        }

        const fileContents = fs.readFileSync(configPath, 'utf8');
        console.log("محتوى الملف المقروء:", fileContents);

        if (!fileContents || fileContents.trim() === "") {
            return NextResponse.json({ error: "الملف موجود لكنه فارغ!" }, { status: 500 });
        }

        return NextResponse.json(JSON.parse(fileContents));
    } catch (error) {
        console.error("خطأ JSON:", error.message);
        return NextResponse.json({ error: "خطأ في قراءة JSON: " + error.message }, { status: 500 });
    }
}