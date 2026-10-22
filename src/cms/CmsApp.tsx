import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  Eye,
  FileText,
  Globe,
  Image,
  Layers,
  LayoutTemplate,
  ListOrdered,
  LoaderCircle,
  LogOut,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Type,
  Users,
  X,
} from "lucide-react";
import { siteSchema, type Locale, type SiteData } from "../content";
import { Website } from "../App";
import { StudioWebsite } from "../studio/StudioWebsite";
import { studioIdentityErrors } from "../studio/schema";
import { Modal } from "../components/Modal";
import { NeuralX } from "../components/NeuralX";
import { cmsClient, requestCms } from "./client";
import { EditorFields } from "./EditorFields";
import {
  getAt,
  labels,
  sectionPath,
  sections,
  studioSections,
  setAt,
  type Path,
  type Workspace,
} from "./model";
import "./cms.css";

const sectionIcons = {
  settings: Settings,
  layout: LayoutTemplate,
  layers: Layers,
  image: Image,
  list: ListOrdered,
  briefcase: BriefcaseBusiness,
  type: Type,
  users: Users,
  mail: Mail,
  shield: ShieldCheck,
};
type ValidationIssue = { section: string; field: string; message: string };
type Confirmation = { title: string; body: string; action: () => void };
type CmsRequest = { generation: number; userId: string; session: Session };

function workspaceFrom(value: unknown): Workspace {
  const workspace = value as Workspace;
  if (
    !workspace ||
    !Number.isInteger(workspace.revision) ||
    !Number.isInteger(workspace.published_revision)
  )
    throw new Error("Invalid workspace");
  return { ...workspace, document: siteSchema.parse(workspace.document) };
}
function readableError(error: unknown): string {
  const current = error as { code?: string; message?: string };
  if (current.code === "REQUEST_TIMEOUT")
    return "การเชื่อมต่อใช้เวลานาน จึงยังยืนยันผลไม่ได้ ข้อความที่กำลังแก้ยังอยู่ ดาวน์โหลดฉบับทำงานก่อน แล้วโหลดฉบับล่าสุดเพื่อตรวจว่าบันทึกหรือเผยแพร่สำเร็จแล้วหรือไม่";
  if (
    current.code === "40001" ||
    current.code === "PT409" ||
    /conflict|revision|stale/i.test(current.message || "")
  )
    return "มีการบันทึกฉบับใหม่จากอีกหน้าต่าง ข้อความที่กำลังแก้ยังอยู่ ดาวน์โหลดฉบับทำงานก่อน แล้วโหลดฉบับล่าสุดเพื่อตรวจความต่าง";
  if (
    current.code === "42501" ||
    /admin|permission|allowlist|not authorized/i.test(current.message || "")
  )
    return "บัญชีนี้ยังไม่มีสิทธิ์แก้ไขเนื้อหา กรุณาติดต่อเจ้าของเว็บไซต์เพื่อตรวจรายชื่อผู้ดูแล";
  if (
    current.code === "SESSION_REQUIRED" ||
    /jwt|session|expired/i.test(current.message || "")
  )
    return "เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง ข้อความที่กำลังแก้ยังอยู่ในหน้านี้";
  return "ยังดำเนินการไม่ได้ กรุณาตรวจการเชื่อมต่อแล้วลองอีกครั้ง ข้อมูลที่กำลังแก้ยังอยู่";
}

