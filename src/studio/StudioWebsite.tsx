import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  Box,
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronDown,
  CodeXml,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Target,
  Workflow,
} from "lucide-react";
import type { Bilingual, Locale, SiteData } from "../content";
import type { StudioContent, StudioProject } from "./schema";
import { Button } from "../components/Action";
import { Modal } from "../components/Modal";
import { NeuralX } from "../components/NeuralX";
import "./studio.css";

const icons: Record<string, typeof Atom> = {
  atom: Atom,
  layers: Layers3,
  code: CodeXml,
  phone: Smartphone,
  workflow: Workflow,
  chart: ChartNoAxesCombined,
  search: Search,
  rocket: Rocket,
  box: Box,
  target: Target,
  settings: Settings,
  brain: BrainCircuit,
  scan: Search,
  shield: ShieldCheck,
};
function StudioIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Icon = icons[name] || Box;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
type HeadingData = {
  eyebrow: Bilingual;
  title: Bilingual;
  accent: Bilingual;
  description: Bilingual;
};
// Keep authored phrases together when they fit; long phrases still wrap safely.
function HeadingText({ children }: { children: string }) {
  return children.split(/(\s+)/).map((phrase, index) =>
    phrase.trim() ? (
      <span className="studio-phrase" key={index}>
        {phrase}
      </span>
    ) : (
      phrase
    ),
  );
}
function Heading({
  value,
  locale,
  children,
}: {
  value: HeadingData;
  locale: Locale;
  children?: ReactNode;
}) {
  return (
    <div className="studio-heading">
      <p className="studio-eyebrow">{value.eyebrow[locale]}</p>
      <h2>
        <HeadingText>{value.title[locale]}</HeadingText>{" "}
        <span className="studio-accent">
          <HeadingText>{value.accent[locale]}</HeadingText>
        </span>
      </h2>
      <p>{value.description[locale]}</p>
      {children}
    </div>
  );
}

