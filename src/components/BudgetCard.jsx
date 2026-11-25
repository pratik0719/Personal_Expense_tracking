import { useState } from "react";

import { useCurrencyFormatter } from "../context/BrandContext";
import { getCategoryMeta } from "../utils/finance";

/** Status label and colour for how much of a budget is used. */
const getStatus = (percentage) => {
  if (percentage >= 100) return { text: "Over budget", className: "bg-down/15 text-down" };
  if (percentage >= 90) return { text: "Almost at limit", className: "bg-down/15 text-down" };
  if (percentage >= 75) return { text: "Watch spending", className: "bg-amber-400/15 text-amber-300" };
  return { text: "On track", className: "bg-up/15 text-up" };
};

/**
 * BudgetCard: one category's spending against its monthly limit,
 * what is left per remaining day, and edit / delete actions.
 */
function BudgetCard({ budget, spent, daysLeft, updateBudget, deleteBudget }) {
  const formatCurrency = useCurrencyFormatter();
  const [isEditing, setIsEditing] = useState(false);
  const [draftLimit, setDraftLimit] = useState(String(budget.limit));

  const meta = getCategoryMeta(budget.category);
  const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
  const remaining = budget.limit - spent;
  const status = getStatus(percentage);

  const saveLimit = (event) => {
    event.preventDefault();
    if (Number(draftLimit) > 0) {
      updateBudget({ ...budget, limit: Number(draftLimit) });
      setIsEditing(false);
    }
  };

  return (
    <article className="panel p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.06] text-lg" aria-hidden="true">
          {meta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{budget.category}</h3>
          <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>{status.text}</span>
        </div>
        <p className="money shrink-0 text-lg font-bold">{percentage.toFixed(0)}%</p>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${budget.category} budget used`}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: percentage >= 100 ? "var(--color-down)" : meta.color }}
        />
      </div>

      <p className="mt-3 truncate text-sm text-muted">
        <span className="money font-semibold text-white">{formatCurrency(spent, { whole: true })}</span> of{" "}
        <span className="money">{formatCurrency(budget.limit, { whole: true })}</span>
      </p>
      <p className={`mt-0.5 text-xs ${remaining >= 0 ? "text-muted" : "font-semibold text-down"}`}>
        {remaining >= 0
          ? `${formatCurrency(remaining, { whole: true })} left · ~${formatCurrency(remaining / daysLeft, { whole: true })}/day`
          : `Over by ${formatCurrency(Math.abs(remaining), { whole: true })}`}
      </p>

      {isEditing ? (
        <form onSubmit={saveLimit} className="mt-4 flex gap-2 border-t border-line pt-4">
          <label className="sr-only" htmlFor={`limit-${budget.id}`}>
            New monthly limit
          </label>
          <input
            id={`limit-${budget.id}`}
            type="number"
            inputMode="decimal"
            min="1"
            value={draftLimit}
            onChange={(event) => setDraftLimit(event.target.value)}
            className="field min-w-0 py-2"
          />
          <button type="submit" disabled={!(Number(draftLimit) > 0)} className="btn-primary shrink-0 px-4 py-2 text-sm">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftLimit(String(budget.limit));
              setIsEditing(false);
            }}
            className="shrink-0 px-2 text-sm font-semibold text-muted"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="mt-3 flex gap-2 border-t border-line pt-3">
          <button type="button" onClick={() => setIsEditing(true)} className="flex-1 rounded-full py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5">
            Edit limit
          </button>
          <button
            type="button"
            onClick={() => window.confirm(`Delete the ${budget.category} budget?`) && deleteBudget(budget.id)}
            className="flex-1 rounded-full py-2 text-sm font-semibold text-down transition hover:bg-down/10"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default BudgetCard;
