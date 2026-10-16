# DeepX — Project brief

Updated: 2026-10-16 (Asia/Bangkok). Source: project owner's Business Model Canvas,
three supplied mockups, and subsequent instructions in the initiating chat.

## Identity and purpose

DeepX เชื่อมงานวิจัย AI / Data Model กับงานพัฒนาระบบ เพื่อให้เทคโนโลยีที่ซับซ้อน
กลายเป็นเครื่องมือที่องค์กรใช้งานและประเมินผลได้จริง

กลุ่มหลักคือองค์กร B2B และ SMEs ขนาดใหญ่ที่มีข้อมูลหรือกระบวนการซับซ้อน
กลุ่มรองคือหน่วยงานรัฐ สถาบันวิจัย และนักวิจัยที่ร่วมโครงการ

## Business Model Canvas

| องค์ประกอบ | เนื้อหาที่เจ้าของโครงการกำหนด |
| --- | --- |
| Key Partners | นักวิจัย/มหาวิทยาลัยแบบ project-based; หน่วยงานให้ทุน เช่น NIA และ บพข.; Cloud & Infrastructure Providers เช่น AWS และ Google Cloud |
| Key Activities | R&D และพัฒนาโมเดล; Solution Engineering/Integration โดย Dev, BA, PM; ขอทุนวิจัยและขายโซลูชันองค์กร |
| Key Resources | โมเดล สถาปัตยกรรม และ IP ของบริษัท; ทีมแกนหลัก 3–4 คน; เครือข่ายนักวิจัยเฉพาะทาง |
| Value Propositions | Complex to Simple; โซลูชันเฉพาะโจทย์; มุ่งเพิ่มประสิทธิภาพ ลดต้นทุน และความแม่นยำที่ประเมินได้ |
| Customer Relationships | Co-creation ตั้งแต่ PoC ถึงส่งมอบ; Account Management และ Customer Success; ต่อยอดสัญญาตามคุณค่าที่พิสูจน์ได้ |
| Channels | Direct Enterprise Sales; เครือข่ายทุนและวิชาการ; Thought Leadership และกรณีศึกษาที่ได้รับอนุมัติ |
| Customer Segments | B2B Enterprises / Large SMEs; อุตสาหกรรม โลจิสติกส์ เกษตรอัจฉริยะ; หน่วยงานรัฐและวิจัย |
| Cost Structure | Cloud/API/R&D; ค่านักวิจัยตามโครงการ (ตัวอย่างสัดส่วน 1/3 เป็นแนวคิด ไม่ใช่อัตราที่ตกลงแล้ว); ค่าใช้จ่ายทีมและการขาย |
| Revenue Streams | ทุนวิจัย; Custom Solutions / PoC; Subscription / SaaS ในอนาคต |

ชื่อหน่วยงานและผู้ให้บริการข้างต้นเป็นตัวอย่างในโมเดลธุรกิจ ไม่ใช่รายชื่อพันธมิตร
หรือลูกค้าที่ได้รับการยืนยัน รายได้ SaaS เป็นทิศทางอนาคต ไม่ใช่ผลิตภัณฑ์ที่เปิดขายแล้ว
ต้นทุน สัดส่วนรายได้ และขนาดทีมใช้เพื่อวางแผน ไม่แสดงบนหน้า marketing

## Website v1

เป้าหมายคือให้ผู้บริหาร ทีมธุรกิจ และทีมวิจัยเข้าใจว่า DeepX ทำอะไร เหมาะกับโจทย์ใด
ทำงานอย่างไร และเริ่มสนทนากับทีมได้ทางไหน

ลำดับหน้า: header → hero → expertise strip → capabilities → industries →
process → illustrative applications / verified case studies → why DeepX →
ecosystem / verified partners → contact CTA → footer

เนื้อหาจริงอ่านจาก Supabase, ภาษาไทยเป็นค่าเริ่มต้น, สลับ TH/EN และจดจำใน
`deepx.locale`. เมนูไปยัง section, รายละเอียดเปิดใน dialog ที่ใช้ keyboard ได้,
การ์ดมือถือเลื่อนด้วย swipe หรือปุ่ม, CTA เปิดช่องทางติดต่อจริง

### CMS v1

