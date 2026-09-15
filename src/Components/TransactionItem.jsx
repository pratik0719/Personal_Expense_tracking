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
    <li className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Left side */}
        <div className="min-w-0">

          <h3 className="break-words font-semibold text-slate-900">
            {transaction.description}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">

            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {transaction.category}
            </span>

            <span className="text-xs text-slate-500">
              {transaction.date}
            </span>

          </div>

        </div>

        {/* Right side */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

          <p
            className={`text-lg font-bold ${
              isIncome
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {isIncome ? "+" : "-"}${formattedAmount}
          </p>

          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            Delete
          </button>

        </div>

      </div>

    </li>
  );
}

export default TransactionItem;