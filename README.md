# DeepX

เว็บไซต์บริษัท Deep Tech / AI Solutions จากงานวิจัยสู่การใช้งานจริงสำหรับองค์กร

เว็บไซต์: [deepxsolution.com](https://deepxsolution.com)
· CMS: [เข้าสู่ระบบผู้ดูแล](https://deepxsolution.com/admin)

## เริ่มอ่าน

- [Project brief](docs/PROJECT_BRIEF.md) — Business Model Canvas, ขอบเขตเว็บไซต์, mockup และข้อเท็จจริงที่เผยแพร่ได้
- [Project map](docs/PROJECT_MAP.md) — โครงสร้างโค้ด, ข้อมูลสำหรับ CMS, คำสั่ง, สิทธิ์ฐานข้อมูล
- [คู่มือ CMS](docs/CMS.md) — เข้าใช้งาน `/admin`, แก้เนื้อหาไทย–อังกฤษ, บันทึกร่าง และเผยแพร่
- [Release runbook](docs/RELEASE.md) — การเชื่อม Supabase/Vercel, verification และสถานะล่าสุด
- [Asset sources](docs/ASSETS.md) — ภาพอ้างอิงและสิทธิ์ภาพประกอบ
- [SEO และ Google Search Console](docs/SEO.md) — metadata จาก CMS, sitemap, canonical และการส่งเว็บเข้า Google

## นโยบาย push / deploy

ตั้งแต่ 17 ตุลาคม 2026 **ห้าม push หรือ deploy อัตโนมัติ** ต้องรอคำสั่งชัดเจน
จากเจ้าของสำหรับงานแต่ละรอบ คำอนุญาตในรอบก่อนใช้ต่อกับงานใหม่ไม่ได้
เมื่อแก้และตรวจงานเสร็จ ให้รายงานว่าพร้อมแล้วและรอคำสั่ง; สั่ง push อย่างเดียว
ไม่เท่ากับอนุญาต deploy ดูกฎที่ [AGENTS.md](AGENTS.md) และ [Release runbook](docs/RELEASE.md)

## Development

Node.js 22.12+ (แนะนำ Node 24 LTS), npm และ Supabase CLI

```sh
npm ci
cp .env.example .env.local
# กรอก public publishable key ใน .env.local
npm run dev
```

Production content อ่านจาก Supabase เท่านั้น ไม่มี business copy ฝังใน React components
และไม่มี seed fallback บน production

เว็บไซต์อยู่ที่ `/` และ CMS อยู่ที่ `/admin` การเข้าสู่ระบบเพียงอย่างเดียวไม่ให้สิทธิ์แก้เว็บ:
บัญชีต้องยืนยันอีเมลและอยู่ใน allowlist ของผู้ดูแลที่ตั้งฝั่งฐานข้อมูลด้วย
ฉบับร่างเก็บบนเซิร์ฟเวอร์ แยกจากข้อมูลเผยแพร่ พร้อมตรวจ revision ก่อนบันทึกหรือเผยแพร่

CMS แก้รูปอุตสาหกรรมพร้อม alt text สองภาษา และวิดีโอ/ภาพปก Hero ได้
อัปโหลดรูปได้ไม่เกิน 5 MiB และ MP4 ไม่เกิน 30 MiB; สื่อแต่ละไฟล์มี URL สาธารณะใหม่
การอัปโหลดไม่เผยแพร่หน้าเว็บจนกว่าจะบันทึกและกดเผยแพร่ฉบับร่าง

```sh
npm run typecheck
npm run test:content
npm run build
npm run preview
```

Build ต้องอ่าน published content จากฐานข้อมูลได้ เพื่อสร้าง metadata ที่ตรงกับ CMS
เนื้อหาในหน้าอ่านใหม่เมื่อโหลดเว็บ แต่ SEO/social metadata เป็นข้อมูลตอน build;
แก้ metadata ใน CMS แล้วต้อง build/deploy ใหม่ ปุ่มเผยแพร่ไม่สั่ง deploy อัตโนมัติ

กรณีตรวจ UI ก่อนฐานข้อมูลพร้อม สามารถใช้ข้อมูล editorial seed เฉพาะเครื่อง:

```sh
VITE_LOCAL_CONTENT_PREVIEW=1 npm run dev
```

โหมดนี้ถูกปฏิเสธเมื่อ production build และต้องไม่ตั้งบน Vercel

## ข้อมูลโครงการ

- GitHub: <https://github.com/purichw/DeepX>
- Supabase: `yazamwbukbtetzqmqcpm`
- Production: [deepxsolution.com](https://deepxsolution.com); `www.deepxsolution.com` และ `deepxtech.vercel.app` redirect 308 มาที่โดเมนหลัก โดยคง path/query; ดูหลักฐานใน [Release runbook](docs/RELEASE.md)
- ข้อมูลช่องทางติดต่อใน CMS แยกจากการตั้งค่าโดเมน: รอบเชื่อมโดเมนนี้ไม่ได้เปลี่ยนอีเมลหรือเนื้อหาที่เผยแพร่
- ภาษาเริ่มต้น: ไทย; รองรับ EN และจดจำภาษาบนเบราว์เซอร์

ไม่ commit `.env.local`, `.vercel`, credentials, `dist/`, หรือ artifacts การตรวจ UI
รวมถึงอีเมลผู้ดูแลส่วนบุคคลและข้อมูล session การเข้าสู่ระบบ
CMS รองรับเนื้อหาเว็บไซต์ ผลงาน และพันธมิตร; ยังไม่มีระบบสมาชิกสาธารณะหรือแบบฟอร์มรับ lead
