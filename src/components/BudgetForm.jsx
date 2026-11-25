import { useState } from "react";

import { useBrand } from "../context/BrandContext";
import { EXPENSE_CATEGORIES, getCategoryMeta } from "../utils/finance";

/**
 * BudgetForm creates a monthly spending limit for an expense category.
 * Categories that already have a budget are not offered again.
 */
function BudgetForm({ budgets, onSubmit }) {
  const { settings } = useBrand();
  const available = EXPENSE_CATEGORIES.filter((category) => !budgets.some((budget) => budget.category === category));

  const [category, setCategory] = useState(available[0] ?? "");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");

  if (available.length === 0) {
    return (
      <p className="tile px-4 py-4 text-sm text-muted">
        Every expense category already has a budget. Edit an existing budget to change its limit.
      </p>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!(Number(limit) > 0)) return setError("Enter a monthly limit greater than 0.");
    onSubmit({ category, limit: Number(limit) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-muted">Category</legend>
        <div className="grid grid-cols-4 gap-2">
          {available.map((item) => {
            const selected = item === category;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(item)}
                className={`flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 text-[11px] font-semibold transition sm:text-xs ${
                  selected ? "border-brand bg-brand/20 text-white" : "border-line bg-white/[0.03] text-muted hover:text-white"
                }`}
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {getCategoryMeta(item).icon}
                </span>
                <span className="w-full truncate text-center">{item}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="tile px-4 py-4 text-center">
        <label htmlFor="budget-limit" className="text-xs font-semibold tracking-wide text-muted uppercase">
          Monthly limit ({settings.currency})
        </label>
        <input
          id="budget-limit"
          type="number"
          inputMode="decimal"
          min="1"
          value={limit}
          onChange={(event) => {
            setLimit(event.target.value);
            setError("");
          }}
          placeholder="0"
          aria-invalid={Boolean(error)}
          className="money mt-1 w-full bg-transparent text-center text-4xl! font-bold outline-none placeholder:text-white/20"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-down/10 px-4 py-3 text-sm font-medium text-down">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full">
        Create {category} budget
      </button>
    </form>
  );
}

export default BudgetForm;
