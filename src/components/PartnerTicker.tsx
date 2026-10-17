import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SiteData } from "../content";

export function PartnerTicker({
  partners,
  label,
}: {
  partners: SiteData["partners"];
  label: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    const frame = viewport.current;
    const group = sequence.current;
    if (!frame || !group) return;
    const resize = new ResizeObserver(() => {
      setViewportWidth(frame.clientWidth);
      // Keep a steady pace as CMS items or viewport change.
      setDuration(group.getBoundingClientRect().width / 32);
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
  }, [partners.length]);

  if (!partners.length) return null;
  const moving = partners.length > 1;
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

  return (
    <div
      className={`partner-strip partner-ticker ${moving ? "is-animated" : ""}`}
      data-paused={!visible}
      style={
        {
          "--ticker-viewport": `${viewportWidth}px`,
          "--ticker-count": partners.length,
          "--ticker-duration": `${duration}s`,
        } as CSSProperties
      }
    >
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