เจ้าของขยายขอบเขตให้สร้าง CMS ในรอบแรก เพื่อแก้เนื้อหาเว็บไซต์ได้โดยไม่แก้โค้ด
หน้า `/admin` รองรับเนื้อหาสองภาษา เมนู รูปภาพ ลำดับรายการ ผลงาน และพันธมิตร
พร้อมบันทึกฉบับร่างบนเซิร์ฟเวอร์ ตัวอย่างผ่าน renderer หน้าบ้าน และเผยแพร่ทั้งชุด
บัญชีต้องยืนยันอีเมลและได้รับสิทธิ์จาก allowlist; มี revision checks และประวัติการบันทึก

นำแนวทาง Mongkol Wela มาใช้เฉพาะ ownership, สิทธิ์, draft/live, clear semantics,
save/reopen/public read-back และการไม่ให้ seed ทับข้อมูลจริง ไม่ย้ายโมดูลเฉพาะธุรกิจ
ของต้นแบบมา DeepX ดู field coverage และข้อจำกัดใน [CMS.md](CMS.md)
สถานะการทดสอบและการปล่อยงานอยู่ใน [RELEASE.md](RELEASE.md)

### Contact source of truth

เจ้าของกำหนด Email `DeepX@deepxtech.com`, LINE `@DeepX`, website
`https://deepx.tech`, LinkedIn `https://www.linkedin.com/company/deepx`.
เก็บในแถว `website_content.site` และให้ component อ่านจากข้อมูลนี้เท่านั้น
LINE URL แปลงจาก handle ที่ผู้ใช้ระบุ; ไม่ยืนยันความเป็นเจ้าของบัญชีผ่านการส่งข้อความ

## Design adaptation

| คงจาก mockup | ปรับเพื่อเว็บจริง |
| --- | --- |
| พื้นกรมท่า, cyan/blue, neural X, เส้นขอบบางและ glow | วาด neural X เป็น SVG เบาและคมทุกขนาด; รองรับ reduced motion |
| Hero ซ้ายข้อความ ขวา mesh; ลำดับเนื้อหาครบหน้า | ข้อความไทยต้องมีความสูงและจังหวะบรรทัดที่อ่านได้ |
| Desktop 5 capability cards, 4 industry cards | Tablet 2 คอลัมน์และใบสุดท้ายเต็มแถว; มือถือการ์ดเลื่อนพร้อมปุ่มและ dots |
| Timeline 5 ขั้น; แถบ CTA มือถือ | ปุ่มเปิดคำอธิบายจริง; CTA ล่างซ่อนเมื่อ hero/contact อยู่ในจอ |
| พื้นที่ผลลัพธ์และเครือข่ายความร่วมมือ | ไม่มีตัวเลข 99.2%, +50% หรือโลโก้สถาบันจนกว่าจะมีหลักฐาน; ใช้ตัวอย่างการประยุกต์และประเภทความร่วมมือแทน |
| ติดต่อและ footer | ใช้ช่องทางเจ้าของกำหนด; ไม่มี newsletter หรือ social link ที่ใช้งานไม่ได้ |

ไม่มีการอ้าง pixel-perfect parity. ภาพ mockup รวมกรอบอุปกรณ์และคำอธิบาย;
สัดส่วน CSS เป็นการแปลจากพื้นที่เว็บไซต์ด้านใน ไม่ใช่การวัดตรงจากภาพทั้งแผ่น

## Next phases

1. ต่อยอด CMS ตามความจำเป็น: approval/advanced roles, scheduled publishing,
   revision restore และคลังสื่อเต็มรูปแบบ หลังมีสัญญาสิทธิ์และการทดสอบเฉพาะส่วน
2. ลงผลงานจริงพร้อมวิธีวัดผล และโลโก้พันธมิตรที่ได้รับอนุญาต
3. หน้า insights/case study แบบ URL เฉพาะและ server rendering ตามความต้องการ SEO
4. Custom domain `deepx.tech`: ตรวจ ownership และ DNS แยกจาก Vercel deployment
5. Lead form/CRM: นิยามการจัดเก็บ ระยะเวลาเก็บ ความยินยอม และ anti-spam ก่อนทำ

ยังไม่รวม: สมาชิกสาธารณะ, CRM, อีคอมเมิร์ซ, งานระบบ AI ของลูกค้า หรือ SaaS product
CMS ปัจจุบันเป็น structured content editor; โครงหน้า สี ฟอนต์ และลำดับ section หลัก
ยังอยู่ในโค้ด ไม่ใช่ page builder อิสระ
