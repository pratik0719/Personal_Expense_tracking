import BudgetForm from "../components/BudgetForm";
import BudgetCard from "../components/BudgetCard";

/**
 * BudgetsPage manages the monthly budget interface.
 *
 * It:
 * - Displays budget totals.
 * - Displays every category budget.
 * - Calculates category spending from real transactions.
 * - Allows users to create budgets.
 * - Allows users to delete budgets.
 */
function BudgetsPage({
  budgets,
  transactions,
  addBudget,
  deleteBudget,
}) {
  /**
   * Returns the current month
   * and year as readable text.
   */
  const getCurrentMonthLabel = () => {
    return new Date().toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  /**
   * Checks whether a transaction occurred
   * during the current month.
   */
  const isCurrentMonth = (
    transactionDate
  ) => {
    const today = new Date();

    const date = new Date(
      `${transactionDate}T00:00:00`
    );

    return (
      date.getMonth() ===
        today.getMonth() &&
      date.getFullYear() ===
        today.getFullYear()
    );
  };

  /**
   * Calculates the current month's
   * expense total for one category.
   */
  const getCategorySpent = (
    category
  ) => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type ===
            "expense" &&
          transaction.category ===
            category &&
          isCurrentMonth(
            transaction.date
          )
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount),
        0
      );
  };

  /**
   * Formats monetary values into
   * USD currency.
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
   * Calculates the combined value
   * of all created budgets.
   */
  const totalBudget = budgets.reduce(
    (total, budget) =>
      total + Number(budget.limit),
    0
  );

  /**
   * Calculates how much money has been
   * spent across categories that currently
   * have a budget.
   */
  const totalSpent = budgets.reduce(
    (total, budget) =>
      total +
      getCategorySpent(
        budget.category
      ),
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  const currentMonth =
    getCurrentMonthLabel();

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Money Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Monthly Budgets
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your spending limits
            for {currentMonth}.
          </p>
        </div>

        <div className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
          {currentMonth}
        </div>

      </div>

      {/* Budget Summary */}
      <section className="mt-7 grid gap-4 sm:grid-cols-3">

        {/* Total Budget */}
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Total Budget
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(
              totalBudget
            )}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Monthly spending limit
          </p>

        </article>

        {/* Total Spent */}
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Total Spent
          </p>

          <h2 className="mt-3 text-2xl font-bold text-rose-600">
            {formatCurrency(
              totalSpent
            )}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Budgeted category expenses
          </p>

        </article>

        {/* Remaining Budget */}
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Remaining
          </p>

          <h2
            className={`mt-3 text-2xl font-bold ${
              totalRemaining >= 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {formatCurrency(
              totalRemaining
            )}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Available budget this month
          </p>

        </article>

      </section>

      {/* Main Budget Content */}
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.65fr_1.35fr]">

        {/* Budget Creation Form */}
        <BudgetForm
          addBudget={addBudget}
          budgets={budgets}
        />

        {/* Budget List */}
        <section>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Category Budgets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Spending is calculated automatically from your expense transactions.
            </p>
          </div>

          {/* Empty State */}
          {budgets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                ◔
              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                No budgets created
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Create your first category budget to start tracking your monthly spending.
              </p>

            </div>
          ) : (

            <div className="grid gap-4 md:grid-cols-2">

              {budgets.map(
                (budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    spent={getCategorySpent(
                      budget.category
                    )}
                    deleteBudget={
                      deleteBudget
                    }
                  />
                )
              )}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default BudgetsPage;