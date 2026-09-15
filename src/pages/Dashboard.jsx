import SummaryCards from "../Components/SummaryCards.jsx";
import TransactionForm from "../Components/TransactionForm.jsx";
import TransactionList from "../Components/TransactionList.jsx";
import FinanceChart from "../Components/FinanceChart.jsx";
function Dashboard({
  transactions,
  addTransaction,
  deleteTransaction,
  notice,
  balance,
  totalIncome,
  totalExpense,
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">

      {/* Dashboard heading */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Financial overview
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Your money, clearly.
          </h2>

          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Track your income, spending, and current balance in one place.
          </p>
        </div>

        {/* Desktop Add Entry */}
        <div className="hidden sm:block">
          <TransactionForm onAddTransaction={addTransaction} />
        </div>

      </div>

      <SummaryCards
        balance={balance}
        income={totalIncome}
        expense={totalExpense}
      />
      
       
      {/* Notice */}
{/*     
      {notice && (
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <p className="text-sm font-medium text-indigo-800">
            {notice}
          </p>
        </div>
      )}
   */}


      {/* Transactions */}
      {/* <div className="mt-6">
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
        />
      </div> */}



      {/* Expense spending chart */}
<div className="mt-6">

  {/* 
    Pass all transactions to the chart.
    FinanceChart will select only expense transactions.
  */}
  <FinanceChart transactions={transactions} />

</div>

      {/* Mobile Add Entry */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:hidden">

        <div className="mx-auto max-w-md">
          <TransactionForm onAddTransaction={addTransaction} />
        </div>

      </div>

      <div className="h-24 sm:hidden" />

    </main>
  );
}

export default Dashboard;