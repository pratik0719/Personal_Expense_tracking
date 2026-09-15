import { Link } from "react-router-dom";

function ExpensePage({ transactions }) {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalExpense = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      <div className="mb-8">

        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Dashboard
        </Link>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
          Expense Statement
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Expense Details
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Review where your money is being spent.
        </p>

      </div>

      {/* Summary */}
      <div className="mb-6 rounded-3xl bg-rose-600 p-6 text-white shadow-sm   bg-gradient-to-r from-red-800 via-red-600 to-yellow-500">

        <p className="text-sm text-rose-100">
          Total Expenses
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          ${totalExpense.toFixed(2)}
        </h2>

        <p className="mt-2 text-sm text-rose-100">
          {expenseTransactions.length} expense{" "}
          {expenseTransactions.length === 1
            ? "transaction"
            : "transactions"}
        </p>

      </div>

      {/* Statement */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

          <h2 className="text-xl font-bold text-slate-900">
            Expense Statement
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete history of your recorded expenses.
          </p>

        </div>

        {expenseTransactions.length === 0 ? (
          <div className="px-6 py-14 text-center">

            <p className="font-semibold text-slate-900">
              No expenses recorded yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add an expense from your dashboard.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead className="bg-slate-50 text-sm text-slate-600">

                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Description
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Category
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Amount
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {expenseTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {transaction.description}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-rose-600">
                      -${transaction.amount.toFixed(2)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}

export default ExpensePage;