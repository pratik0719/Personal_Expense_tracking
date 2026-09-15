function TransactionItem({ transaction, onDelete }) {
  const isIncome = transaction.type === "income";

  const formattedAmount = transaction.amount.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold text-slate-900">
            {transaction.description}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
              {transaction.category}
            </span>

            <time
              dateTime={transaction.date}
              className="text-slate-500"
            >
              {transaction.date}
            </time>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
          <div className="min-w-0 sm:text-right">
            <p
              className={`break-all text-lg font-bold tabular-nums ${
                isIncome
                  ? "text-emerald-700"
                  : "text-rose-700"
              }`}
            >
              {isIncome ? "+" : "-"}${formattedAmount}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {isIncome ? "Income" : "Expense"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            aria-label={`Delete transaction: ${transaction.description}`}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default TransactionItem;