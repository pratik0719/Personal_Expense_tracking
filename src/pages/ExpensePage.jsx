import { Link } from "react-router-dom";

import TransactionList from "../components/TransactionList";

/**
 * ExpensePage displays only expense transactions
 * and calculates the user's total expenses.
 */
function ExpensePage({
  transactions,
  deleteTransaction,
}) {
  /**
   * Filters all transactions and returns only expenses.
   */
  const getExpenseTransactions = () => {
    return transactions.filter(
      (transaction) =>
        transaction.type === "expense"
    );
  };

  /**
   * Calculates the total value of expense transactions.
   */
  const calculateTotalExpenses = (
    expenseTransactions
  ) => {
    return expenseTransactions.reduce(
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

  const expenseTransactions =
    getExpenseTransactions();

  const totalExpenses =
    calculateTotalExpenses(
      expenseTransactions
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

          <p className="text-sm font-semibold text-rose-600">
            Expense Statement
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Expenses
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review where your money is being spent.
          </p>

        </div>

        {/* Expense Total */}
        <section className="my-6 rounded-3xl bg-rose-500 p-6 text-white">

          <p className="text-sm text-rose-100">
            Total Expenses
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(
              totalExpenses
            )}
          </h2>

        </section>

        {/* Expense Transactions */}
        <TransactionList
          transactions={
            expenseTransactions
          }
          deleteTransaction={
            deleteTransaction
          }
        />

      </div>

    </div>
  );
}

export default ExpensePage;