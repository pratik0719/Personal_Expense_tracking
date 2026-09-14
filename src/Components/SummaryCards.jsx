function SummaryCards({ balance = 0, income = 0, expense = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Balance
        </p>

        <h2
          className={`text-2xl font-bold mt-2 ${
            balance < 0 ? "text-red-600" : "text-gray-900"
          }`}
        >
          ${balance.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Income
        </p>

        <h2 className="text-2xl font-bold mt-2 text-green-600">
          ${income.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Expense
        </p>

        <h2 className="text-2xl font-bold mt-2 text-red-600">
          ${expense.toFixed(2)}
        </h2>
      </div>

    </div>
  );
}

export default SummaryCards;