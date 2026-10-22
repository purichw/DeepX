import type { SiteData } from "../content";

export type Path = Array<string | number>;
export type Workspace = {
  document: SiteData;
  revision: number;
  published_revision: number;
  updated_at: string;
};
export const sections = [
  {
    key: "site",
    title: "เว็บไซต์และช่องทางติดต่อ",
    description: "ชื่อแบรนด์ เมนู ข้อมูลค้นหา และช่องทางติดต่อ",
    icon: "settings",
  },
  {
    key: "hero",
    title: "ส่วนเปิดหน้าเว็บ",
    description: "หัวเรื่องหลัก คำโปรย และข้อความประกอบภาพ",
    icon: "layout",
  },
  {
    key: "capabilities",
    title: "ความเชี่ยวชาญ",
    description: "บริการและรายละเอียดความสามารถของทีม",
    icon: "layers",
  },
  {
    key: "industries",
    title: "อุตสาหกรรม",
    description: "กลุ่มอุตสาหกรรม รูปภาพ และรายละเอียดการประยุกต์ใช้",
    icon: "image",
  },
  {
    key: "process",
    title: "ขั้นตอนการทำงาน",
    description: "ลำดับขั้นตอนตั้งแต่ค้นหาโจทย์จนถึงขยายผล",
    icon: "list",
  },
  {
    key: "applications",
    title: "ตัวอย่างการประยุกต์ใช้",
    description: "แนวทางที่เป็นไปได้ แสดงเมื่อยังไม่มีผลงานจริง",
    icon: "layers",
  },
  {
    key: "case_studies",
    title: "ผลงานจริง",
    description: "โครงการที่ได้รับอนุมัติให้เผยแพร่ พร้อมหลักฐานผลลัพธ์",
    icon: "briefcase",
  },
  {
    key: "caseStudies",
    title: "หัวข้อผลงาน",
    description: "ข้อความนำส่วนผลงานจริงบนหน้าเว็บไซต์",
    icon: "type",
  },
  {
    key: "why",
    title: "จุดเด่นของเรา",
    description: "เหตุผลและคุณค่าของการทำงานร่วมกัน",
    icon: "layers",
  },
  {
    key: "ecosystem",
    title: "เครือข่ายความร่วมมือ",
    description: "รูปแบบความร่วมมือและรายละเอียดแต่ละกลุ่ม",
    icon: "users",
  },
  {
    key: "partner_records",
    title: "รายชื่อพันธมิตร",
    description: "ชื่อ โลโก้ และเว็บไซต์ของพันธมิตรที่ยืนยันแล้ว",
    icon: "users",
  },
  {
    key: "partners",
    title: "หัวข้อพันธมิตร",
    description: "ข้อความนำเมื่อมีรายชื่อพันธมิตรเผยแพร่แล้ว",
    icon: "type",
  },
  {
    key: "contact",
    title: "ส่วนชวนติดต่อ",
    description: "ข้อความท้ายหน้าและข้อความนำก่อนติดต่อทีม",
    icon: "mail",
  },
  {
    key: "insights",
    title: "มุมมองและความรู้",
    description: "บทความสั้นที่เปิดจากเมนูมุมมองของเรา",
    icon: "type",
  },
  {
    key: "privacy",
    title: "ความเป็นส่วนตัว",
    description: "คำอธิบายการใช้ข้อมูลของเว็บไซต์",
    icon: "shield",
  },
  {
    key: "ui",
    title: "ข้อความปุ่มและส่วนกลาง",
    description: "ปุ่ม การนำทาง และคำแนะนำภาษาไทย–อังกฤษ",
    icon: "type",
  },
] as const;

