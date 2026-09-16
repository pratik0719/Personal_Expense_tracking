import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import FinanceChart from "../components/FinanceChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

/**
 * Dashboard is the main page of the Personal Expense Tracker.
 *
 * It combines:
 * - Dashboard header
 * - Financial summary cards
 * - Six-month cash flow chart
 * - Add transaction form
 * - Recent transaction history
 */
function Dashboard({
  transactions,
  addTransaction,
  deleteTransaction,
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

        {/* Main Dashboard Header */}
        <Header />

        {/* Balance, Income, Expense and Savings Cards */}
        <SummaryCards
          transactions={transactions}
        />

        {/* Main Dashboard Content */}
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.35fr_0.65fr]">

          {/* Six-Month Cash Flow Chart */}
          <FinanceChart
            transactions={transactions}
          />

          {/* Add Transaction Form */}
          <div id="transaction-form">
            <TransactionForm
              addTransaction={
                addTransaction
              }
            />
          </div>

        </div>

        {/* Recent Transaction History */}
        <div className="mt-6">
          <TransactionList
            transactions={transactions}
            deleteTransaction={
              deleteTransaction
            }
          />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;