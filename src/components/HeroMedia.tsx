import { useEffect, useRef, useState } from "react";
import { NeuralX } from "./NeuralX";

type HeroMediaProps = {
  videoUrl?: string;
  posterUrl?: string;
  caption: string;
};

/** CMS owns media references; this component owns playback and static recovery. */
export function HeroMedia({ videoUrl, posterUrl, caption }: HeroMediaProps) {
  if (!videoUrl) {
    return (
      <div className="hero-visual">
        <div className="mesh-orbit" aria-hidden="true" />
        <NeuralX />
        <p className="visual-caption">{caption}</p>
      </div>
    );
  }
  return (
    <HeroVideo
      key={`${videoUrl}|${posterUrl || ""}`}
      videoUrl={videoUrl}
      posterUrl={posterUrl}
    />
  );
}

function HeroVideo({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string;
  posterUrl?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hasFrame, setHasFrame] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element || reducedMotion || videoFailed || hasEnded) return;
    let visible = true;
    let disposed = false;
    const updatePlayback = () => {
      // Scrolling back or returning to the tab must not replay a completed banner.
      if (element.ended) return;
      if (document.hidden || !visible) {
        element.pause();
        return;
      }
      // Autoplay policies and interrupted play attempts are normal; keep the poster.
      void element.play().catch(() => {
        if (!disposed && element.paused) setHasFrame(false);
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0 },
    );
    if (frame.current) observer.observe(frame.current);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      element.pause();
    };
  }, [reducedMotion, videoFailed, hasEnded]);

  return (
    <div className="hero-visual hero-visual--video" aria-hidden="true">
      <div
        ref={frame}
        className={`hero-media-frame ${hasFrame && !reducedMotion && !videoFailed ? "has-video-frame" : ""}`}
      >
        {posterUrl && !posterFailed ? (
          <img
            className="hero-media-poster"
            src={posterUrl}
            width="1920"
            height="1080"
            alt=""
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <div className="hero-media-static">
            <NeuralX />
          </div>
        )}
        {!reducedMotion && !videoFailed && (
          <video
            ref={video}
            src={videoUrl}
            poster={posterUrl || undefined}
            autoPlay={!hasEnded}
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            disablePictureInPicture
            onPlaying={() => setHasFrame(true)}
            onEnded={() => setHasEnded(true)}
            onError={() => {
              setHasFrame(false);
              setVideoFailed(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