function Login({
  retainedDraft,
  onRefresh,
}: {
  retainedDraft: boolean;
  onRefresh: () => void;
}) {
  const [method, setMethod] = useState<"password" | "email">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cmsClient || pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const result =
        method === "password"
          ? await cmsClient.auth.signInWithPassword({
              email: email.trim(),
              password,
            })
          : await cmsClient.auth.signInWithOtp({
              email: email.trim(),
              options: {
                shouldCreateUser: false,
                emailRedirectTo: `${window.location.origin}/admin`,
              },
            });
      if (result.error) throw result.error;
      if (method === "email")
        setMessage(
          "ส่งคำขอแล้ว หากอีเมลนี้มีบัญชีอยู่ คุณจะได้รับลิงก์เข้าสู่ระบบ กรุณาเปิดลิงก์จากอีเมลด้วยเบราว์เซอร์นี้",
        );
      else onRefresh();
    } catch {
      setError(
        method === "password"
          ? "เข้าสู่ระบบไม่ได้ ตรวจอีเมลและรหัสผ่านแล้วลองอีกครั้ง"
          : "ส่งลิงก์ไม่ได้ กรุณาตรวจอีเมล การเชื่อมต่อ หรือรอสักครู่ก่อนลองอีกครั้ง",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="cms-auth cms-root">
      <a className="cms-back-link" href="/">
        <ArrowLeft size={16} />
        กลับหน้าเว็บไซต์
      </a>
      <div className="cms-login-card">
        <div className="cms-auth-mark">
          <NeuralX small />
          <span>CONTENT STUDIO</span>
        </div>
        <h1>พื้นที่ดูแลเว็บไซต์</h1>
        <p className="cms-auth-intro">
          แก้เนื้อหา ตรวจตัวอย่าง และเผยแพร่จากพื้นที่เดียว
        </p>
        {retainedDraft && (
          <p className="cms-notice">
            ฉบับที่กำลังแก้ยังอยู่ในหน้านี้
            เข้าสู่ระบบด้วยบัญชีเดิมเพื่อทำงานต่อ กรุณาอย่าปิดหน้านี้
          </p>
        )}
        <div className="cms-tabs" aria-label="วิธีเข้าสู่ระบบ">
          <button
            aria-pressed={method === "email"}
            disabled={pending}
            onClick={() => {
              setMethod("email");
              setError("");
              setMessage("");
            }}
          >
            ลิงก์ทางอีเมล
          </button>
          <button
            aria-pressed={method === "password"}
            disabled={pending}
            onClick={() => {
              setMethod("password");
              setError("");
              setMessage("");
            }}
          >
            รหัสผ่าน
          </button>
        </div>
        <form onSubmit={submit}>
          <fieldset disabled={pending}>
            <div className="cms-field">
              <label htmlFor="cms-email">อีเมลผู้ดูแล</label>
              <input
                id="cms-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
              />
            </div>
            {method === "password" && (
              <div className="cms-field">
                <label htmlFor="cms-password">รหัสผ่าน</label>
                <input
                  id="cms-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            )}
            <button
              className="cms-button cms-primary cms-login-submit"
              type="submit"
            >
              {pending ? (
                <LoaderCircle size={17} className="cms-spin" />
              ) : method === "email" ? (
                <Mail size={17} />
              ) : (
                <ShieldCheck size={17} />
              )}
              {pending
                ? "กำลังดำเนินการ…"
                : method === "email"
                  ? "ส่งลิงก์เข้าสู่ระบบ"
                  : "เข้าสู่ระบบ"}
            </button>
          </fieldset>
        </form>
        {message && (
          <p className="cms-success" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="cms-inline-error" role="alert">
            {error}
          </p>
        )}
        <p className="cms-auth-foot">
          <ShieldCheck size={16} />
          สำหรับบัญชีที่เจ้าของเว็บไซต์อนุญาตเท่านั้น
        </p>
      </div>
      <p className="cms-auth-caption">บันทึกฉบับร่างก่อน · เผยแพร่เมื่อพร้อม</p>
    </main>
  );
}

export default function CmsApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [document, setDocument] = useState<SiteData | null>(null);
  const [section, setSection] = useState<string>("hero");
  const [page, setPage] = useState<"deepx" | "studio">("deepx");
  const [locale, setLocale] = useState<Locale>("th");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pending, setPending] = useState<
    "load" | "save" | "publish" | "signout" | "upload" | null
  >(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [confirm, setConfirm] = useState<Confirmation | null>(null);
  const [preview, setPreview] = useState(false);
  const owner = useRef<string | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const authIdentity = useRef<string | null>(null);
  const authGeneration = useRef(0);
  const requestGeneration = useRef(0);
  const documentRef = useRef<SiteData | null>(null);
  documentRef.current = document;
  const acceptSession = useCallback((next: Session | null) => {
    const nextIdentity = next?.user.id || null;
    // Invalidate synchronously inside the auth callback, before React renders.
    // A signed-out owner's draft may survive reauthentication, but another
    // identity must never receive it or a late response from its requests.
    if (authIdentity.current !== nextIdentity) {
      authIdentity.current = nextIdentity;
      authGeneration.current += 1;
      requestGeneration.current += 1;
      setPending(null);
      setConfirm(null);
      setPreview(false);
      setError("");
      setNotice("");
      if (nextIdentity && owner.current !== nextIdentity) {
        owner.current = null;
        documentRef.current = null;
        setDocument(null);
        setWorkspace(null);
        setIssues([]);
      }
    }
    sessionRef.current = next;
    setSession(next);
  }, []);
  const beginRequest = useCallback((): CmsRequest | null => {
    const current = sessionRef.current;
    if (!current || authIdentity.current !== current.user.id) return null;
    return {
      generation: ++requestGeneration.current,
      userId: current.user.id,
      session: current,
    };
  }, []);
  const isCurrentRequest = useCallback(
    (request: CmsRequest) =>
      requestGeneration.current === request.generation &&
      authIdentity.current === request.userId &&
      sessionRef.current?.user.id === request.userId,
    [],
  );
  const dirty = useMemo(
    () =>
      Boolean(
        document &&
        workspace &&
        JSON.stringify(document) !== JSON.stringify(workspace.document),
      ),
    [document, workspace],
  );
  const savedUnpublished = Boolean(
    workspace && workspace.revision !== workspace.published_revision,
  );

  const refreshSession = useCallback(async () => {
    if (!cmsClient) {
      setAuthReady(true);
      return;
    }
    const generation = authGeneration.current;
    const { data, error: sessionError } = await cmsClient.auth.getSession();
    if (authGeneration.current !== generation) return;
    setAuthError(Boolean(sessionError));
    acceptSession(data.session);
    setAuthReady(true);
  }, [acceptSession]);
  useEffect(() => {
    void refreshSession();
    if (!cmsClient) return;
    const { data } = cmsClient.auth.onAuthStateChange((_event, next) => {
      acceptSession(next);
      setAuthReady(true);
      setAuthError(false);
    });
    return () => {
      authGeneration.current += 1;
      requestGeneration.current += 1;
      data.subscription.unsubscribe();
    };
  }, [refreshSession, acceptSession]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!preview) {
      window.document.title = "Content Studio";
      window.document.documentElement.lang = "th";
    }
  }, [preview]);

  const loadWorkspace = useCallback(async () => {
    if (!cmsClient) return;
    const request = beginRequest();
    if (!request) return;
    setPending("load");
    setError("");
    try {
      const data = await requestCms("cms_get_workspace", {}, request.session);
      if (!isCurrentRequest(request)) return;
      const next = workspaceFrom(data);
      owner.current = request.userId;
      setWorkspace(next);
      setDocument(next.document);
      setIssues([]);
      setNotice("");
    } catch (failure) {
      if (isCurrentRequest(request)) setError(readableError(failure));
    } finally {
      if (isCurrentRequest(request)) setPending(null);
    }
  }, [beginRequest, isCurrentRequest]);
  useEffect(() => {
    if (!session) return;
    if (owner.current === session.user.id && documentRef.current) return;
    if (owner.current && owner.current !== session.user.id) {
      setDocument(null);
      setWorkspace(null);
    }
    void loadWorkspace();
  }, [session?.user.id, loadWorkspace]);

  function validate(): SiteData | null {
    const result = siteSchema.safeParse(document);
    if (result.success) {
      if (
        result.data.content.studio &&
        studioIdentityErrors(result.data.content.studio).length
      ) {
        setError(
          "ยังบันทึกไม่ได้: รายการใน Product Studio มีรหัสซ้ำ กรุณาโหลดฉบับร่างใหม่ก่อนเพิ่มรายการอีกครั้ง",
        );
        return null;
      }
      setIssues([]);
      return result.data;
    }
    const next = result.error.issues.map((issue) => ({
      section:
        issue.path[0] === "content"
          ? issue.path[1] === "studio"
            ? `studio.${String(issue.path[2])}`
            : String(issue.path[1])
          : issue.path[0] === "partners"
            ? "partner_records"
            : "case_studies",
      field: issue.path
        .filter((part) => part !== "content")
        .map((part) =>
          typeof part === "number"
            ? `รายการ ${part + 1}`
            : labels[String(part)] ||
              [...sections, ...studioSections].find((item) => item.key === part)
                ?.title ||
              "เนื้อหา",
        )
        .join(" › "),
      message:
        issue.code === "invalid_format"
          ? "ตรวจรูปแบบอีเมล ลิงก์ หรือรหัสอ้างอิง"
          : "กรอกข้อมูลที่จำเป็นให้ครบทั้งภาษาไทยและอังกฤษ",
    }));
    setIssues(next);
    setError("ยังบันทึกไม่ได้ กรุณาตรวจช่องที่ระบุด้านล่าง");
    window.scrollTo({ top: 0, behavior: "instant" });
    return null;
  }
  async function save() {
    if (
      !cmsClient ||
      !workspace ||
      pending ||
      owner.current !== sessionRef.current?.user.id
    )
      return;
    const valid = validate();
    if (!valid) return;
    const request = beginRequest();
    if (!request) return;
    setPending("save");
    setError("");
    setNotice("");
    try {
      const data = await requestCms(
        "cms_save_draft",
        {
          p_document: valid,
          p_expected_revision: workspace.revision,
        },
        request.session,
      );
      if (!isCurrentRequest(request)) return;
      const next = workspaceFrom(data);
      setWorkspace(next);
      setDocument(next.document);
      setNotice("บันทึกฉบับร่างบนเซิร์ฟเวอร์แล้ว เว็บไซต์จริงยังไม่เปลี่ยน");
    } catch (failure) {
      if (isCurrentRequest(request)) setError(readableError(failure));
    } finally {
      if (isCurrentRequest(request)) setPending(null);
    }
  }
  async function publish() {
    if (
      !cmsClient ||
      !workspace ||
      dirty ||
      pending ||
      owner.current !== sessionRef.current?.user.id
    )
      return;
    const request = beginRequest();
    if (!request) return;
    setPending("publish");
    setError("");
    setNotice("");
    try {
      const data = await requestCms(
        "cms_publish",
        {
          p_expected_revision: workspace.revision,
        },
        request.session,
      );
      if (!isCurrentRequest(request)) return;
      const next = workspaceFrom(data);
      setWorkspace(next);
      setDocument(next.document);
      setNotice(
        "เผยแพร่แล้ว ผู้เข้าชมจะเห็นข้อมูลใหม่เมื่อเปิดหรือโหลดหน้าเว็บไซต์อีกครั้ง",
      );
    } catch (failure) {
      if (isCurrentRequest(request)) setError(readableError(failure));
    } finally {
      if (isCurrentRequest(request)) setPending(null);
    }
  }
  async function signout() {
    if (!cmsClient || pending) return;
    const identity = authIdentity.current;
    const generation = authGeneration.current;
    setPending("signout");
    const { error: signoutError } = await cmsClient.auth.signOut({
      scope: "local",
    });
    const sameSession =
      authGeneration.current === generation &&
      authIdentity.current === identity;
    const ownSignout =
      authGeneration.current === generation + 1 &&
      authIdentity.current === null;
    if (!sameSession && !ownSignout) return;
    if (signoutError) setError("ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
    else {
      setWorkspace(null);
      setDocument(null);
      owner.current = null;
      documentRef.current = null;
      acceptSession(null);
      setError("");
      setNotice("");
    }
    setPending(null);
  }
  function downloadDraft() {
    if (
      !document ||
      owner.current !== authIdentity.current ||
      !authIdentity.current
    )
      return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(document, null, 2)], {
        type: "application/json",
      }),
    );
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `content-working-copy-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "ดาวน์โหลดสำเนาฉบับทำงานแล้ว ไฟล์นี้ไม่ได้เปลี่ยนข้อมูลบนเซิร์ฟเวอร์",
    );
  }
  function ask(title: string, body: string, action: () => void) {
    setConfirm({ title, body, action });
  }
  function goToSection(key: string) {
    setPage(key.startsWith("studio.") ? "studio" : "deepx");
    setSection(key);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function change(path: Path, value: unknown) {
    if (
      !session ||
      session.user.id !== authIdentity.current ||
      owner.current !== session.user.id
    )
      return;
    setDocument((current) => (current ? setAt(current, path, value) : current));
    setNotice("");
  }

  if (!cmsClient)
    return (
      <main className="cms-root cms-state">
        <CircleAlert size={32} />
        <h1>ยังเชื่อมต่อระบบเนื้อหาไม่ได้</h1>
        <p>กรุณาตรวจการตั้งค่า Supabase ของเว็บไซต์</p>
        <a href="/" className="cms-button">
          กลับหน้าเว็บไซต์
        </a>
      </main>
    );
  if (!authReady)
    return (
      <main className="cms-root cms-state">
        <LoaderCircle className="cms-spin" size={30} />
        <h1>กำลังตรวจเซสชัน…</h1>
      </main>
    );
  if (authError)
    return (
      <main className="cms-root cms-state">
        <CircleAlert size={30} />
        <h1>ตรวจเซสชันไม่สำเร็จ</h1>
        <button className="cms-button" onClick={() => void refreshSession()}>
          ลองอีกครั้ง
        </button>
      </main>
    );
  if (!session)
    return (
      <Login
        retainedDraft={Boolean(document && dirty)}
        onRefresh={() => void refreshSession()}
      />
    );
  if (document && owner.current !== session.user.id)
    return (
      <main className="cms-root cms-state">
        <LoaderCircle className="cms-spin" size={30} />
        <h1>กำลังตรวจสิทธิ์พื้นที่เนื้อหา…</h1>
      </main>
    );
  if (preview && document)
    return (
      <div className="cms-preview">
        <div className="cms-preview-bar cms-root">
          <button
            className="cms-button"
            onClick={() => {
              setPreview(false);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <ArrowLeft size={16} />
            กลับไปแก้ไข
          </button>
          <span>
            <Eye size={16} />
            ตัวอย่างฉบับทำงาน{dirty ? " · ยังไม่บันทึก" : ""}
          </span>
          <strong>ยังไม่ใช่เว็บไซต์จริง</strong>
        </div>
        {page === "studio" && document.content.studio ? (
          <StudioWebsite
            data={document}
            studio={document.content.studio}
            preview
          />
        ) : (
          <Website data={document} />
        )}
      </div>
    );

  const pageSections = page === "studio" ? studioSections : sections;
  const currentSection =
    [...sections, ...studioSections].find((item) => item.key === section) ||
    pageSections[0];
  const filteredSections = pageSections.filter((item) =>
    `${item.title} ${item.description}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  const StatusIcon = dirty ? CircleAlert : Check;
  return (
    <div className="cms-root cms-shell">
      <a className="cms-skip" href="#cms-editor">
        ข้ามไปส่วนแก้ไขเนื้อหา
      </a>
      <header className="cms-topbar">
        <div className="cms-brand">
          <NeuralX small />
          <div>
            <strong>{document?.content.site.name || "Content Studio"}</strong>
            <span>CONTENT STUDIO</span>
          </div>
        </div>
        <div className="cms-topbar-right">
          <a
            href={page === "studio" ? "/studio" : "/"}
            target="_blank"
            rel="noreferrer"
            className="cms-button cms-quiet"
          >
            <Globe size={16} />
            <span>เปิดเว็บไซต์จริง</span>
            <ArrowUpRight size={14} />
          </a>
          <button
            className="cms-button cms-quiet"
            disabled={Boolean(pending)}
            onClick={() =>
              dirty
                ? ask(
                    "ออกจากระบบโดยไม่บันทึก?",
                    "การแก้ไขที่ยังไม่บันทึกจะหายไป ฉบับร่างที่บันทึกแล้วจะยังอยู่บนเซิร์ฟเวอร์",
                    () => void signout(),
                  )
                : void signout()
            }
          >
            <LogOut size={16} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>
      <div className="cms-layout">
        <aside className={`cms-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div className="cms-sidebar-heading">
            <span>จัดการเนื้อหา</span>
            <button
              className="cms-icon-button cms-mobile-only"
              aria-label="ปิดรายการส่วนเนื้อหา"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={19} />
            </button>
          </div>
          <div className="cms-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาส่วนเนื้อหา"
              aria-label="ค้นหาส่วนเนื้อหา"
            />
          </div>
          <div className="cms-page-picker">
            <label htmlFor="cms-page">หน้าที่แก้ไข</label>
            <select
              id="cms-page"
              value={page}
              onChange={(event) => {
                const next = event.target.value as "deepx" | "studio";
                setPage(next);
                setSection(next === "studio" ? "studio.hero" : "hero");
                setQuery("");
              }}
            >
              <option value="deepx">DeepX AI</option>
              <option value="studio" disabled={!document?.content.studio}>
                Product Studio
              </option>
            </select>
            <p>ฉบับร่างและปุ่มเผยแพร่ใช้ร่วมกันทั้งสองหน้า</p>
          </div>
          <nav aria-label="ส่วนเนื้อหาเว็บไซต์">
            {filteredSections.map((item) => {
              const Icon = sectionIcons[item.icon];
              return (
                <button
                  key={item.key}
                  onClick={() => goToSection(item.key)}
                  aria-current={item.key === section ? "page" : undefined}
                >
                  <Icon size={17} />
                  <span>{item.title}</span>
                  {item.key === section && <ChevronRight size={14} />}
                </button>
              );
            })}
            {filteredSections.length === 0 && (
              <p className="cms-search-empty">ไม่พบส่วนเนื้อหาที่ตรงกัน</p>
            )}
          </nav>
          <div className="cms-sidebar-footer">
            <ShieldCheck size={16} />
            <div>
              <span>เข้าสู่ระบบเป็น</span>
              <p>{session.user.email}</p>
            </div>
          </div>
        </aside>
        <main id="cms-editor" className="cms-main">
          <button
            className="cms-button cms-mobile-only cms-section-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={17} />
            ) : (
              <PanelLeftOpen size={17} />
            )}
            เลือกส่วนเนื้อหา
          </button>
          <div className="cms-page-heading">
            <div>
              <p className="cms-breadcrumb">
                {page === "studio" ? "Product Studio" : "DeepX AI"}{" "}
                <ChevronRight size={13} />
                เนื้อหา
              </p>
              <h1>{currentSection.title}</h1>
              <p>{currentSection.description}</p>
            </div>
            <div className="cms-locale">
              <span>ภาษาที่แก้ไข</span>
              <div className="cms-tabs">
                <button
                  aria-pressed={locale === "th"}
                  onClick={() => setLocale("th")}
                >
                  ไทย
                </button>
                <button
                  aria-pressed={locale === "en"}
                  onClick={() => setLocale("en")}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
          <div className="cms-workbar">
            <div className={`cms-save-state ${dirty ? "is-dirty" : ""}`}>
              <StatusIcon size={16} />
              <span>
                {pending === "save"
                  ? "กำลังบันทึก…"
                  : pending === "publish"
                    ? "กำลังเผยแพร่…"
                    : dirty
                      ? "มีการแก้ไขที่ยังไม่บันทึก"
                      : savedUnpublished
                        ? "มีฉบับร่างที่ยังไม่เผยแพร่"
                        : workspace
                          ? "ตรงกับฉบับที่เผยแพร่แล้ว"
                          : "กำลังโหลดฉบับร่าง"}
              </span>
            </div>
            <div className="cms-work-actions">
              <button
                className="cms-button"
                disabled={!document || Boolean(pending)}
                onClick={() => {
                  if (validate()) {
                    setPreview(true);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }
                }}
              >
                <Eye size={16} />
                ดูตัวอย่าง
              </button>
              <button
                className="cms-button"
                disabled={!dirty || Boolean(pending)}
                onClick={() => void save()}
              >
                {pending === "save" ? (
                  <LoaderCircle size={16} className="cms-spin" />
                ) : (
                  <Save size={16} />
                )}
                บันทึกฉบับร่าง
              </button>
              <button
                className="cms-button cms-primary"
                disabled={
                  !workspace || dirty || !savedUnpublished || Boolean(pending)
                }
                title={
                  dirty
                    ? "บันทึกฉบับร่างก่อนเผยแพร่"
                    : !savedUnpublished
                      ? "ไม่มีฉบับร่างใหม่ที่ต้องเผยแพร่"
                      : undefined
                }
                onClick={() =>
                  ask(
                    "เผยแพร่ฉบับร่างนี้?",
                    "เนื้อหา DeepX AI และ Product Studio รวมทั้งผลงานและพันธมิตรในฉบับร่างนี้จะเผยแพร่พร้อมกัน ผู้เข้าชมจะเห็นเมื่อโหลดหน้าใหม่ ส่วนข้อมูลค้นหา Google ต้องอัปเดต build ตามขั้นตอนเผยแพร่",
                    () => void publish(),
                  )
                }
              >
                {pending === "publish" ? (
                  <LoaderCircle size={16} className="cms-spin" />
                ) : (
                  <Send size={16} />
                )}
                เผยแพร่
              </button>
            </div>
          </div>
          <div className="cms-notifications" aria-live="polite">
            {notice && (
              <div className="cms-success">
                <Check size={18} />
                <p>{notice}</p>
                <button
                  className="cms-icon-button"
                  aria-label="ปิดข้อความ"
                  onClick={() => setNotice("")}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {error && (
              <div className="cms-error" role="alert">
                <CircleAlert size={19} />
                <div>
                  <p>{error}</p>
                  {issues.length > 0 && (
                    <ul>
                      {issues.slice(0, 12).map((issue, index) => (
                        <li key={index}>
                          <button onClick={() => goToSection(issue.section)}>
                            {issue.field}
                          </button>
                          <span>{issue.message}</span>
                        </li>
                      ))}
                      {issues.length > 12 && (
                        <li>และอีก {issues.length - 12} ช่อง</li>
                      )}
                    </ul>
                  )}
                  {!document && (
                    <button
                      className="cms-button"
                      disabled={Boolean(pending)}
                      onClick={() => void loadWorkspace()}
                    >
                      <RefreshCw size={16} />
                      ลองอีกครั้ง
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {!document ? (
            <div className="cms-loading-panel">
              {pending ? (
                <>
                  <LoaderCircle className="cms-spin" size={28} />
                  <p>กำลังโหลดพื้นที่เนื้อหา…</p>
                </>
              ) : (
                <>
                  <ShieldCheck size={28} />
                  <p>ยังไม่สามารถเปิดพื้นที่เนื้อหาได้</p>
                  <span>การเข้าสู่ระบบและสิทธิ์ผู้ดูแลเป็นคนละขั้นตอน</span>
                </>
              )}
            </div>
          ) : (
            <div className="cms-edit-layout">
              <section
                className="cms-editor-panel"
                aria-label={`แก้ไข${currentSection.title}`}
              >
                <div className="cms-panel-title">
                  <FileText size={18} />
                  <h2>แก้ไขเนื้อหา</h2>
                  <span>{locale === "th" ? "ภาษาไทย" : "English"}</span>
                </div>
                {(section === "site" || section === "studio.page") && (
                  <p className="cms-section-note">
                    หัวเรื่องและคำอธิบายของเว็บไซต์ใช้กับข้อมูลค้นหา (SEO) ด้วย
                    ข้อมูล SEO ใน HTML จะเปลี่ยนเมื่อเว็บไซต์ build ใหม่
                  </p>
                )}
                {(section === "case_studies" ||
                  section === "partner_records") && (
                  <p className="cms-section-note">
                    รายการทั้งหมดในส่วนนี้จะเผยแพร่พร้อมฉบับร่าง
                    ใช้เฉพาะข้อมูลที่ตรวจสอบแล้ว
                    นำรายการออกเพื่อซ่อนจากเว็บไซต์ในการเผยแพร่ครั้งถัดไป
                  </p>
                )}
                <fieldset
                  className="cms-editor-fieldset"
                  disabled={Boolean(pending)}
                >
                  <EditorFields
                    value={getAt(document, sectionPath(section))}
                    path={sectionPath(section)}
                    locale={locale}
                    onChange={change}
                    onConfirm={ask}
                    onUploading={(busy) => {
                      if (
                        authIdentity.current === session.user.id &&
                        owner.current === session.user.id
                      )
                        setPending(busy ? "upload" : null);
                    }}
                    userId={session.user.id}
                  />
                </fieldset>
              </section>
              <aside className="cms-context-panel">
                <div className="cms-context-heading">
                  <Globe size={18} />
                  <h2>ก่อนเผยแพร่</h2>
                </div>
                <ol>
                  <li>แก้ข้อความทั้งภาษาไทยและอังกฤษ</li>
                  <li>ดูตัวอย่างด้วยหน้าตาเดียวกับเว็บไซต์จริง</li>
                  <li>บันทึกฉบับร่าง แล้วเผยแพร่เมื่อพร้อม</li>
                </ol>
                <div className="cms-revision">
                  <span>ฉบับร่างบนเซิร์ฟเวอร์</span>
                  <strong>เวอร์ชัน {workspace?.revision}</strong>
                  <span>เผยแพร่ล่าสุด</span>
                  <strong>เวอร์ชัน {workspace?.published_revision}</strong>
                  {workspace?.updated_at && (
                    <p>
                      บันทึกล่าสุด{" "}
                      {new Date(workspace.updated_at).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
                <p className="cms-helper">
                  เปลี่ยนส่วนที่แก้ไขได้โดยไม่เสียข้อความ
                  งานที่ยังไม่บันทึกจะอยู่ในแท็บนี้เท่านั้น
                </p>
                <button
                  className="cms-button cms-wide"
                  disabled={Boolean(pending)}
                  onClick={downloadDraft}
                >
                  <Download size={15} />
                  ดาวน์โหลดฉบับทำงาน
                </button>
                <button
                  className="cms-button cms-quiet cms-wide"
                  disabled={Boolean(pending)}
                  onClick={() =>
                    dirty
                      ? ask(
                          "โหลดฉบับล่าสุดจากเซิร์ฟเวอร์?",
                          "การแก้ไขที่ยังไม่บันทึกในแท็บนี้จะถูกแทนที่ ดาวน์โหลดฉบับทำงานก่อนหากต้องการเก็บไว้ตรวจความต่าง",
                          () => void loadWorkspace(),
                        )
                      : void loadWorkspace()
                  }
                >
                  <RefreshCw size={15} />
                  โหลดฉบับล่าสุด
                </button>
              </aside>
            </div>
          )}
        </main>
      </div>
      {confirm && (
        <Modal
          title={confirm.title}
          closeLabel="ยกเลิก"
          onClose={() => setConfirm(null)}
        >
          <div className="cms-root cms-confirm">
            <p>{confirm.body}</p>
            <div>
              <button className="cms-button" onClick={() => setConfirm(null)}>
                ยกเลิก
              </button>
              <button
                className="cms-button cms-primary"
                onClick={() => {
                  const action = confirm.action;
                  setConfirm(null);
                  action();
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
