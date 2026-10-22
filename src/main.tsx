import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-thai";
import "./styles.css";
import { App } from "./App";
const CmsApp = lazy(() => import("./cms/CmsApp"));
const StudioApp = lazy(() => import("./studio/StudioApp"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <main className="loading-screen" role="status">
          กำลังโหลด…
        </main>
      }
    >
      {location.pathname.startsWith("/admin") ? (
        <CmsApp />
      ) : /^\/studio\/?$/.test(location.pathname) ? (
        <StudioApp />
      ) : (
        <App />
      )}
    </Suspense>
  </React.StrictMode>,
);
