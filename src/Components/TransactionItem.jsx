/**
 * TransactionItem displays one individual transaction.
 *
 * It shows:
 * - Transaction type
 * - Description
 * - Category
 * - Date
 * - Amount
 * - Delete button
 */
function TransactionItem({
  transaction,
  deleteTransaction,
}) {
  /**
   * Formats a transaction amount into USD currency.
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
   * Deletes the current transaction
   * after asking the user for confirmation.
   */
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Delete "${transaction.description}"?`
    );

    if (confirmDelete) {
      deleteTransaction(transaction.id);
    }
  };

  const isIncome =
    transaction.type === "income";

  return (
    <article className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-slate-100 py-4 last:border-0 sm:grid-cols-[44px_1fr_auto_auto]">

      {/* Transaction Icon */}
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${
          isIncome
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-600"
        }`}
      >
        {isIncome ? "↗" : "↘"}
      </div>

      {/* Transaction Details */}
      <div className="min-w-0">

        <h3 className="truncate text-sm font-semibold text-slate-800">
          {transaction.description}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {transaction.category}
        </p>

      </div>

      {/* Transaction Date */}
      <p className="hidden text-xs text-slate-400 sm:block">
        {transaction.date}
      </p>

      {/* Amount and Delete */}
      <div className="text-right">

        <p
          className={`text-sm font-bold ${
            isIncome
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-1 text-xs text-slate-400 transition hover:text-rose-600"
        >
          Delete
        </button>

      </div>

    </article>
  );
}

export default TransactionItem;