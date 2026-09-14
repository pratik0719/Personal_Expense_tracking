function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Balance
        </p>

        <h2 className="text-2xl font-bold mt-2">
          $0.00
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Income
        </p>

        <h2 className="text-2xl font-bold mt-2 text-green-600">
          $0.00
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">
          Total Expense
        </p>

        <h2 className="text-2xl font-bold mt-2 text-red-600">
          $0.00
        </h2>
      </div>

    </div>
  );
}

export default SummaryCards;