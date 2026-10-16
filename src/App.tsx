import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  Layers3,
  Settings,
  FlaskConical,
  Cloud,
  Factory,
  Truck,
  Sprout,
  Landmark,
  Search,
  Code2,
  Workflow,
  ChartNoAxesCombined,
  ScanLine,
  Target,
  BrainCircuit,
  UsersRound,
  GraduationCap,
  Building2,
  Menu,
  Mail,
  MessageCircle,
  Linkedin,
  Globe2,
  ChevronDown,
  RotateCw,
  type LucideIcon,
} from "lucide-react";
import {
  loadSite,
  translated,
  type SiteData,
  type Locale,
  type Bilingual,
  type ContentItem,
  type Heading,
} from "./content";
import { NeuralX } from "./components/NeuralX";
import { Modal } from "./components/Modal";
import { Rail } from "./components/Rail";
import { Button, CardAction } from "./components/Action";
import { HeroMedia } from "./components/HeroMedia";

const icons: Record<string, LucideIcon> = {
  atom: Atom,
  layers: Layers3,
  settings: Settings,
  flask: FlaskConical,
  cloud: Cloud,
  factory: Factory,
  truck: Truck,
  sprout: Sprout,
  landmark: Landmark,
  search: Search,
  code: Code2,
  workflow: Workflow,
  chart: ChartNoAxesCombined,
  scan: ScanLine,
  target: Target,
  brain: BrainCircuit,
  users: UsersRound,
  graduation: GraduationCap,
  building: Building2,
};
function Icon({ name, size = 30 }: { name: string; size?: number }) {
  const Component = icons[name] || Atom;
  return <Component size={size} strokeWidth={1.4} aria-hidden="true" />;
}

export function App() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    loadSite(controller.signal)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  if (!data)
    return (
      <main className="loading-screen">
        <NeuralX small />
        {error ? (
          <>
            <h1>ไม่สามารถโหลดเนื้อหาได้ในขณะนี้</h1>
            <p>Content is temporarily unavailable. Please try again.</p>
            <Button
              icon={<RotateCw size={18} />}
              iconPosition="start"
              onClick={() => setAttempt((n) => n + 1)}
            >
              ลองอีกครั้ง / Retry
            </Button>
          </>
        ) : (
          <>
            <span className="loading-line" />
            <p role="status">กำลังโหลด / Loading</p>
          </>
        )}
      </main>
    );
  return <Website data={data} />;
}

