import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
type HotClient = { url: string; key: string; client: SupabaseClient };
const cached = import.meta.hot?.data.cmsClient as HotClient | undefined;
const reusable =
  cached && cached.url === url && cached.key === key ? cached.client : null;
if (cached && !reusable) void cached.client.auth.dispose();

export const cmsClient =
  url && key
    ? reusable ||
      createClient(url, key, {
        global: {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              signal: init?.signal
                ? AbortSignal.any([init.signal, AbortSignal.timeout(20000)])
                : AbortSignal.timeout(20000),
            }),
        },
        auth: {
          storageKey: "deepx.cms.auth",
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

// Keep one auth lifecycle across Vite updates. Repeated clients leave background
// refreshers racing over the same persisted session and BroadcastChannel.
if (import.meta.hot && cmsClient)
  import.meta.hot.data.cmsClient = {
    url,
    key,
    client: cmsClient,
  } satisfies HotClient;

function beforeDeadline<T>(
  operation: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject({ code: "REQUEST_TIMEOUT" });
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    operation.then(
      (value) => {
        signal.removeEventListener("abort", abort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", abort);
        reject(error);
      },
    );
  });
}

// A fresh captured session avoids an SDK session-lock wait. An expiring session
// gets one bounded refresh before the RPC; refresh and HTTP share one deadline.
// The write itself is never retried, including after a timeout or expired JWT.
export async function requestCms(
  name: "cms_get_workspace" | "cms_save_draft" | "cms_publish",
  parameters: Record<string, unknown>,
  capturedSession: Session,
): Promise<unknown> {
  if (
    !url ||
    !key ||
    !capturedSession?.access_token ||
    !capturedSession.user?.id
  )
    throw { code: "SESSION_REQUIRED" };
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 15000);
  try {
    let session = capturedSession;
    if (
      !session.expires_at ||
      session.expires_at * 1000 <= Date.now() + 60000
    ) {
      if (!cmsClient) throw { code: "SESSION_REQUIRED" };
      // Refresh the SDK's current identity, never reinstall a captured refresh
      // token that may belong to an account which has since signed out.
      const refreshed = await beforeDeadline(
        cmsClient.auth.refreshSession(),
        controller.signal,
      );
      let refreshedSession = refreshed.data.session;
      let refreshError = refreshed.error;
      if (refreshError || !refreshedSession) {
        // Another tab may have committed a rotated session first. The SDK
        // rejects the losing refresh, but its current session read recovers
        // the winner. This does not retry a content request or reinstall a token.
        const current = await beforeDeadline(
          cmsClient.auth.getSession(),
          controller.signal,
        );
        refreshedSession = current.data.session;
        refreshError = current.error;
      }
      if (
        refreshError ||
        !refreshedSession ||
        refreshedSession.user.id !== capturedSession.user.id ||
        !refreshedSession.access_token ||
        !refreshedSession.expires_at ||
        refreshedSession.expires_at * 1000 <= Date.now()
      )
        throw { code: "SESSION_REQUIRED" };
      session = refreshedSession;
    }
    // A late SDK refresh can settle after the caller timed out, but cannot send
    // a content mutation after the operation's deadline has elapsed.
    if (controller.signal.aborted) throw { code: "REQUEST_TIMEOUT" };
    const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok) throw result;
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw { code: "REQUEST_TIMEOUT" };
    throw error;
  } finally {
    clearTimeout(deadline);
  }
}
