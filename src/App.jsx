import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import AppUpdatePrompt from "./components/AppUpdatePrompt";
import { useLocalData } from "./data/useLocalData";

// Load route pages on demand so the chart library stays out of the initial bundle.
const HomePage = lazy(() => import("./pages/HomePage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const BudgetsPage = lazy(() => import("./pages/BudgetsPage"));
const LoansPage = lazy(() => import("./pages/LoansPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function Splash({ label = "Loading…" }) {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-4 text-sm text-muted">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-brand" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}

/**
 * App owns all transactions, budgets and loans. They are stored on this
 * device (IndexedDB, see data/useLocalData.js) — no account or server —
 * so the app works fully offline.
 */
function App() {
  const data = useLocalData();

  if (!data.ready) return <Splash label="Loading your data…" />;

  const { transactions, budgets, loans, tx, budget, loan } = data;

  return (
    <>
      <AppUpdatePrompt />
      <Suspense fallback={<Splash />}>
        <Routes>
          <Route
            element={
              <AppLayout
                addTransaction={tx.add}
                updateTransaction={tx.update}
                deleteTransaction={tx.remove}
                error={data.error}
                clearError={data.clearError}
              />
            }
          >
            <Route path="/" element={<HomePage transactions={transactions} budgets={budgets} loans={loans} />} />
            <Route path="/activity" element={<ActivityPage transactions={transactions} />} />
            <Route path="/report" element={<ReportPage transactions={transactions} budgets={budgets} />} />
            <Route
              path="/budgets"
              element={
                <BudgetsPage
                  budgets={budgets}
                  transactions={transactions}
                  addBudget={budget.add}
                  updateBudget={budget.update}
                  deleteBudget={budget.remove}
                />
              }
            />
            <Route
              path="/loans"
              element={
                <LoansPage
                  loans={loans}
                  addLoan={(item) => loan.add({ payments: [], ...item })}
                  updateLoan={loan.update}
                  deleteLoan={loan.remove}
                  addPayment={loan.addPayment}
                  deletePayment={loan.deletePayment}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  transactions={transactions}
                  budgets={budgets}
                  loans={loans}
                  replaceAllData={data.replaceAllData}
                />
              }
            />

            {/* Old routes from the previous layout */}
            <Route path="/income" element={<Navigate to="/activity?type=income" replace />} />
            <Route path="/expenses" element={<Navigate to="/activity?type=expense" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
