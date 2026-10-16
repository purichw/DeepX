import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import type { Locale, SiteData } from "../content";
import { Rail } from "./Rail";

export function PartnerTicker({
  partners,
  label,
  locale,
  previous,
  next,
  slide,
}: {
  partners: SiteData["partners"];
  label: string;
  locale: Locale;
  previous: string;
  next: string;
  slide: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [duration, setDuration] = useState(60);
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const media = matchMedia("(max-width: 640px)");
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const frame = viewport.current;
    const group = sequence.current;
    if (!frame || !group) return;
    const resize = new ResizeObserver(() => {
      setViewportWidth(frame.clientWidth);
      // A constant 22px/s keeps the pace calm as CMS items or viewport change.
      setDuration(group.getBoundingClientRect().width / 22);
    });
    resize.observe(frame);
    resize.observe(group);
    let onScreen = true;
    const updateVisibility = () => setVisible(onScreen && !document.hidden);
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      updateVisibility();
    });
    intersection.observe(frame);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [partners.length, mobile]);

  if (!partners.length) return null;
  const moving = partners.length > 1;
  // These are operational control labels, not editable partner/business content.
  const controlLabel = paused
    ? locale === "th"
      ? "เล่นโลโก้ต่อ"
      : "Resume logo animation"
    : locale === "th"
      ? "หยุดโลโก้ชั่วคราว"
      : "Pause logo animation";
  const logos = (duplicate = false) =>
    partners.map((partner) => (
      <a
        className={`partner-logo ${partner.surface === "light" ? "partner-logo-light" : ""}`}
        key={partner.id}
        href={partner.website_url}
        target="_blank"
        rel="noreferrer"
        tabIndex={duplicate ? -1 : undefined}
      >
        <img
          src={partner.logo_url}
          alt={duplicate ? "" : partner.name}
          loading="lazy"
        />
      </a>
    ));

  // Keep the existing desktop/tablet renderer and layout exactly as before.
  if (!mobile) {
    return (
      <Rail
        kind="partner-strip"
        name={label}
        count={partners.length}
        previous={previous}
        next={next}
        slide={slide}
      >
        {logos()}
      </Rail>
    );
  }

  return (
    <div
      className={`partner-strip partner-ticker ${moving ? "is-animated" : ""}`}
      data-paused={paused || !visible}
      style={
        {
          "--ticker-viewport": `${viewportWidth}px`,
          "--ticker-duration": `${duration}s`,
        } as CSSProperties
      }
    >
      {moving && (
        <button
          className="icon-button partner-ticker-toggle"
          type="button"
          aria-label={controlLabel}
          title={controlLabel}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      )}
      <div
        ref={viewport}
        className="partner-ticker-viewport"
        role="region"
        aria-label={label}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            event.currentTarget.scrollLeft = 0;
          }
        }}
      >
        <div className="partner-ticker-track">
          <div ref={sequence} className="partner-ticker-group">
            {logos()}
          </div>
          {moving && (
            <div
              className="partner-ticker-group partner-ticker-copy"
              aria-hidden="true"
            >
              {logos(true)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
