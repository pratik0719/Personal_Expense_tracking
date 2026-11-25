import { useRegisterSW } from "virtual:pwa-register/react";

const HOUR = 60 * 60 * 1000;

/**
 * Registers the service worker and tells the user about it:
 * - once, when the app has been saved for offline use;
 * - whenever a newer version is available, with a button to load it.
 */
function AppUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Long-lived tabs (and installed apps) check for new versions every hour.
      if (registration) setInterval(() => registration.update().catch(() => {}), HOUR);
    },
    onRegisterError(error) {
      console.error("Service worker registration failed:", error);
    },
  });

  if (!offlineReady && !needRefresh) return null;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div role="status" className="panel flex w-full max-w-md items-center gap-3 px-4 py-3 text-sm">
        <p className="flex-1">
          {needRefresh ? "A new version of the app is available." : "App saved for offline use — it now works without internet."}
        </p>
        {needRefresh && (
          <button type="button" onClick={() => updateServiceWorker(true)} className="btn-primary shrink-0 px-4 py-2 text-xs">
            Update
          </button>
        )}
        <button type="button" onClick={close} className="shrink-0 text-xs font-semibold text-muted hover:text-white">
          {needRefresh ? "Later" : "OK"}
        </button>
      </div>
    </div>
  );
}

export default AppUpdatePrompt;
