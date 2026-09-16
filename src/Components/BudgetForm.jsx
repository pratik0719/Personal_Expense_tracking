import { useState } from "react";

const budgetCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

/**
 * BudgetForm allows the user to create
 * a monthly spending limit for an expense category.
 */
function BudgetForm({
  addBudget,
  budgets,
}) {
  const [category, setCategory] =
    useState("Food");

  const [limit, setLimit] =
    useState("");

  /**
   * Handles the budget form submission.
   *
   * This function:
   * - Prevents page refresh.
   * - Validates the budget limit.
   * - Prevents duplicate category budgets.
   * - Sends the budget to App.jsx.
   * - Clears the form after success.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!limit) {
      alert(
        "Please enter a monthly budget limit."
      );

      return;
    }

    if (Number(limit) <= 0) {
      alert(
        "Budget limit must be greater than 0."
      );

      return;
    }

    const budgetAlreadyExists =
      budgets.some(
        (budget) =>
          budget.category === category
      );

    if (budgetAlreadyExists) {
      alert(
        `A budget already exists for ${category}.`
      );

      return;
    }

    const newBudget = {
      category,
      limit: Number(limit),
    };

    addBudget(newBudget);

    setLimit("");
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Create Budget
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Set a monthly spending limit
          for an expense category.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Category */}
        <div>
          <label
            htmlFor="budget-category"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Category
          </label>

          <select
            id="budget-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            {budgetCategories.map(
              (categoryItem) => (
                <option
                  key={categoryItem}
                  value={categoryItem}
                >
                  {categoryItem}
                </option>
              )
            )}
          </select>
        </div>

        {/* Monthly Limit */}
        <div>
          <label
            htmlFor="budget-limit"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Monthly Limit
          </label>

          <input
            id="budget-limit"
            type="number"
            min="0.01"
            step="0.01"
            value={limit}
            onChange={(event) =>
              setLimit(
                event.target.value
              )
            }
            placeholder="Example: 500"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {/* Submit Budget */}
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
        >
          + Create Budget
        </button>

      </form>

    </section>
  );
}

export default BudgetForm;