import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions = [], onDelete }) {
  const transactionCount = transactions.length;

  return (
    <section
      aria-labelledby="transaction-list-title"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="transaction-list-title"
            className="text-xl font-bold text-slate-900"
          >
            Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            View and manage your income and expenses.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {transactionCount}{" "}
          {transactionCount === 1 ? "entry" : "entries"}
        </span>
      </div>

      {transactionCount === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div
            aria-hidden="true"
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-semibold text-slate-500 shadow-sm"
          >
            +
          </div>

          <h3 className="font-semibold text-slate-900">
            No transactions yet
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
            Add your first income or expense using the form.
            Your transaction history will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TransactionList;