import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./Components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IncomePage from "./pages/IncomePage.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [notice, setNotice] = useState("");

  function addTransaction(newTransaction) {
    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setNotice(
      `Added: ${newTransaction.description}. Totals updated.`
    );
  }

  function deleteTransaction(id) {
    setTransactions((previous) =>
      previous.filter(
        (transaction) => transaction.id !== id
      )
    );

    setNotice("Transaction removed. Totals updated.");
  }

  const incomeCents = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Math.round(transaction.amount * 100),
      0
    );

  const expenseCents = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Math.round(transaction.amount * 100),
      0
    );

  const totalIncome = incomeCents / 100;
  const totalExpense = expenseCents / 100;

  const balance =
    (incomeCents - expenseCents) / 100;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Header />

      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <Dashboard
              transactions={transactions}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
              notice={notice}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          }
        />

        {/* Income */}
        <Route
          path="/income"
          element={
            <IncomePage
              transactions={transactions}
            />
          }
        />

        {/* Expenses */}
        <Route
          path="/expenses"
          element={
            <ExpensePage
              transactions={transactions}
            />
          }
        />

      </Routes>

    </div>
  );
}

export default App;