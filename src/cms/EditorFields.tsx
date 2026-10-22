import { useId, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import type { Locale } from "../content";
import { cmsClient } from "./client";
import {
  iconOptions,
  studioIconOptions,
  itemTitle,
  labels,
  newArrayItem,
  reservedField,
  type Path,
} from "./model";

type Props = {
  value: unknown;
  path: Path;
  locale: Locale;
  onChange: (path: Path, value: unknown) => void;
  onConfirm: (title: string, body: string, action: () => void) => void;
  onUploading: (busy: boolean) => void;
  userId: string;
};
const multiline = new Set([
  "title",
  "accent",
  "tagline",
  "description",
  "summary",
  "body",
  "detail",
  "note",
  "footerText",
  "visualCaption",
  "outcomes",
  "closing",
  "focusTitle",
  "focusBody",
  "quote",
  "contactNote",
]);

// Keep one textarea mounted while its content, language or available width changes.
function ContentTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    const fit = () => {
      if (!field.clientWidth) return; // Collapsed list entries resize when opened.
      field.style.height = "auto";
      const style = getComputedStyle(field);
      field.style.height = `${field.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)}px`;
    };
    fit();
    let width = field.clientWidth;
    const observer = new ResizeObserver(() => {
      if (field.clientWidth !== width) {
        width = field.clientWidth;
        fit();
      }
    });
    observer.observe(field);
    return () => observer.disconnect();
  }, [props.value]);
  return <textarea {...props} ref={ref} className="cms-content-textarea" />;
}

