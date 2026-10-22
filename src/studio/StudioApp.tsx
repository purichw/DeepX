import { useEffect, useState } from "react";
import { loadSite, type SiteData } from "../content";
import { StudioWebsite } from "./StudioWebsite";

export default function StudioApp() {
  const [data, setData] = useState<SiteData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setFailed(false);
    loadSite(abort.signal)
      .then(setData)
      .catch(() => {
        if (!abort.signal.aborted) setFailed(true);
      });
    return () => abort.abort();
  }, [attempt]);
  if (failed)
    return (
      <main className="loading-screen">
        <h1>ยังโหลด Product Studio ไม่สำเร็จ</h1>
        <p>Unable to load Product Studio.</p>
        <button
          className="button primary"
          onClick={() => setAttempt((n) => n + 1)}
        >
          ลองอีกครั้ง / Retry
        </button>
        <a href="/">DeepX</a>
      </main>
    );
  if (!data)
    return (
      <main className="loading-screen" role="status">
        กำลังโหลด Product Studio…
      </main>
    );
  if (!data.content.studio)
    return (
      <main className="loading-screen">
        <h1>DeepX Product Studio</h1>
        <p>กำลังเตรียมเปิดตัว / Coming soon</p>
        <a href="/">DeepX</a>
      </main>
    );
  return <StudioWebsite data={data} studio={data.content.studio} />;
}
