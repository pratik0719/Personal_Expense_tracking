import { Link } from "react-router-dom";

function SummaryCards({ balance = 0, income = 0, expense = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

      {/* Balance */}
      <div className="col-span-2 rounded-3xl bg-slate-950 p-6 text-white shadow-lg md:col-span-1">
        <p className="text-sm font-medium text-slate-300">
          Total balance
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          ${balance.toFixed(2)}
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          Income minus expenses
        </p>
      </div>

      {/* Income */}
      <Link
        to="/income"
        className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            Income
          </p>

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
            +
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-emerald-600 sm:text-3xl">
          ${income.toFixed(2)}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Money in
        </p>

        <p className="mt-3 text-xs font-semibold text-emerald-600">
          View income statement →
        </p>
      </Link>

      {/* Expense */}
      <Link
        to="/expenses"
        className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            Expenses
          </p>

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 font-bold text-rose-700">
            −
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-rose-600 sm:text-3xl">
          ${expense.toFixed(2)}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Money out
        </p>

        <p className="mt-3 text-xs font-semibold text-rose-600">
          View expense statement →
        </p>
      </Link>

    </div>
  );
}

export default SummaryCards;