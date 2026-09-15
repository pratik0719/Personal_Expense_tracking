import { useState } from "react";
import Header from "./Components/Header.jsx";
import SummaryCards from "./Components/SummaryCards.jsx";
import TransactionForm from "./Components/TransactionForm.jsx";
import TransactionList from "./Components/TransactionList.jsx";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [notice, setNotice] = useState("");

  function addTransaction(newTransaction) {
    setTransactions((previous) => [newTransaction, ...previous]);
    setNotice(`Added: ${newTransaction.description}. Your totals are updated.`);
  }

  function deleteTransaction(id) {
    setTransactions((previous) =>
      previous.filter((transaction) => transaction.id !== id)
    );
    setNotice("Transaction removed. Your totals are updated.");
  }

  const incomeCents = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Math.round(transaction.amount * 100), 0);

  const expenseCents = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Math.round(transaction.amount * 100), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-left text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Your money, at a glance
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              A little more in control.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Add an entry, then get on with your day.
            </p>
          </div>

          <div className="shrink-0">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>
        </div>

        <SummaryCards
          balance={(incomeCents - expenseCents) / 100}
          income={incomeCents / 100}
          expense={expenseCents / 100}
        />

        <p role="status" className="mt-5 min-h-6 break-words text-sm text-slate-600">
          {notice}
        </p>

        <div className="mt-3">
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Entries are kept for this session only. Refreshing clears them.
        </p>
      </main>
    </div>
  );
}

export default App;
