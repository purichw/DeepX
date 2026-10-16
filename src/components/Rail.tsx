import { useRef, useState, useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Rail({
  children,
  count,
  name,
  previous,
  next,
  slide,
  kind,
}: {
  children: ReactNode;
  count: number;
  name: string;
  previous: string;
  next: string;
  slide: string;
  kind: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  useEffect(() => {
    const el = ref.current!;
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 2);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    check();
    return () => observer.disconnect();
  }, [count]);
  function go(value: number) {
    const el = ref.current!;
    const target = el.children[
      Math.max(0, Math.min(count - 1, value))
    ] as HTMLElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: target.offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  return (
    <div className={`rail-wrap ${kind}`}>
      <div
        ref={ref}
        className="rail"
        aria-label={name}
        onScroll={() => {
          const el = ref.current!;
          const step =
            (el.children[0] as HTMLElement).offsetWidth +
            parseFloat(getComputedStyle(el).gap || "0");
          setIndex(Math.round(el.scrollLeft / step));
        }}
      >
        {children}
      </div>
      {canScroll && (
        <div className="rail-controls">
          <button
            className="icon-button"
            aria-label={previous}
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            <ArrowLeft size={17} />
          </button>
          <div className="rail-dots">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                aria-label={`${slide} ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => go(i)}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            className="icon-button"
            aria-label={next}
            onClick={() => go(index + 1)}
            disabled={
              index >= count - 1 ||
              (ref.current
                ? ref.current.scrollLeft + ref.current.clientWidth >=
                  ref.current.scrollWidth - 3
                : false)
            }
          >
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
