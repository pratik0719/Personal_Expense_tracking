/**
 * BudgetCard displays one category budget.
 *
 * It shows:
 * - Budget category
 * - Monthly limit
 * - Amount already spent
 * - Remaining amount
 * - Percentage used
 * - Spending warning
 * - Delete button
 */
function BudgetCard({
  budget,
  spent,
  deleteBudget,
}) {
  /**
   * Formats numbers into USD currency.
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(amount);
  };

  /**
   * Calculates the percentage of
   * the budget already used.
   */
  const calculatePercentage = () => {
    if (budget.limit <= 0) {
      return 0;
    }

    return (
      (spent / budget.limit) *
      100
    );
  };

  /**
   * Returns the progress-bar color
   * based on how much of the budget
   * has already been used.
   */
  const getProgressColor = (
    percentage
  ) => {
    if (percentage >= 90) {
      return "bg-rose-500";
    }

    if (percentage >= 75) {
      return "bg-amber-500";
    }

    return "bg-emerald-500";
  };

  /**
   * Returns a readable budget status.
   */
  const getBudgetStatus = (
    percentage
  ) => {
    if (percentage >= 100) {
      return {
        text: "Budget exceeded",
        style:
          "bg-rose-50 text-rose-600",
      };
    }

    if (percentage >= 90) {
      return {
        text: "Almost at limit",
        style:
          "bg-rose-50 text-rose-600",
      };
    }

    if (percentage >= 75) {
      return {
        text: "Watch spending",
        style:
          "bg-amber-50 text-amber-600",
      };
    }

    return {
      text: "On track",
      style:
        "bg-emerald-50 text-emerald-600",
    };
  };

  /**
   * Deletes the current budget
   * after asking for confirmation.
   */
  const handleDelete = () => {
    const confirmed =
      window.confirm(
        `Delete the ${budget.category} budget?`
      );

    if (confirmed) {
      deleteBudget(budget.id);
    }
  };

  const percentage =
    calculatePercentage();

  const displayedPercentage =
    percentage.toFixed(0);

  const progressWidth =
    Math.min(percentage, 100);

  const remaining =
    budget.limit - spent;

  const status =
    getBudgetStatus(percentage);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

      {/* Budget Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {budget.category}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Monthly Budget
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          Delete
        </button>

      </div>

      {/* Spent vs Limit */}
      <div className="mt-6 flex items-end justify-between gap-3">

        <div>
          <p className="text-xs font-medium text-slate-400">
            SPENT
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(spent)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">
            LIMIT
          </p>

          <p className="mt-1 font-semibold text-slate-600">
            {formatCurrency(
              budget.limit
            )}
          </p>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.style}`}
          >
            {status.text}
          </span>

          <span className="text-sm font-bold text-slate-700">
            {displayedPercentage}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
              percentage
            )}`}
            style={{
              width: `${progressWidth}%`,
            }}
          />

        </div>

      </div>

      {/* Remaining Amount */}
      <div className="mt-5 border-t border-slate-100 pt-4">

        {remaining >= 0 ? (
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {formatCurrency(
                remaining
              )}
            </span>{" "}
            remaining this month
          </p>
        ) : (
          <p className="text-sm text-rose-600">
            Over budget by{" "}
            <span className="font-bold">
              {formatCurrency(
                Math.abs(remaining)
              )}
            </span>
          </p>
        )}

      </div>

    </article>
  );
}

export default BudgetCard;