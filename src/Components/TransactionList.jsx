import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions = [], onDelete }) {
  const count = transactions.length;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your money, one entry at a time.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {count} {count === 1 ? "entry" : "entries"}
        </span>

      </div>

      {/* Empty state */}
      {count === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-indigo-600 shadow-sm">
            +
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            No transactions yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Add your first income or expense to start building your financial overview.
          </p>

        </div>
      ) : (
        <ul className="mt-6 space-y-3">

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