export const studioSections = [
  {
    key: "studio.page",
    title: "แบรนด์ เมนู และ SEO",
    description: "ชื่อ Product Studio เมนู และข้อมูลค้นหาของ /studio",
    icon: "settings",
  },
  {
    key: "studio.hero",
    title: "ส่วนเปิดหน้า Studio",
    description: "หัวเรื่อง ภาพอุปกรณ์ และตัวเลขที่มีหลักฐานยืนยัน",
    icon: "layout",
  },
  {
    key: "studio.ecosystem",
    title: "เครือข่าย DeepX",
    description: "ข้อความแนะนำเครือข่าย ใช้รายชื่อพันธมิตรส่วนกลางร่วมกัน",
    icon: "users",
  },
  {
    key: "studio.portfolio",
    title: "ผลงานและตัวอย่าง Concept",
    description: "หมวดหมู่ รูปภาพ รายละเอียด และสถานะผลงานทั้ง 6 ประเภท",
    icon: "briefcase",
  },
  {
    key: "studio.services",
    title: "บริการของ Studio",
    description: "รายการบริการและรายละเอียดที่เปิดอ่านได้",
    icon: "layers",
  },
  {
    key: "studio.process",
    title: "กระบวนการทำงาน",
    description: "ลำดับขั้นตอน ภาพประกอบ และรายละเอียดแต่ละขั้น",
    icon: "list",
  },
  {
    key: "studio.why",
    title: "จุดเด่นและกลุ่มลูกค้า",
    description: "คุณค่าของ Studio และข้อมูลสำหรับ SME",
    icon: "layers",
  },
  {
    key: "studio.ai",
    title: "เชื่อมต่อ DeepX AI",
    description: "ความสามารถ AI เสริมและลิงก์กลับไป DeepX",
    icon: "layers",
  },
  {
    key: "studio.testimonials",
    title: "เสียงจากลูกค้า",
    description:
      "แสดงเฉพาะรีวิวที่ได้รับอนุญาตและยืนยันแล้ว ปิดส่วนนี้ได้เมื่อยังไม่มี",
    icon: "users",
  },
  {
    key: "studio.contact",
    title: "ส่วนชวนติดต่อ Studio",
    description: "ข้อความและภาพท้ายหน้า ช่องทางติดต่อใช้ค่าร่วมกับ DeepX",
    icon: "mail",
  },
  {
    key: "studio.footer",
    title: "ท้ายหน้า Studio",
    description: "คำอธิบายและกลุ่มลิงก์ท้ายหน้า",
    icon: "list",
  },
  {
    key: "studio.ui",
    title: "ข้อความปุ่มของ Studio",
    description: "ป้ายสถานะ ตัวกรอง และข้อความปุ่มภาษาไทย–อังกฤษ",
    icon: "type",
  },
] as const;

