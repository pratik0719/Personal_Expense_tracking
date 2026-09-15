import { Link } from "react-router-dom";

function IncomePage({ transactions }) {
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "income"
  );

  const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      {/* Page header */}
      <div className="mb-8">

        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Dashboard
        </Link>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Income Statement
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Income Details
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Review all money coming into your account.
        </p>

      </div>

      {/* Summary */}
      <div className="mb-6 rounded-3xl bg-emerald-600 p-6 text-white shadow-sm  bg-gradient-to-r from-green-800 via-blue-900 to-purple-700 text-white shadow-sm">

        <p className="text-sm text-emerald-100">
          Total Income
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          Rs {totalIncome.toFixed(2)}
        </h2>

        <p className="mt-2 text-sm text-emerald-100">
          {incomeTransactions.length} income{" "}
          {incomeTransactions.length === 1
            ? "transaction"
            : "transactions"}
        </p>

      </div>

      {/* Statement */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

          <h2 className="text-xl font-bold text-slate-900">
            Income Statement
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete history of your recorded income.
          </p>

        </div>

        {incomeTransactions.length === 0 ? (
          <div className="px-6 py-14 text-center">

            <p className="font-semibold text-slate-900">
              No income recorded yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add an income transaction from your dashboard.
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

                {incomeTransactions.map((transaction) => (
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

                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      +${transaction.amount.toFixed(2)}
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

export default IncomePage;