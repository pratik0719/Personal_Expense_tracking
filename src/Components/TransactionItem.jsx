function TransactionItem({ transaction, onDelete }) {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      
      <div>
        <h3 className="font-medium text-gray-800">
          {transaction.description}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {transaction.category} • {transaction.date}
        </p>
      </div>

      <div className="text-right">

        <p
          className={`font-semibold ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
        </p>

        <button
          onClick={() => onDelete(transaction.id)}
          className="text-sm text-red-500 hover:text-red-700 mt-1"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default TransactionItem;