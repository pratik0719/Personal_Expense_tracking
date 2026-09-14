import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">
          No transactions yet.
        </p>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default TransactionList;