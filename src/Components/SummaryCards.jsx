import { Link } from "react-router-dom";

/**
 * SummaryCards calculates and displays
 * the main financial information.
 *
 * It shows:
 * - Balance
 * - Income
 * - Expenses
 * - Savings rate
 */
function SummaryCards({ transactions }) {
  /**
   * Calculates total income.
   */
  const calculateIncome = () => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );
  };

  /**
   * Calculates total expenses.
   */
  const calculateExpenses = () => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );
  };

  /**
   * Formats a number into USD currency.
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

  const totalIncome = calculateIncome();
  const totalExpenses = calculateExpenses();

  const totalBalance =
    totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? (
          (totalBalance / totalIncome) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Balance */}
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500">
            Total Balance
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
            $
          </div>
        </div>

        <h2
          className={`text-2xl font-bold sm:text-3xl ${
            totalBalance < 0
              ? "text-rose-600"
              : "text-slate-900"
          }`}
        >
          {formatCurrency(totalBalance)}
        </h2>

        <p className="mt-2 text-xs text-slate-400">
          Current available balance
        </p>

      </article>

      {/* Income */}
      <Link
        to="/income"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm font-semibold text-slate-500">
            Income
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
            ↗
          </div>

        </div>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {formatCurrency(totalIncome)}
        </h2>

        <p className="mt-2 text-xs text-emerald-600">
          View income statement →
        </p>
      </Link>

      {/* Expenses */}
      <Link
        to="/expenses"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm font-semibold text-slate-500">
            Expenses
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 font-bold text-rose-600">
            ↘
          </div>

        </div>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {formatCurrency(totalExpenses)}
        </h2>

        <p className="mt-2 text-xs text-rose-500">
          View expense statement →
        </p>
      </Link>

      {/* Savings Rate */}
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

        <div className="mb-5 flex items-center justify-between">

          <p className="text-sm font-semibold text-slate-500">
            Savings Rate
          </p>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-500">
            ★
          </div>

        </div>

        <h2
          className={`text-2xl font-bold sm:text-3xl ${
            Number(savingsRate) < 0
              ? "text-rose-600"
              : "text-slate-900"
          }`}
        >
          {savingsRate}%
        </h2>

        <p className="mt-2 text-xs text-slate-400">
          Income remaining after expenses
        </p>

      </article>

    </section>
  );
}

export default SummaryCards;