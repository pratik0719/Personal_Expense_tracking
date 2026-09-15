function SummaryCards({ balance = 0, income = 0, expense = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Total Balance</p>
        <h2
          className={`text-3xl font-bold mt-3 ${
            balance < 0 ? "text-red-600" : "text-slate-900"
          }`}
        >
          ${balance.toFixed(2)}
        </h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-slate-900"></div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Total Income</p>
        <h2 className="text-3xl font-bold mt-3 text-emerald-600">
          ${income.toFixed(2)}
        </h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-emerald-500"></div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-medium text-slate-500">Total Expense</p>
        <h2 className="text-3xl font-bold mt-3 text-rose-600">
          ${expense.toFixed(2)}
        </h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-rose-500"></div>
      </div>

    </div>
  );
}

export default SummaryCards;