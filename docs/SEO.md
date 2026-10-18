# SEO และ Google Search Console

เว็บไซต์หลักคือ `https://deepxsolution.com/` มี public URL เดียวใน sitemap;
เมนู `#capabilities`, `#industries` และส่วนอื่นเป็น anchor ในหน้าเดียวกัน
ไม่ใช่หน้าแยก ห้ามเพิ่ม anchor, หน้า `/admin` หรือภาษา EN ที่ยังไม่มี URL แยกลง sitemap

## สิ่งที่ระบบสร้าง

- `scripts/seo.ts` สร้าง canonical, Open Graph, Twitter Card และ JSON-LD
  `Organization` / `WebSite` จาก published CMS ที่ผ่าน validation ระหว่าง build
- ชื่อแบรนด์, title/description, อีเมลและ LinkedIn ใช้ `content.site`;
  ภาพ social ใช้ `content.hero.videoPoster` หากมี การล้างค่าทางเลือกไม่ฟื้น fixture
- ภาษาเริ่มต้นจาก CMS กำหนด `html lang`, `og:locale` และ `inLanguage`
  ปุ่มเปลี่ยนภาษายังคงทำงานในหน้าเดียวกัน ไม่อ้าง `hreflang` ไปยังหน้าที่ไม่มีจริง
- Canonical เป็น deployment configuration แยกจากลิงก์ช่องทางเว็บไซต์ที่แก้ใน CMS
  หากย้ายโดเมน ต้องปรับ `scripts/seo.ts`, `public/sitemap.xml`, `public/robots.txt`,
  Vercel domains และ Supabase Auth redirects ให้ตรงกัน
- `public/robots.txt` อนุญาต crawl และชี้ไป `https://deepxsolution.com/sitemap.xml`
  ไม่ใส่ lastmod ปลอมตามเวลา build เพราะไม่ได้หมายความว่าเนื้อหาเปลี่ยนทุกครั้ง
- Vercel ส่ง `X-Robots-Tag: noindex, nofollow` สำหรับ `/admin` และเส้นทางย่อย
  ไม่บล็อก crawl ด้วย robots.txt เพื่อให้ crawler อ่านคำสั่ง noindex ได้
  คำสั่งนี้ไม่ใช่ระบบสิทธิ์: Supabase Auth/allowlist และ RLS ยังคงเป็นตัวควบคุมสิทธิ์
- `index.html` มี public Google verification meta tag สำหรับเจ้าของเว็บไซต์
  เก็บไว้หลังยืนยันสำเร็จ หากเปลี่ยนบัญชีเจ้าของ ให้ยืนยันวิธีใหม่ก่อนเปลี่ยนค่า
- Favicon ประกาศใน HTML ตั้งแต่ก่อนรัน JavaScript: `/favicon.png` ขนาด 192×192
  และ `/favicon.ico` ขนาด 16/32/48 พิกเซล ทั้งสอง export จาก `public/favicon.svg`
  ซึ่งเป็นต้นฉบับสัญลักษณ์ DeepX เดิม ไม่เปลี่ยน URL ไฟล์บ่อย และต้องเปิดให้
  Googlebot-Image เข้าถึงได้ การเปลี่ยนไอคอนต้อง export ทั้งสองไฟล์และ deploy

ไม่มีการเปลี่ยนข้อความธุรกิจหรือหน้าตา desktop/mobile ในรอบ SEO นี้
เว็บไซต์ยัง render เนื้อหาหลักด้วย JavaScript จาก CMS; ใช้ URL Inspection แบบ live
ตรวจว่า Google render ได้จริงเมื่อวินิจฉัยปัญหา indexing ไม่อาศัย Lighthouse อย่างเดียว

## ตรวจและเผยแพร่

```sh
npm run test:seo
npm run build
git diff --check
```

ใช้ release runbook สำหรับ deploy; ตรวจ response จริงของ `/`, `/admin`,
`/robots.txt`, `/sitemap.xml` และ legacy redirects หลัง deploy
คะแนน SEO วัดด้วย Lighthouse โดยแยก mobile/desktop และเก็บวันที่/เวอร์ชัน/รายงาน:

```sh
npx --yes lighthouse https://deepxsolution.com/ --only-categories=seo --chrome-flags='--headless' --output=json --output=html --output-path=artifacts/seo-mobile --quiet
npx --yes lighthouse https://deepxsolution.com/ --only-categories=seo --preset=desktop --chrome-flags='--headless' --output=json --output=html --output-path=artifacts/seo-desktop --quiet
```

SEO 100/100 คือผ่าน automated audits ในหมวด SEO ของ Lighthouse เวอร์ชันที่วัด
ไม่ใช่คะแนนจัดอันดับของ Google และไม่รับประกันอันดับหรือการ index
อย่าอ้างว่าผ่าน Performance/Accessibility/Best Practices เมื่อวัดเฉพาะ SEO

## ส่งเว็บเข้า Google

1. เปิด Search Console ของ property `https://deepxsolution.com/` ด้วยบัญชีเจ้าของ
2. ยืนยันผ่าน HTML meta tag ที่ Google ออกให้และเว็บ production ส่งกลับจริง
3. ส่ง `https://deepxsolution.com/sitemap.xml` ใน Sitemaps แล้วตรวจสถานะการอ่าน
4. ตรวจ URL หน้าแรกด้วย URL Inspection และ Test live URL; ถ้าเข้าถึง/จัดทำดัชนีได้
   ให้ Request indexing แล้วบันทึกผลที่ Google ตอบกลับ
5. แยกสถานะ verified / sitemap submitted / indexing requested / indexed ให้ชัด
   การส่งคำขอสำเร็จไม่เท่ากับ Google จัดทำดัชนีแล้ว; ดู Page indexing ภายหลัง

การแก้ metadata/social/JSON-LD ใน CMS ต้องเผยแพร่แล้ว rebuild/deploy ใหม่
ปุ่มเผยแพร่ CMS ไม่ได้สั่ง deploy หรือส่งคำขอ indexing อัตโนมัติ
ผลรอบล่าสุดอยู่ใน `docs/RELEASE.md` ไม่ถือเอกสารนี้เป็นสถานะ Google แบบ realtime

## ไอคอนในผลค้นหา

ผลค้นหาใช้ favicon ของ hostname ไม่ใช่ภาพ Open Graph หรือโลโก้ใน JSON-LD
ก่อนเผยแพร่การแก้ favicon ให้ตรวจไฟล์ใน `dist/` และ `<link rel="icon">`
หลัง deploy ตรวจว่า `/favicon.png` และ `/favicon.ico` ตอบ 200 พร้อม image MIME type
และไม่มี `noindex` หรือ robots.txt ปิดกั้น จากนั้นขอ Request indexing ของหน้าแรก
ผ่าน Search Console ได้ การเปลี่ยนผลค้นหาขึ้นกับรอบ crawl ของ Google ซึ่งอาจใช้
หลายวันถึงหลายสัปดาห์ และไม่รับประกันว่าจะมีไอคอนแม้ตั้งค่าครบ

อ้างอิง: [Google favicon guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search).

อ้างอิง: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization),
[Google indexing FAQ](https://developers.google.com/search/help/crawling-index-faq).
