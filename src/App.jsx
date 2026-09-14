import { useState } from "react";

import Header from "./components/Header.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./components/TransactionList.jsx";

function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">

        <h2 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h2>

        <SummaryCards />

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