export function sectionPath(key: string): Path {
  if (key.startsWith("studio.")) return ["content", "studio", key.slice(7)];
  return key === "case_studies"
    ? ["case_studies"]
    : key === "partner_records"
      ? ["partners"]
      : ["content", key];
}
// Keep legacy/reserved values in the saved document without presenting controls
// that promise a public change the current renderer cannot produce.
export function reservedField(path: Path): boolean {
  if (path.join(".") === "content.studio.ui.services") return true;
  if (path[0] !== "content") return false;
  const section = path[1];
  const field = path.at(-1);
  if (path.length === 3) {
    if (
      field === "description" &&
      [
        "hero",
        "industries",
        "partners",
        "contact",
        "insights",
        "privacy",
      ].includes(String(section))
    )
      return true;
    if (
      field === "eyebrow" &&
      ["partners", "insights", "privacy"].includes(String(section))
    )
      return true;
    if (section === "ui" && ["viewAll", "back"].includes(String(field)))
      return true;
  }
  if (path[2] === "items" && path.length === 5) {
    if (
      field === "icon" &&
      ["process", "applications", "industries"].includes(String(section))
    )
      return true;
    if (field === "description" && section === "why") return true;
  }
  return false;
}
export function getAt(value: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (current, key) => (current as Record<string | number, unknown>)[key],
    value,
  );
}
export function setAt<T>(document: T, path: Path, value: unknown): T {
  const copy = structuredClone(document);
  let current = copy as Record<string | number, unknown>;
  for (const part of path.slice(0, -1))
    current = current[part] as Record<string | number, unknown>;
  current[path[path.length - 1]] = value;
  return copy;
}
const bilingual = () => ({ th: "", en: "" });
const item = () => ({
  id: crypto.randomUUID(),
  icon: "atom",
  title: bilingual(),
  description: bilingual(),
  detail: bilingual(),
});
export function newArrayItem(path: Path): unknown {
  const last = path.at(-1);
  if (path.includes("studio")) {
    if (last === "metrics")
      return {
        id: crypto.randomUUID(),
        value: "",
        label: bilingual(),
        verified: false,
      };
    if (last === "projects")
      return {
        id: crypto.randomUUID(),
        title: bilingual(),
        description: bilingual(),
        detail: bilingual(),
        image: "",
        imageAlt: bilingual(),
        position: "50% 50%",
        category: "web",
        status: "concept",
        website: "",
      };
    if (last === "quotes")
      return {
        id: crypto.randomUUID(),
        name: "",
        role: bilingual(),
        quote: bilingual(),
        image: "",
        approved: false,
      };
    if (last === "groups")
      return { id: crypto.randomUUID(), title: bilingual(), links: [] };
    if (last === "links" || last === "navigation")
      return { label: bilingual(), href: "#studio-work" };
    if (last === "items" && path.includes("process"))
      return { ...item(), image: "", imageAlt: bilingual() };
    return item();
  }
  if (last === "case_studies")
    return {
      id: crypto.randomUUID(),
      slug: `project-${crypto.randomUUID().slice(0, 8)}`,
      title: bilingual(),
      summary: bilingual(),
      sector: bilingual(),
      body: bilingual(),
      metrics: [],
    };
  if (last === "partners")
    return {
      id: crypto.randomUUID(),
      name: "",
      logo_url: "",
      website_url: "",
      surface: "dark",
    };
  if (last === "navigation") return { label: bilingual(), href: "#home" };
  if (last === "fields" || last === "outcomes") return bilingual();
  if (last === "metrics") return { value: "", label: bilingual() };
  if (path.includes("industries"))
    return { ...item(), image: "", imageAlt: bilingual(), position: "50% 50%" };
  if (path.includes("applications"))
    return { ...item(), sector: bilingual(), outcomes: [] };
  return item();
}
export const labels: Record<string, string> = {
  unit: "ชื่อหน่วยธุรกิจ",
  aiLabel: "ปุ่มไป DeepX AI",
  closing: "หัวเรื่องบรรทัดท้าย",
  enabled: "แสดงส่วนนี้บนเว็บไซต์",
  verified: "มีหลักฐานยืนยันตัวเลขนี้แล้ว",
  approved: "ได้รับอนุญาตและยืนยันคำรีวิวแล้ว",
  filters: "ชื่อหมวดหมู่ตัวกรอง",
  all: "ทุกหมวดหมู่",
  web: "เว็บแพลตฟอร์ม",
  mobile: "แอปมือถือ",
  game: "เกมมือถือ",
  food: "ร้านอาหาร",
  business: "ระบบธุรกิจ SME",
  internal: "ระบบภายใน",
  projects: "รายการผลงาน",
  category: "หมวดหมู่ผลงาน",
  status: "สถานะผลงาน",
  focusTitle: "หัวข้อกลุ่มลูกค้า",
  focusBody: "คำอธิบายกลุ่มลูกค้า",
  ctaLabel: "ข้อความปุ่มหลัก",
  quotes: "รายการคำรีวิว",
  quote: "คำรีวิว",
  role: "ตำแหน่งและองค์กร",
  groups: "กลุ่มเมนูท้ายหน้า",
  links: "รายการลิงก์",
  work: "ปุ่มดูผลงาน",
  concept: "ป้าย Concept",
  prototype: "ป้าย Prototype",
  delivered: "ป้ายผลงานส่งมอบ",
  projectLink: "ปุ่มเว็บไซต์ผลงาน",
  services: "ป้ายบริการ",
  contactTitle: "หัวข้อติดต่อทีม",
  contactNote: "คำแนะนำก่อนติดต่อ",
  noContact: "ข้อความเมื่อยังไม่มีช่องทางติดต่อ",
  filterCount: "คำแนะนำจำนวนผลลัพธ์",
  surface: "พื้นหลังโลโก้",
  name: "ชื่อ",
  descriptor: "คำอธิบายใต้โลโก้",
  tagline: "คำขวัญ",
  title: "หัวเรื่อง",
  description: "คำอธิบาย",
  email: "อีเมล",
  line: "ชื่อบัญชี LINE",
  lineUrl: "ลิงก์ LINE",
  website: "เว็บไซต์ทางการ",
  linkedin: "ลิงก์ LinkedIn",
  defaultLocale: "ภาษาเริ่มต้น",
  navigation: "รายการเมนู",
  footerText: "ข้อความท้ายเว็บไซต์",
  copyright: "ข้อความลิขสิทธิ์",
  eyebrow: "ข้อความเหนือหัวเรื่อง",
  accent: "หัวเรื่องส่วนที่เน้น",
  body: "เนื้อหา",
  visualCaption: "คำอธิบายข้างภาพหลัก",
  videoUrl: "วิดีโอส่วนเปิดหน้าเว็บ",
  videoPoster: "ภาพปกวิดีโอ",
  trustLabel: "หัวข้อแถบความเชี่ยวชาญ",
  fields: "ข้อความในแถบความเชี่ยวชาญ",
  items: "รายการเนื้อหา",
  id: "รหัสถาวร",
  icon: "ไอคอน",
  detail: "รายละเอียดเมื่อเปิดอ่าน",
  image: "รูปภาพ",
  imageAlt: "ข้อความอธิบายรูปภาพ",
  position: "จุดโฟกัสของภาพ",
  note: "หมายเหตุ",
  sector: "กลุ่มอุตสาหกรรม",
  outcomes: "ประโยชน์ที่คาดหวัง",
  slug: "รหัสอ้างอิงผลงาน",
  summary: "สรุปผลงาน",
  metrics: "ผลลัพธ์ที่มีหลักฐาน",
  value: "ค่าผลลัพธ์",
  label: "ข้อความแสดง",
  href: "ปลายทางเมนู",
  logo_url: "โลโก้",
  website_url: "เว็บไซต์พันธมิตร",
  consultation: "ปุ่มปรึกษาโครงการ",
  capabilities: "ปุ่มดูความเชี่ยวชาญ",
  learnMore: "ปุ่มรายละเอียด",
  explore: "ปุ่มค้นหาโอกาส",
  viewAll: "ปุ่มดูทั้งหมด",
  menu: "ปุ่มเปิดเมนู",
  close: "ปุ่มปิด",
  next: "ปุ่มถัดไป",
  previous: "ปุ่มก่อนหน้า",
  slide: "คำแนะนำเลือกการ์ด",
  scroll: "คำแนะนำการเลื่อน",
  contact: "ปุ่มติดต่อทีม",
  privacy: "ลิงก์ความเป็นส่วนตัว",
  insights: "ลิงก์มุมมองของเรา",
  back: "ปุ่มกลับ",
  details: "หัวข้อรายละเอียด",
  skip: "ลิงก์ข้ามไปเนื้อหา",
  language: "ป้ายเลือกภาษา",
  ready: "ข้อความชวนติดต่อบนมือถือ",
  th: "ภาษาไทย",
  en: "English",
};
export const iconOptions = [
  ["atom", "อะตอม / วิจัย"],
  ["layers", "ชั้นข้อมูล"],
  ["settings", "เฟือง"],
  ["flask", "การทดลอง"],
  ["cloud", "คลาวด์"],
  ["factory", "โรงงาน"],
  ["truck", "รถขนส่ง"],
  ["sprout", "ต้นอ่อน"],
  ["landmark", "หน่วยงาน"],
  ["search", "ค้นหา"],
  ["code", "พัฒนาโปรแกรม"],
  ["workflow", "เชื่อมระบบ"],
  ["chart", "กราฟ"],
  ["scan", "สแกน"],
  ["target", "เป้าหมาย"],
  ["brain", "ปัญญาประดิษฐ์"],
  ["users", "ทีม"],
  ["graduation", "การศึกษา"],
  ["building", "อาคาร"],
] as const;

export const studioIconOptions = [
  ...iconOptions.filter(([key]) =>
    [
      "atom",
      "layers",
      "code",
      "workflow",
      "chart",
      "search",
      "target",
      "settings",
      "brain",
      "scan",
    ].includes(key),
  ),
  ["phone", "แอปมือถือ"],
  ["rocket", "เปิดตัว"],
  ["box", "ผลิตภัณฑ์"],
  ["shield", "คุณภาพและความปลอดภัย"],
] as const;

export function itemTitle(
  value: unknown,
  locale: "th" | "en",
  index: number,
): string {
  const record = value as Record<string, unknown>;
  if (typeof value === "string") return value || `รายการ ${index + 1}`;
  for (const key of ["title", "label", "name", locale]) {
    const candidate = record?.[key];
    if (typeof candidate === "string" && candidate) return candidate;
    if (candidate && typeof candidate === "object") {
      const translated = candidate as Record<string, string>;
      if (translated[locale] || translated.th || translated.en)
        return translated[locale] || translated.th || translated.en;
    }
  }
  return `รายการใหม่ ${index + 1}`;
}
