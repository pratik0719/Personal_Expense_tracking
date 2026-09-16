import { Link } from "react-router-dom";

import TransactionList from "../components/TransactionList";

/**
 * IncomePage displays only income transactions
 * and calculates the user's total income.
 */
function IncomePage({
  transactions,
  deleteTransaction,
}) {
  /**
   * Filters all transactions and returns only income.
   */
  const getIncomeTransactions = () => {
    return transactions.filter(
      (transaction) =>
        transaction.type === "income"
    );
  };

  /**
   * Calculates the total value of income transactions.
   */
  const calculateTotalIncome = (
    incomeTransactions
  ) => {
    return incomeTransactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
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

  const incomeTransactions =
    getIncomeTransactions();

  const totalIncome =
    calculateTotalIncome(
      incomeTransactions
    );

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">

        {/* Navigation */}
        <Link
          to="/"
          className="text-sm font-semibold text-indigo-600"
        >
          ← Dashboard
        </Link>

        {/* Page Header */}
        <div className="mt-6">

          <p className="text-sm font-semibold text-emerald-600">
            Income Statement
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Income
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review all money coming into your account.
          </p>

        </div>

        {/* Income Total */}
        <section className="my-6 rounded-3xl bg-emerald-500 p-6 text-white">

          <p className="text-sm text-emerald-100">
            Total Income
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(
              totalIncome
            )}
          </h2>

        </section>

        {/* Income Transactions */}
        <TransactionList
          transactions={
            incomeTransactions
          }
          deleteTransaction={
            deleteTransaction
          }
        />

      </div>

    </div>
  );
}

export default IncomePage;