/** Public and authenticated draft preview share exactly the same renderer. */
export function StudioWebsite({
  data,
  studio,
  preview = false,
}: {
  data: SiteData;
  studio: StudioContent;
  preview?: boolean;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return data.content.site.defaultLocale;
    try {
      const saved = localStorage.getItem("deepx.locale");
      return saved === "th" || saved === "en"
        ? saved
        : data.content.site.defaultLocale;
    } catch {
      return data.content.site.defaultLocale;
    }
  });
  const [menu, setMenu] = useState(false);
  const [mobileFooter, setMobileFooter] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [dialog, setDialog] = useState<{
    title: string;
    body: ReactNode;
  } | null>(null);
  const { site, privacy } = data.content;
  const s = studio,
    t = (value: Bilingual) => value[locale];
  const projects = s.portfolio.projects.filter(
    (p) => filter === "all" || p.category === filter,
  );
  const quotes = s.testimonials.quotes.filter((q) => q.approved);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobileFooter(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const availableNav = s.page.navigation.filter((link) => {
    const visibility: Record<string, boolean> = {
      "#studio-work": s.portfolio.enabled && s.portfolio.projects.length > 0,
      "#studio-services": s.services.enabled && s.services.items.length > 0,
      "#studio-process": s.process.enabled && s.process.items.length > 0,
      "#studio-about": s.why.enabled,
    };
    return visibility[link.href] !== false;
  });
  useEffect(() => {
    if (preview) return;
    document.documentElement.lang = locale;
    document.title = t(s.page.title);
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", t(s.page.description));
  }, [locale, s.page, preview]);
  const changeLocale = (next: Locale) => {
    setLocale(next);
    setDialog(null);
    try {
      localStorage.setItem("deepx.locale", next);
    } catch {
      /* Storage is optional. */
    }
  };
  const language = (
    <div className="studio-language" aria-label={t(s.ui.language)}>
      {(["th", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => changeLocale(lang)}
          aria-pressed={locale === lang}
          lang={lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
  const brand = (
    <>
      <NeuralX small />
      <span>
        {s.page.name}
        <strong>{s.page.unit}</strong>
      </span>
    </>
  );
  const contact = () =>
    setDialog({
      title: t(s.ui.contactTitle),
      body: (
        <>
          <p>{t(s.ui.contactNote)}</p>
          <div className="studio-contact-links">
            {site.email && (
              <Button href={`mailto:${site.email}`} icon={<Mail size={18} />}>
                {site.email}
              </Button>
            )}
            {site.lineUrl && (
              <Button
                href={site.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon={<MessageCircle size={18} />}
              >
                {t(s.ui.line)} {site.line}
              </Button>
            )}
            {site.linkedin && (
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                {t(s.ui.linkedin)} <ArrowUpRight size={16} />
              </a>
            )}
            {!site.email && !site.lineUrl && !site.linkedin && (
              <p>{t(s.ui.noContact)}</p>
            )}
          </div>
        </>
      ),
    });
  const primary = (
    <Button onClick={contact} icon={<ArrowRight size={18} />}>
      {t(s.ui.consultation)}
    </Button>
  );
  const detail = (item: {
    title: Bilingual;
    description: Bilingual;
    detail: Bilingual;
  }) =>
    setDialog({
      title: t(item.title),
      body: (
        <>
          <p className="studio-detail-lead">{t(item.description)}</p>
          <p className="studio-prose">{t(item.detail)}</p>
          {primary}
        </>
      ),
    });
  const openProject = (project: StudioProject) =>
    setDialog({
      title: t(project.title),
      body: (
        <>
          {project.image && (
            <img
              className="studio-dialog-image"
              src={project.image}
              alt={t(project.imageAlt)}
            />
          )}
          <span className={`studio-tag ${project.category}`}>
            {t(s.portfolio.filters[project.category])}
          </span>
          <span className="studio-status">{t(s.ui[project.status])}</span>
          <p className="studio-detail-lead">{t(project.description)}</p>
          <p className="studio-prose">{t(project.detail)}</p>
          {project.status !== "delivered" && (
            <p className="studio-note">{t(s.portfolio.note)}</p>
          )}
          {project.website && (
            <Button
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ArrowUpRight size={18} />}
            >
              {t(s.ui.projectLink)}
            </Button>
          )}
          {primary}
        </>
      ),
    });
  return (
    <div className="studio-site" lang={locale}>
      <a href="#studio-main" className="skip-link">
        {t(s.ui.skip)}
      </a>
      <header className="studio-header">
        <div className="studio-shell studio-header-inner">
          <a
            className="studio-brand"
            href={preview ? "#studio-main" : "/studio"}
          >
            {brand}
          </a>
          <nav className="studio-nav" aria-label={t(s.ui.menu)}>
            {availableNav.map((n) => (
              <a key={n.href} href={n.href}>
                {t(n.label)}
              </a>
            ))}
          </nav>
          <div className="studio-header-actions">
            <a className="studio-ai-link" href="/">
              {t(s.page.aiLabel)}
              <ArrowRight size={15} />
            </a>
            {language}
            <div className="studio-header-cta">{primary}</div>
            <button
              className="studio-menu-button"
              onClick={() => setMenu(true)}
              aria-label={t(s.ui.menu)}
              aria-expanded={menu}
            >
              <Menu size={25} />
            </button>
          </div>
        </div>
      </header>
      <main id="studio-main">
        <section className="studio-hero">
          <div className="studio-shell studio-hero-grid">
            <div className="studio-hero-copy">
              <p className="studio-eyebrow">{t(s.hero.eyebrow)}</p>
              <h1>
                {t(s.hero.title)}
                <span>{t(s.hero.accent)}</span>
                {t(s.hero.closing)}
              </h1>
              <p className="studio-hero-description">{t(s.hero.description)}</p>
              <div className="studio-actions">
                {primary}
                {s.portfolio.enabled && (
                  <Button
                    href="#studio-work"
                    variant="secondary"
                    icon={<ArrowRight size={18} />}
                  >
                    {t(s.ui.work)}
                  </Button>
                )}
              </div>
              {s.hero.metrics.some((m) => m.verified) && (
                <div className="studio-metrics">
                  {s.hero.metrics
                    .filter((m) => m.verified)
                    .map((m) => (
                      <div key={m.id}>
                        <strong>{m.value}</strong>
                        <span>{t(m.label)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {s.hero.image && (
              <div className="studio-hero-art">
                <img
                  src={s.hero.image}
                  alt={t(s.hero.imageAlt)}
                  width="1448"
                  height="966"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>
        </section>
        {s.ecosystem.enabled && data.partners.length > 0 && (
          <section
            className="studio-ecosystem studio-shell"
            aria-label={t(s.ecosystem.label)}
          >
            <div>
              <p className="studio-eyebrow">{t(s.ecosystem.label)}</p>
              <p className="studio-note">{t(s.ecosystem.note)}</p>
            </div>
            <div className="studio-partners">
              {data.partners.map((p) => (
                <a
                  key={p.id}
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`studio-partner ${p.surface === "light" ? "light" : "dark"}`}
                  aria-label={p.name}
                >
                  <img
                    src={p.logo_url}
                    alt={p.name}
                    loading="lazy"
                    width="160"
                    height="70"
                  />
                </a>
              ))}
            </div>
          </section>
        )}
        {s.portfolio.enabled && s.portfolio.projects.length > 0 && (
          <section id="studio-work" className="studio-work studio-section">
            <div className="studio-shell">
              <div
                className="studio-work-layout"
                data-filtered={filter !== "all"}
              >
                <Heading value={s.portfolio} locale={locale}>
                  <Button
                    href="#studio-projects"
                    variant="secondary"
                    icon={<ArrowRight size={18} />}
                  >
                    {t(s.ui.work)}
                  </Button>
                </Heading>
                <div className="studio-filters" aria-label={t(s.ui.work)}>
                  {Object.entries(s.portfolio.filters)
                    .filter(
                      ([key]) =>
                        key === "all" ||
                        s.portfolio.projects.some((p) => p.category === key),
                    )
                    .map(([key, label]) => (
                      <button
                        key={key}
                        aria-pressed={filter === key}
                        onClick={() => setFilter(key)}
                      >
                        {t(label)}
                      </button>
                    ))}
                </div>
                <div id="studio-projects" className="studio-projects">
                  {projects.map((project) => (
                    <button
                      type="button"
                      className="studio-project"
                      key={project.id}
                      onClick={() => openProject(project)}
                    >
                      <div className="studio-project-image">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={t(project.imageAlt)}
                            style={{ objectPosition: project.position }}
                            width="720"
                            height="540"
                            loading="lazy"
                          />
                        )}
                        <span className="studio-status">
                          {t(s.ui[project.status])}
                        </span>
                        <span className={`studio-tag ${project.category}`}>
                          {t(s.portfolio.filters[project.category])}
                        </span>
                      </div>
                      <div className="studio-project-body">
                        <h3>{t(project.title)}</h3>
                        <p>{t(project.description)}</p>
                        <span
                          className="studio-card-arrow"
                          aria-label={t(s.ui.learnMore)}
                        >
                          <ArrowUpRight size={19} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="studio-note studio-work-note">
                {t(s.portfolio.note)}
              </p>
              <p className="sr-only" role="status">
                {t(s.ui.filterCount)} {projects.length}
              </p>
            </div>
          </section>
        )}
        {s.services.enabled && s.services.items.length > 0 && (
          <section id="studio-services" className="studio-section">
            <div className="studio-shell studio-services-layout">
              <Heading value={s.services} locale={locale} />
              <div className="studio-services">
                {s.services.items.map((item, i) => (
                  <button
                    className="studio-service"
                    key={item.id}
                    onClick={() => detail(item)}
                  >
                    <span className="studio-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <StudioIcon name={item.icon} />
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.description)}</p>
                    <ArrowRight className="studio-service-arrow" size={18} />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {s.process.enabled && s.process.items.length > 0 && (
          <section
            id="studio-process"
            className="studio-section studio-process studio-dark"
          >
            {s.process.image && (
              <img
                className="studio-section-backdrop"
                src={s.process.image}
                alt={t(s.process.imageAlt)}
                loading="lazy"
              />
            )}
            <div className="studio-shell studio-process-layout">
              <Heading value={s.process} locale={locale}>
                {primary}
              </Heading>
              <ol className="studio-steps">
                {s.process.items.map((item, i) => (
                  <li key={item.id}>
                    <button onClick={() => detail(item)}>
                      <div className="studio-step-art">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={t(item.imageAlt)}
                            loading="lazy"
                          />
                        ) : (
                          <StudioIcon name={item.icon} size={38} />
                        )}
                      </div>
                      <div>
                        <span className="studio-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3>{t(item.title)}</h3>
                        <p>{t(item.description)}</p>
                      </div>
                      <ArrowRight size={16} className="studio-step-arrow" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
        {s.why.enabled && (
          <section id="studio-about" className="studio-section">
            <div className="studio-shell studio-why-layout">
              <Heading value={s.why} locale={locale} />
              <div className="studio-values">
                {s.why.items.map((item) => (
                  <button key={item.id} onClick={() => detail(item)}>
                    <span className="studio-value-icon">
                      <StudioIcon name={item.icon} />
                    </span>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.description)}</p>
                  </button>
                ))}
              </div>
              <aside className="studio-focus">
                {s.why.image && (
                  <img
                    src={s.why.image}
                    alt={t(s.why.imageAlt)}
                    loading="lazy"
                  />
                )}
                <div>
                  <h3>{t(s.why.focusTitle)}</h3>
                  <p>{t(s.why.focusBody)}</p>
                </div>
              </aside>
            </div>
          </section>
        )}
        {s.ai.enabled && (
          <section className="studio-section studio-ai studio-dark">
            <div className="studio-shell studio-ai-layout">
              <Heading value={s.ai} locale={locale}>
                <Button
                  href={s.ai.href}
                  variant="secondary"
                  icon={<ArrowRight size={18} />}
                >
                  {t(s.ai.ctaLabel)}
                </Button>
              </Heading>
              {s.ai.image && (
                <img
                  className="studio-ai-art"
                  src={s.ai.image}
                  alt={t(s.ai.imageAlt)}
                  loading="lazy"
                  width="720"
                  height="540"
                />
              )}
              <div className="studio-ai-features">
                {s.ai.items.map((item) => (
                  <button key={item.id} onClick={() => detail(item)}>
                    <StudioIcon name={item.icon} size={23} />
                    <span>
                      <h3>{t(item.title)}</h3>
                      <p>{t(item.description)}</p>
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {s.testimonials.enabled && quotes.length > 0 && (
          <section className="studio-section">
            <div className="studio-shell">
              <div className="studio-testimonial-heading">
                <Heading value={s.testimonials} locale={locale} />
                <div className="studio-quote-controls">
                  <button
                    aria-label={t(s.ui.previous)}
                    onClick={() =>
                      setQuoteIndex(
                        (i) => (i - 1 + quotes.length) % quotes.length,
                      )
                    }
                    disabled={quotes.length < 2}
                  >
                    <ArrowRight
                      style={{ transform: "rotate(180deg)" }}
                      size={18}
                    />
                  </button>
                  <button
                    aria-label={t(s.ui.next)}
                    onClick={() =>
                      setQuoteIndex((i) => (i + 1) % quotes.length)
                    }
                    disabled={quotes.length < 2}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <div className="studio-quotes">
                {Array.from(
                  { length: Math.min(3, quotes.length) },
                  (_, i) => quotes[(quoteIndex + i) % quotes.length],
                ).map((q, i) => (
                  <figure
                    key={q.id}
                    className={`studio-quote studio-quote-${i}`}
                  >
                    <blockquote>{t(q.quote)}</blockquote>
                    <figcaption>
                      {q.image && <img src={q.image} alt="" loading="lazy" />}
                      <span>
                        <strong>{q.name}</strong>
                        <small>{t(q.role)}</small>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
        <section id="studio-contact" className="studio-section studio-final">
          {s.contact.image && (
            <img
              className="studio-section-backdrop"
              src={s.contact.image}
              alt={t(s.contact.imageAlt)}
              loading="lazy"
            />
          )}
          <div className="studio-shell studio-final-inner">
            <Heading value={s.contact} locale={locale}>
              <p>{t(s.contact.body)}</p>
            </Heading>
            <div className="studio-actions">
              {primary}
              {site.lineUrl && (
                <Button
                  className="studio-line"
                  href={site.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  icon={<MessageCircle size={18} />}
                >
                  {t(s.ui.line)}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="studio-footer studio-dark">
        <div className="studio-shell">
          <div className="studio-footer-grid">
            <div>
              <a
                className="studio-brand"
                href={preview ? "#studio-main" : "/studio"}
              >
                {brand}
              </a>
              <p>{t(s.footer.description)}</p>
            </div>
            {s.footer.groups.map((group) => (
              <details
                className="studio-footer-group"
                key={group.id}
                open={!mobileFooter}
              >
                <summary
                  onClick={(event) => {
                    if (!mobileFooter) event.preventDefault();
                  }}
                  tabIndex={mobileFooter ? 0 : -1}
                >
                  {t(group.title)}
                  <ChevronDown size={16} />
                </summary>
                <div>
                  {group.links.map((link, index) => (
                    <a key={`${link.href}-${index}`} href={link.href}>
                      {t(link.label)}
                    </a>
                  ))}
                </div>
              </details>
            ))}
            <div className="studio-footer-language">{language}</div>
          </div>
          <div className="studio-footer-bottom">
            <small>{t(s.page.copyright)}</small>
            <button
              onClick={() =>
                setDialog({
                  title: t(privacy.title),
                  body: <p className="studio-prose">{t(privacy.body)}</p>,
                })
              }
            >
              {t(s.ui.privacy)}
            </button>
            <div>
              {site.email && (
                <a href={`mailto:${site.email}`} aria-label={t(s.ui.email)}>
                  <Mail size={17} />
                </a>
              )}
              {site.linkedin && (
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(s.ui.linkedin)}
                >
                  <Linkedin size={17} />
                </a>
              )}
              {site.lineUrl && (
                <a
                  href={site.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(s.ui.line)}
                >
                  <MessageCircle size={17} />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
      {menu && (
        <Modal
          title={t(s.ui.menu)}
          closeLabel={t(s.ui.close)}
          onClose={() => setMenu(false)}
        >
          <nav className="studio-mobile-nav">
            {availableNav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenu(false)}>
                {t(n.label)}
                <ArrowUpRight size={18} />
              </a>
            ))}
            <a href="/">
              {t(s.page.aiLabel)}
              <ArrowRight size={18} />
            </a>
          </nav>
          <Button
            onClick={() => {
              setMenu(false);
              contact();
            }}
            icon={<ArrowRight size={18} />}
          >
            {t(s.ui.consultation)}
          </Button>
        </Modal>
      )}
      {dialog && (
        <Modal
          title={dialog.title}
          closeLabel={t(s.ui.close)}
          onClose={() => setDialog(null)}
        >
          {dialog.body}
        </Modal>
      )}
    </div>
  );
}