async function validateVideo(file: File): Promise<void> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  try {
    await new Promise<void>((resolve, reject) => {
      const deadline = setTimeout(
        () => reject(new Error("Video metadata timed out")),
        8000,
      );
      video.onloadedmetadata = () => {
        clearTimeout(deadline);
        if (video.videoWidth > 0 && video.videoHeight > 0) resolve();
        else reject(new Error("Missing video track"));
      };
      video.onerror = () => {
        clearTimeout(deadline);
        reject(new Error("Unsupported video"));
      };
      video.src = objectUrl;
    });
  } finally {
    video.onloadedmetadata = null;
    video.onerror = null;
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

function MediaField({
  value,
  path,
  onChange,
  onUploading,
  userId,
}: Props & { value: string }) {
  const inputId = useId();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState(false);
  const label = labels[String(path.at(-1))];
  const isVideo = path.at(-1) === "videoUrl";
  const bucket = isVideo ? "cms-video" : "cms-media";
  async function upload(file?: File) {
    if (!file || !cmsClient) return;
    setError("");
    const types: Record<string, string> = isVideo
      ? { "video/mp4": "mp4" }
      : {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };
    if (!types[file.type] || file.size > (isVideo ? 30 : 5) * 1024 * 1024) {
      setError(
        isVideo
          ? "เลือกวิดีโอ MP4 ขนาดไม่เกิน 30 MB"
          : "เลือกรูป JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB",
      );
      return;
    }
    setBusy(true);
    onUploading(true);
    try {
      if (isVideo) await validateVideo(file);
      else {
        const decoded = await createImageBitmap(file);
        decoded.close();
      }
      const name = `${userId}/${crypto.randomUUID()}.${types[file.type]}`;
      const { error: uploadError } = await cmsClient.storage
        .from(bucket)
        .upload(name, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      const { data } = cmsClient.storage.from(bucket).getPublicUrl(name);
      onChange(path, data.publicUrl);
      setBroken(false);
    } catch {
      setError(
        "อัปโหลดไม่สำเร็จ สื่อเดิมยังอยู่ กรุณาตรวจไฟล์ การเชื่อมต่อและสิทธิ์แล้วลองอีกครั้ง",
      );
    } finally {
      setBusy(false);
      onUploading(false);
    }
  }
  return (
    <div className="cms-field cms-media-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="cms-media-control">
        <div className="cms-media-preview">
          {value && !broken ? (
            isVideo ? (
              <video
                key={value}
                src={value}
                aria-label="วิดีโอที่เลือกไว้"
                controls
                muted
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={() => setBroken(true)}
              />
            ) : (
              <img
                key={value}
                src={value}
                alt="ภาพที่เลือกไว้"
                onError={() => setBroken(true)}
              />
            )
          ) : (
            <span>
              {isVideo ? <Video size={26} /> : <ImagePlus size={26} />}
              {value
                ? "โหลดตัวอย่างสื่อไม่ได้"
                : isVideo
                  ? "ยังไม่ได้เลือกวิดีโอ"
                  : "ยังไม่ได้เลือกรูปภาพ"}
            </span>
          )}
        </div>
        <input
          id={inputId}
          type="text"
          value={value}
          placeholder={
            isVideo ? "https://… หรือ /videos/…mp4" : "https://… หรือ /images/…"
          }
          onChange={(event) => {
            onChange(path, event.target.value);
            setBroken(false);
          }}
        />
        <div className="cms-media-actions">
          <label className="cms-button cms-upload">
            <Upload size={16} />
            {busy ? "กำลังอัปโหลด…" : isVideo ? "อัปโหลดวิดีโอ" : "อัปโหลดรูป"}
            <input
              type="file"
              accept={
                isVideo ? "video/mp4,.mp4" : "image/jpeg,image/png,image/webp"
              }
              disabled={busy}
              onChange={(event) => {
                void upload(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {["image", "videoPoster", "videoUrl"].includes(String(path.at(-1))) &&
            value && (
              <button
                type="button"
                className="cms-button cms-quiet"
                onClick={() => {
                  onChange(path, "");
                  setBroken(false);
                }}
              >
                <X size={16} />
                {isVideo ? "นำวิดีโอออก" : "นำรูปออก"}
              </button>
            )}
        </div>
        <p className="cms-helper">
          {isVideo
            ? "MP4 · ไม่เกิน 30 MB · แนะนำวิดีโอแนวนอนแบบไม่มีเสียง"
            : "JPG, PNG, WebP · ไม่เกิน 5 MB"}
          {" · ไฟล์ที่อัปโหลดมี URL สาธารณะ ใช้เฉพาะสื่อที่เผยแพร่ได้"}
          {isVideo && " · ล้างค่าเพื่อนำวิดีโอออกจากส่วนเปิดหน้าเว็บ"}
        </p>
        {error && (
          <p className="cms-inline-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function EditorFields(props: Props) {
  const { value, path, locale, onChange, onConfirm } = props;
  const inputId = useId();
  const key = String(path.at(-1));
  const label = labels[key] || "เนื้อหา";

  if (Array.isArray(value)) {
    const hasMinimum = key === "items" && !path.includes("studio");
    const add = () => onChange(path, [...value, newArrayItem(path)]);
    const move = (index: number, offset: number) => {
      const next = [...value];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      onChange(path, next);
    };
    return (
      <section className="cms-array">
        <div className="cms-array-heading">
          <div>
            <h3>
              {key === "case_studies"
                ? "ผลงานที่เผยแพร่พร้อมเว็บไซต์"
                : key === "partners"
                  ? "พันธมิตรที่เผยแพร่พร้อมเว็บไซต์"
                  : label}
            </h3>
            <p>{value.length} รายการ · เรียงตามลำดับที่แสดงบนเว็บไซต์</p>
          </div>
          <button type="button" className="cms-button" onClick={add}>
            <Plus size={16} />
            เพิ่มรายการ
          </button>
        </div>
        {value.length === 0 && (
          <div className="cms-empty">
            <p>ยังไม่มีรายการ</p>
            <span>
              {key === "case_studies" || key === "partners"
                ? "เพิ่มเฉพาะข้อมูลจริงที่ได้รับอนุมัติให้เผยแพร่"
                : "เพิ่มรายการแรกเพื่อเริ่มต้น"}
            </span>
          </div>
        )}
        <div className="cms-array-list">
          {value.map((entry, index) => {
            const record = entry as Record<string, unknown>;
            const title = itemTitle(entry, locale, index);
            return (
              <details
                className="cms-entry"
                key={typeof record?.id === "string" ? record.id : index}
              >
                <summary>
                  <span className="cms-order">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="cms-entry-title">{title}</span>
                  <ChevronDown size={16} />
                </summary>
                <div className="cms-entry-content">
                  <div className="cms-entry-tools">
                    <span>จัดลำดับรายการ</span>
                    <button
                      type="button"
                      className="cms-icon-button"
                      disabled={index === 0}
                      aria-label={`เลื่อน ${title} ขึ้น`}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      type="button"
                      className="cms-icon-button"
                      disabled={index === value.length - 1}
                      aria-label={`เลื่อน ${title} ลง`}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown size={17} />
                    </button>
                    <button
                      type="button"
                      className="cms-button cms-danger"
                      disabled={hasMinimum && value.length === 1}
                      title={
                        hasMinimum && value.length === 1
                          ? "ส่วนนี้ต้องมีอย่างน้อย 1 รายการ"
                          : undefined
                      }
                      onClick={() =>
                        onConfirm(
                          "นำรายการออกจากฉบับร่าง?",
                          `“${title}” จะถูกนำออกเมื่อบันทึกฉบับร่าง เว็บไซต์จริงจะเปลี่ยนเมื่อกดเผยแพร่`,
                          () =>
                            onChange(
                              path,
                              value.filter((_, i) => i !== index),
                            ),
                        )
                      }
                    >
                      <Trash2 size={15} />
                      นำออก
                    </button>
                  </div>
                  <EditorFields
                    {...props}
                    value={entry}
                    path={[...path, index]}
                  />
                </div>
              </details>
            );
          })}
        </div>
      </section>
    );
  }
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (typeof record.th === "string" && typeof record.en === "string") {
      const name =
        typeof path.at(-1) === "number"
          ? labels[String(path.at(-2))] || "ข้อความ"
          : label;
      // Field type stays stable while typing, preserving focus and caret.
      const isMulti = multiline.has(key) || typeof path.at(-1) === "number";
      const common = {
        id: inputId,
        "aria-describedby": `${inputId}-hint`,
        value: String(record[locale]),
        lang: locale,
        onChange: (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onChange([...path, locale], event.target.value),
      };
      return (
        <div className="cms-field">
          <label htmlFor={inputId}>
            {name}{" "}
            <span className="cms-language-badge">
              {locale === "th" ? "ไทย" : "EN"}
            </span>
          </label>
          {isMulti ? (
            <ContentTextarea
              {...common}
              rows={key === "detail" || key === "body" ? 3 : 1}
            />
          ) : (
            <input {...common} type="text" />
          )}
          <p className="cms-helper" id={`${inputId}-hint`}>
            {record[locale === "th" ? "en" : "th"]
              ? `${locale === "th" ? "English" : "ภาษาไทย"}: ${String(record[locale === "th" ? "en" : "th"]).slice(0, 90)}${String(record[locale === "th" ? "en" : "th"]).length > 90 ? "…" : ""}`
              : `ยังไม่มี${locale === "th" ? "ภาษาอังกฤษ" : "ภาษาไทย"} — กรุณากรอกก่อนบันทึก`}
          </p>
        </div>
      );
    }
    return (
      <div className="cms-fields">
        {Object.entries(
          path.length === 2 && path[0] === "content" && path[1] === "hero"
            ? {
                ...record,
                videoUrl: record.videoUrl ?? "",
                videoPoster: record.videoPoster ?? "",
              }
            : record,
        )
          .filter(([child]) => !reservedField([...path, child]))
          .map(([child, childValue]) => (
            <EditorFields
              {...props}
              key={child}
              value={childValue}
              path={[...path, child]}
            />
          ))}
      </div>
    );
  }
  if (typeof value === "boolean")
    return (
      <div className="cms-field cms-boolean">
        <span>{label}</span>
        <label htmlFor={inputId}>
          <input
            id={inputId}
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(path, event.target.checked)}
          />
          {value ? "เปิด" : "ปิด"}
        </label>
        {["approved", "verified"].includes(key) && (
          <p className="cms-helper">แสดงบนเว็บไซต์เมื่อยืนยันแล้วเท่านั้น</p>
        )}
      </div>
    );
  if (typeof value !== "string") return null;
  if (key === "id")
    return (
      <p className="cms-record-id">
        รหัสถาวร <code>{value}</code>
      </p>
    );
  if (["image", "logo_url", "videoPoster", "videoUrl"].includes(key))
    return <MediaField {...props} value={value} />;
  if (["defaultLocale", "icon", "surface", "category", "status"].includes(key))
    return (
      <div className="cms-field">
        <label htmlFor={inputId}>{label}</label>
        <select
          id={inputId}
          value={value}
          onChange={(event) => onChange(path, event.target.value)}
        >
          {(key === "category"
            ? ["web", "mobile", "game", "food", "business", "internal"].map(
                (option) => [option, labels[option]],
              )
            : key === "status"
              ? [
                  ["concept", "Concept — ตัวอย่างแนวคิด"],
                  ["prototype", "Prototype — ต้นแบบ"],
                  ["delivered", "Delivered — ส่งมอบแล้ว"],
                ]
              : key === "defaultLocale"
                ? [
                    ["th", "ภาษาไทย"],
                    ["en", "English"],
                  ]
                : key === "surface"
                  ? [
                      ["dark", "พื้นเข้ม"],
                      ["light", "พื้นอ่อน"],
                    ]
                  : path[1] === "studio"
                    ? studioIconOptions
                    : iconOptions
          ).map(([option, name]) => (
            <option key={option} value={option}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  if (key === "position") {
    const [horizontal, vertical] = value
      .split(" ")
      .map((part) => Number.parseInt(part, 10) || 0);
    return (
      <fieldset className="cms-crop">
        <legend>จุดโฟกัสของภาพ</legend>
        <p className="cms-helper">
          ตำแหน่งสำคัญที่จะรักษาไว้เมื่อรูปถูกครอบในกรอบการ์ด
        </p>
        <div>
          <label htmlFor={`${inputId}-x`}>แนวนอน {horizontal}%</label>
          <input
            id={`${inputId}-x`}
            type="range"
            min="0"
            max="100"
            value={horizontal}
            onChange={(event) =>
              onChange(path, `${event.target.value}% ${vertical}%`)
            }
          />
          <label htmlFor={`${inputId}-y`}>แนวตั้ง {vertical}%</label>
          <input
            id={`${inputId}-y`}
            type="range"
            min="0"
            max="100"
            value={vertical}
            onChange={(event) =>
              onChange(path, `${horizontal}% ${event.target.value}%`)
            }
          />
        </div>
      </fieldset>
    );
  }
  const isOptional =
    ["email", "line", "lineUrl", "website", "linkedin"].includes(key) &&
    path.includes("site");
  return (
    <div className="cms-field">
      <label htmlFor={inputId}>
        {label}
        {isOptional && <span className="cms-optional">ไม่บังคับ</span>}
      </label>
      <input
        id={inputId}
        type={key === "email" && path.includes("site") ? "email" : "text"}
        value={value}
        onChange={(event) => onChange(path, event.target.value)}
        autoCapitalize={
          /Url|url|href|email|slug/.test(key) ? "none" : undefined
        }
      />
      {isOptional && (
        <p className="cms-helper">
          ล้างค่าเพื่อซ่อนช่องทางนี้บนเว็บไซต์
          {key === "line" || key === "lineUrl"
            ? " · LINE จะแสดงเมื่อมีทั้งชื่อบัญชีและลิงก์"
            : ""}
        </p>
      )}
      {key === "href" && (
        <p className="cms-helper">
          ใช้ #home, #capabilities, #industries, #process, #applications,
          #about, #ecosystem, #contact หรือลิงก์ https://
        </p>
      )}
      {key === "slug" && (
        <p className="cms-helper">
          ใช้ตัวอักษร a–z ตัวเลข และขีดกลาง โดยไม่ซ้ำกับผลงานอื่น
        </p>
      )}
    </div>
  );
}