export function Website({ data }: { data: SiteData }) {
  const c = data.content;
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const value = localStorage.getItem("deepx.locale");
      if (value === "th" || value === "en") return value;
    } catch {
      /* Optional preference storage. */
    }
    return c.site.defaultLocale;
  });
  const [dialog, setDialog] = useState<
    | { title: Bilingual; body: Bilingual }
    | "menu"
    | "contact"
    | "insights"
    | "privacy"
    | null
  >(null);
  const [sticky, setSticky] = useState(false);
  const t = (value: Bilingual) => translated(value, locale);
  const contact = () => setDialog("contact");
  const detail = (item: ContentItem) =>
    setDialog({ title: item.title, body: item.detail });
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = c.site.title[locale];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", c.site.description[locale]);
    try {
      localStorage.setItem("deepx.locale", locale);
    } catch {
      /* Browsing remains functional with storage disabled. */
    }
  }, [locale, c.site]);
  useEffect(() => {
    const hero = document.getElementById("home");
    const footer = document.getElementById("contact");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero)
            document.body.dataset.heroVisible = String(entry.isIntersecting);
          if (entry.target === footer)
            document.body.dataset.contactVisible = String(entry.isIntersecting);
        }
        setSticky(
          document.body.dataset.heroVisible === "false" &&
            document.body.dataset.contactVisible !== "true",
        );
      },
      { threshold: 0 },
    );
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    items.forEach((item) => {
      item.classList.add("will-reveal");
      observer.observe(item);
    });
    return () => {
      observer.disconnect();
      items.forEach((item) => item.classList.remove("will-reveal"));
    };
  }, []);
  const language = (
    <div className="language-switch" aria-label={t(c.ui.language)}>
      {(["th", "en"] as const).map((lang) => (
        <button
          key={lang}
          lang={lang}
          aria-pressed={lang === locale}
          onClick={() => setLocale(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
  const logo = (
    <>
      <NeuralX small />
      <span className="brand-type">
        <strong>{c.site.name}</strong>
        <small>{c.site.descriptor}</small>
      </span>
    </>
  );
  const sectionTitle = (heading: Heading, extra?: ReactNode) => (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{t(heading.eyebrow)}</p>
        <h2>{t(heading.title)}</h2>
      </div>
      {extra ||
        (heading.description && (
          <p className="section-intro">{t(heading.description)}</p>
        ))}
    </div>
  );
  const rail = (
    kind: string,
    title: Bilingual,
    items: ReactNode[],
    count: number,
  ) => (
    <Rail
      kind={kind}
      name={t(title)}
      count={count}
      previous={t(c.ui.previous)}
      next={t(c.ui.next)}
      slide={t(c.ui.slide)}
    >
      {items}
    </Rail>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t(c.ui.skip)}
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label={c.site.name}>
            {logo}
          </a>
          <nav className="desktop-nav" aria-label={t(c.ui.menu)}>
            {c.site.navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {t(item.label)}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            {language}
            <Button
              className="header-cta"
              onClick={contact}
              icon={<ArrowUpRight size={16} />}
            >
              {t(c.ui.consultation)}
            </Button>
            <button
              className="icon-button menu-button"
              aria-label={t(c.ui.menu)}
              aria-expanded={dialog === "menu"}
              onClick={() => setDialog("menu")}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className={`hero${c.hero.videoUrl ? " hero--video" : ""}`} id="home">
          <div className="hero-atmosphere" aria-hidden="true" />
          {c.hero.videoUrl && (
            <HeroMedia
              videoUrl={c.hero.videoUrl}
              posterUrl={c.hero.videoPoster}
              caption={t(c.hero.visualCaption)}
            />
          )}
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{t(c.hero.eyebrow)}</p>
              <h1>
                {t(c.hero.title)}
                <span>{t(c.hero.accent)}</span>
              </h1>
              <p className="hero-description">{t(c.hero.body)}</p>
              <div className="hero-actions">
                <Button onClick={contact} icon={<ArrowRight size={19} />}>
                  {t(c.ui.consultation)}
                </Button>
                <Button variant="secondary" href="#capabilities">
                  {t(c.ui.capabilities)}
                </Button>
              </div>
            </div>
            {!c.hero.videoUrl && (
              <HeroMedia caption={t(c.hero.visualCaption)} />
            )}
            <div className="expertise-strip">
              <p>{t(c.hero.trustLabel)}</p>
              <div>
                {c.hero.fields.map((field, i) => (
                  <span key={i}>
                    <span className="expertise-symbol" aria-hidden="true">
                      {["◇", "⌘", "⌁", "☁", "↗"][i % 5]}
                    </span>
                    {t(field)}
                  </span>
                ))}
              </div>
            </div>
            <a href="#capabilities" className="scroll-hint">
              <span />
              <small>{t(c.ui.scroll)}</small>
              <ChevronDown size={13} />
            </a>
          </div>
        </section>
        <section className="section container" id="capabilities">
          <div className="reveal">
            {sectionTitle(c.capabilities)}
            {rail(
              "capability-rail",
              c.capabilities.title,
              c.capabilities.items.map((item) => (
                <button
                  className="capability-card"
                  key={item.id}
                  onClick={() => detail(item)}
                >
                  <span className="capability-icon">
                    <Icon name={item.icon} size={36} />
                  </span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.description)}</p>
                  <CardAction label={t(c.ui.learnMore)} />
                </button>
              )),
              c.capabilities.items.length,
            )}
          </div>
        </section>
        <section className="section container" id="industries">
          <div className="reveal">
            {sectionTitle(
              c.industries,
              <a className="text-link section-link" href="#contact">
                {t(c.ui.explore)}
                <ArrowRight size={17} />
              </a>,
            )}
            {rail(
              "industry-rail",
              c.industries.title,
              c.industries.items.map((item) => (
                <button
                  key={item.id}
                  className="industry-card"
                  onClick={() => detail(item)}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={t(item.imageAlt)}
                      loading="lazy"
                      width="600"
                      height="500"
                      style={{ objectPosition: item.position }}
                    />
                  )}
                  <div className="industry-copy">
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.description)}</p>
                    <ArrowUpRight size={22} />
                  </div>
                </button>
              )),
              c.industries.items.length,
            )}
          </div>
        </section>
        <section className="section container" id="process">
          <div className="reveal">
            {sectionTitle(c.process)}
            <ol
              className="process-list"
              style={{
                gridTemplateColumns: `repeat(${c.process.items.length}, minmax(110px, 1fr))`,
              }}
            >
              {c.process.items.map((item, i) => (
                <li key={item.id}>
                  <button onClick={() => detail(item)}>
                    <span className="step-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="step-copy">
                      <h3>{t(item.title)}</h3>
                      <p>{t(item.description)}</p>
                    </span>
                  </button>
                  {i < c.process.items.length - 1 && (
                    <ArrowRight
                      className="step-arrow"
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section container" id="applications">
          <div className="reveal">
            {sectionTitle(
              data.case_studies.length ? c.caseStudies : c.applications,
            )}
            {data.case_studies.length ? (
              <div className="case-grid">
                {data.case_studies.map((item) => (
                  <button
                    className="application-card"
                    key={item.slug}
                    onClick={() =>
                      setDialog({ title: item.title, body: item.body })
                    }
                  >
                    <p className="eyebrow">{t(item.sector)}</p>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.summary)}</p>
                    <div className="outcomes">
                      {item.metrics.map((metric, i) => (
                        <div key={i}>
                          <strong>{metric.value}</strong>
                          <small>{t(metric.label)}</small>
                        </div>
                      ))}
                    </div>
                    <CardAction label={t(c.ui.learnMore)} />
                  </button>
                ))}
              </div>
            ) : (
              <>
                {rail(
                  "application-rail",
                  c.applications.title,
                  c.applications.items.map((item) => (
                    <button
                      className="application-card"
                      key={item.id}
                      onClick={() => detail(item)}
                    >
                      <p className="eyebrow">{t(item.sector)}</p>
                      <h3>{t(item.title)}</h3>
                      <p className="application-description">
                        {t(item.description)}
                      </p>
                      <div className="outcomes">
                        {item.outcomes.map((outcome, i) => (
                          <div key={i}>
                            <strong>{t(outcome)}</strong>
                          </div>
                        ))}
                      </div>
                      <CardAction label={t(c.ui.learnMore)} />
                    </button>
                  )),
                  c.applications.items.length,
                )}
                <p className="editorial-note">{t(c.applications.note)}</p>
              </>
            )}
          </div>
        </section>
        <section className="section container" id="about">
          <div className="reveal">
            {sectionTitle(c.why)}
            <div className="why-grid">
              {c.why.items.map((item) => (
                <button
                  className="why-item"
                  key={item.id}
                  onClick={() => detail(item)}
                >
                  <Icon name={item.icon} size={34} />
                  <h3>{t(item.title)}</h3>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="section ecosystem-section container" id="ecosystem">
          <div className="reveal">
            {sectionTitle(c.ecosystem)}
            {data.partners.length > 0 &&
              rail(
                "partner-strip",
                c.partners.title,
                data.partners.map((partner) => (
                  <a
                    className={`partner-logo ${partner.surface === "light" ? "partner-logo-light" : ""}`}
                    key={partner.id}
                    href={partner.website_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      loading="lazy"
                    />
                  </a>
                )),
                data.partners.length,
              )}
            <div className="ecosystem-grid">
              {c.ecosystem.items.map((item) => (
                <button
                  className="ecosystem-item"
                  key={item.id}
                  onClick={() => detail(item)}
                >
                  <Icon name={item.icon} size={29} />
                  <span>
                    <h3>{t(item.title)}</h3>
                    <small>{t(item.description)}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="contact-globe" aria-hidden="true" />
          <div className="container contact-inner reveal">
            <div>
              <p className="eyebrow">{t(c.contact.eyebrow)}</p>
              <h2>
                {t(c.contact.title)}
                <br />
                <span>{t(c.contact.accent)}</span>
              </h2>
              <p>{t(c.contact.body)}</p>
            </div>
            <div className="contact-actions">
              <Button onClick={contact} icon={<ArrowRight size={19} />}>
                {t(c.ui.consultation)}
              </Button>
              {c.site.lineUrl && c.site.line && (
                <Button
                  variant="secondary"
                  icon={<MessageCircle size={18} />}
                  href={c.site.lineUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(c.ui.line)}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a className="brand" href="#home" aria-label={c.site.name}>
                {logo}
              </a>
              <p>{t(c.site.footerText)}</p>
              <small>
                © {new Date().getFullYear()} {c.site.name}.{" "}
                {t(c.site.copyright)}
              </small>
            </div>
            <nav className="footer-nav" aria-label={t(c.ui.menu)}>
              {c.site.navigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {t(item.label)}
                </a>
              ))}
              <button onClick={() => setDialog("insights")}>
                {t(c.ui.insights)}
              </button>
              <button onClick={() => setDialog("privacy")}>
                {t(c.ui.privacy)}
              </button>
            </nav>
            <div className="footer-contact">
              <h3>{t(c.ui.contact)}</h3>
              {c.site.email && (
                <a href={`mailto:${c.site.email}`}>
                  {c.site.email}
                  <ArrowUpRight size={15} />
                </a>
              )}
              {c.site.lineUrl && c.site.line && (
                <a href={c.site.lineUrl} target="_blank" rel="noreferrer">
                  LINE {c.site.line}
                  <ArrowUpRight size={15} />
                </a>
              )}
              <div className="footer-socials">
                {c.site.linkedin && (
                  <a
                    className="icon-button"
                    href={c.site.linkedin}
                    aria-label={t(c.ui.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={19} />
                  </a>
                )}
                {c.site.website && (
                  <a
                    className="icon-button"
                    href={c.site.website}
                    aria-label={t(c.ui.website)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe2 size={20} />
                  </a>
                )}
                {c.site.email && (
                  <a
                    className="icon-button"
                    href={`mailto:${c.site.email}`}
                    aria-label={t(c.ui.email)}
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>
            <div className="footer-language">
              {language}
              <p>{t(c.site.tagline)}</p>
            </div>
          </div>
        </div>
      </footer>
      <div
        className={`mobile-sticky ${sticky && !dialog ? "is-shown" : ""}`}
        aria-hidden={!sticky || !!dialog}
      >
        <span>{t(c.ui.ready)}</span>
        <Button
          icon={<ArrowRight size={16} />}
          tabIndex={sticky && !dialog ? 0 : -1}
          onClick={contact}
        >
          {t(c.ui.consultation)}
        </Button>
      </div>
      {dialog && (
        <Modal
          title={
            dialog === "menu"
              ? t(c.site.tagline)
              : dialog === "contact"
                ? t(c.ui.contact)
                : dialog === "insights"
                  ? t(c.insights.title)
                  : dialog === "privacy"
                    ? t(c.privacy.title)
                    : t(dialog.title)
          }
          closeLabel={t(c.ui.close)}
          onClose={() => setDialog(null)}
        >
          {dialog === "menu" ? (
            <nav className="mobile-nav">
              {c.site.navigation.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setDialog(null)}
                >
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {t(item.label)}
                  <ArrowUpRight size={21} />
                </a>
              ))}
              <div className="menu-bottom">
                {language}
                {c.site.email && (
                  <a className="text-link" href={`mailto:${c.site.email}`}>
                    {c.site.email}
                  </a>
                )}
              </div>
            </nav>
          ) : dialog === "contact" ? (
            <>
              <p className="dialog-description">{t(c.contact.note)}</p>
              <div className="contact-options">
                {c.site.email && (
                  <a href={`mailto:${c.site.email}`}>
                    <Mail />
                    <span>
                      <small>{t(c.ui.email)}</small>
                      <strong>{c.site.email}</strong>
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                )}
                {c.site.lineUrl && c.site.line && (
                  <a href={c.site.lineUrl} target="_blank" rel="noreferrer">
                    <MessageCircle />
                    <span>
                      <small>{t(c.ui.line)}</small>
                      <strong>{c.site.line}</strong>
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                )}
                {c.site.linkedin && (
                  <a href={c.site.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin />
                    <span>
                      <small>{t(c.ui.linkedin)}</small>
                      <strong>{c.site.name}</strong>
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
            </>
          ) : dialog === "insights" ? (
            <div className="insight-list">
              {c.insights.items.map((item) => (
                <article key={item.id}>
                  <Icon name={item.icon} />
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.description)}</p>
                  <p>{t(item.detail)}</p>
                </article>
              ))}
            </div>
          ) : dialog === "privacy" ? (
            <p className="dialog-description">{t(c.privacy.body)}</p>
          ) : (
            <>
              <p className="eyebrow">{t(c.ui.details)}</p>
              <p className="dialog-description">{t(dialog.body)}</p>
              <Button onClick={contact} icon={<ArrowRight size={18} />}>
                {t(c.ui.contact)}
              </Button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
