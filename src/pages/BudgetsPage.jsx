import { useState } from "react";

import BottomSheet from "../components/BottomSheet";
import BudgetCard from "../components/BudgetCard";
import BudgetForm from "../components/BudgetForm";
import { CategoryChips } from "../components/CategoryBreakdown";
import { InfoIcon, PlusIcon } from "../components/Icons";
import PageHeader from "../components/PageHeader";
import SpendGauge, { gaugeAmountClass } from "../components/SpendGauge";
import { useCurrencyFormatter } from "../context/BrandContext";
import { EXPENSE_CATEGORIES, filterByMonth, getCategoryMeta, MONTH_NAMES, sumAmounts } from "../utils/finance";

/**
 * Budgets: this month's spending against each category limit.
 * Spending is calculated automatically from expense transactions.
 */
function BudgetsPage({ budgets, transactions, addBudget, updateBudget, deleteBudget }) {
  const formatCurrency = useCurrencyFormatter();
  const [formOpen, setFormOpen] = useState(false);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1; // including today

  const monthExpenses = filterByMonth(transactions, today.getMonth(), today.getFullYear()).filter(
    (transaction) => transaction.type === "expense"
  );
  const spentFor = (category) => sumAmounts(monthExpenses.filter((transaction) => transaction.category === category));

  const rows = budgets
    .map((budget) => ({ category: budget.category, amount: spentFor(budget.category) }))
    .filter((row) => row.amount > 0)
    .sort((first, second) => second.amount - first.amount);

  const totalBudget = budgets.reduce((total, budget) => total + Number(budget.limit), 0);
  const totalSpent = rows.reduce((total, row) => total + row.amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Categories closest to (or over) their limit first.
  const sortedBudgets = [...budgets].sort(
    (first, second) => spentFor(second.category) / second.limit - spentFor(first.category) / first.limit
  );
  const canAdd = budgets.length < EXPENSE_CATEGORIES.length;

  const addButton = canAdd && (
    <button type="button" onClick={() => setFormOpen(true)} className="pill flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm">
      <PlusIcon className="h-4 w-4" /> New
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Monthly budget" subtitle={`${MONTH_NAMES[today.getMonth()]} · ${daysLeft} days left`} action={addButton} />

      <div className="space-y-5 px-4 pt-4 sm:px-6 lg:px-8">
        {budgets.length === 0 ? (
          <section className="panel px-6 py-12 text-center">
            <p className="text-lg font-bold">No budgets yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Set a monthly limit for categories like Food or Shopping and see how much you can still spend.
            </p>
            <button type="button" onClick={() => setFormOpen(true)} className="btn-primary mt-6 px-6 text-sm">
              Create your first budget
            </button>
          </section>
        ) : (
          <>
            {/* Overview gauge */}
            <section className="panel px-5 pt-6 pb-5">
              <SpendGauge
                parts={rows.map((row) => ({ color: getCategoryMeta(row.category).color, value: row.amount }))}
                capacity={totalBudget}
                label={`Spent ${formatCurrency(totalSpent)} of ${formatCurrency(totalBudget)}`}
              >
                <p className="text-sm text-muted">{totalRemaining >= 0 ? "Left to spend" : "Over budget"}</p>
                <p className={`${gaugeAmountClass(formatCurrency(Math.abs(totalRemaining)))} ${totalRemaining < 0 ? "text-down" : ""}`}>
                  {formatCurrency(Math.abs(totalRemaining))}
                </p>
              </SpendGauge>

              {rows.length > 0 && (
                <div className="mt-5 flex justify-center">
                  <CategoryChips rows={rows} />
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="tile min-w-0 p-3 text-center">
                  <p className="text-xs text-muted">Spent</p>
                  <p className="money mt-1 truncate font-bold">{formatCurrency(totalSpent, { whole: true })}</p>
                </div>
                <div className="tile min-w-0 p-3 text-center">
                  <p className="text-xs text-muted">Safe daily spend</p>
                  <p className="money mt-1 truncate font-bold">{formatCurrency(Math.max(totalRemaining, 0) / daysLeft, { whole: true })}</p>
                </div>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
                <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                Your monthly spending limit is {formatCurrency(totalBudget, { whole: true })}
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  spent={spentFor(budget.category)}
                  daysLeft={daysLeft}
                  updateBudget={updateBudget}
                  deleteBudget={deleteBudget}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="New budget">
        <BudgetForm
          budgets={budgets}
          onSubmit={(budget) => {
            addBudget(budget);
            setFormOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}

export default BudgetsPage;
