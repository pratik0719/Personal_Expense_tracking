import { useState } from "react";

import Header from "./components/Header.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./components/TransactionList.jsx";

function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTransaction) => {
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      newTransaction,
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">

        <h2 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h2>

        <SummaryCards
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          <TransactionForm
            onAddTransaction={addTransaction}
          />

          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;