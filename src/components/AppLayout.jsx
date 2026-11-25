import { Outlet } from "react-router-dom";

import { CloseIcon } from "./Icons";
import Sidebar from "./Sidebar";
import { TransactionSheetProvider } from "../context/TransactionSheetContext";

/**
 * AppLayout is the shared shell around every page.
 *
 * Desktop: sidebar + page content.
 * Mobile:  page content + floating tab bar. The bottom padding keeps the
 *          last item clear of the tab bar and the iPhone home indicator.
 *
 * Also shows an app-wide notice if a change couldn't be saved.
 */
function AppLayout({
  addTransaction,
  updateTransaction,
  deleteTransaction,
  error,
  clearError,
}) {
  return (
    <TransactionSheetProvider
      addTransaction={addTransaction}
      updateTransaction={updateTransaction}
      deleteTransaction={deleteTransaction}
    >
      <div className="min-h-dvh lg:flex">
        <Sidebar />

        <main className="min-w-0 flex-1 pt-[env(safe-area-inset-top)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-10">
          {error && (
            <div role="alert" className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-down/10 px-4 py-3 text-sm text-down sm:mx-6 lg:mx-8">
              <p className="flex-1">{error}</p>
              <button type="button" onClick={clearError} aria-label="Dismiss" className="shrink-0">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </TransactionSheetProvider>
  );
}

export default AppLayout;
