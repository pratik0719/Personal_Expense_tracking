import TransactionItem from "./TransactionItem";

/**
 * TransactionList displays all recorded transactions.
 *
 * If there are no transactions,
 * it displays an empty state instead.
 */
function TransactionList({
  transactions,
  deleteTransaction,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Transaction List Header */}
      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {transactions.length}{" "}
            {transactions.length === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>

      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
            $
          </div>

          <h3 className="font-semibold text-slate-700">
            No transactions yet
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Add your first income or expense transaction.
          </p>

        </div>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              deleteTransaction={deleteTransaction}
            />
          ))}
        </div>
      )}

    </section>
  );
}

export default TransactionList;