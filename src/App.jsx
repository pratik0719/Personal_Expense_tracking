import {
  useEffect,
  useState,
} from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";
import SettingsPage from "./pages/SettingsPage";

import "./App.css";

/**
 * App is the main controller of the Personal Expense Tracker.
 *
 * Responsibilities:
 * - Stores transactions.
 * - Stores budgets.
 * - Loads saved data from localStorage.
 * - Saves data into localStorage.
 * - Adds and deletes transactions.
 * - Adds and deletes budgets.
 * - Controls application routes.
 */
function App() {
  /**
   * Loads saved transaction data.
   *
   * If no transaction data exists,
   * the application starts with an empty array.
   */
  const [transactions, setTransactions] =
    useState(() => {
      const savedTransactions =
        localStorage.getItem(
          "expenseTrackerTransactions"
        );

      if (!savedTransactions) {
        return [];
      }

      try {
        return JSON.parse(
          savedTransactions
        );
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error
        );

        return [];
      }
    });

  /**
   * Loads saved budget data.
   *
   * If no budget data exists,
   * the application starts with an empty array.
   */
  const [budgets, setBudgets] =
    useState(() => {
      const savedBudgets =
        localStorage.getItem(
          "expenseTrackerBudgets"
        );

      if (!savedBudgets) {
        return [];
      }

      try {
        return JSON.parse(
          savedBudgets
        );
      } catch (error) {
        console.error(
          "Failed to load budgets:",
          error
        );

        return [];
      }
    });

  /**
   * Saves transactions to localStorage
   * whenever the transaction list changes.
   */
  useEffect(() => {
    localStorage.setItem(
      "expenseTrackerTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  /**
   * Saves budgets to localStorage
   * whenever the budget list changes.
   */
  useEffect(() => {
    localStorage.setItem(
      "expenseTrackerBudgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  /**
   * Adds a new transaction to
   * the beginning of the transaction list.
   */
  const addTransaction = (
    transaction
  ) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
    };

    setTransactions(
      (previousTransactions) => [
        newTransaction,
        ...previousTransactions,
      ]
    );
  };

  /**
   * Deletes a transaction using
   * its unique transaction ID.
   */
  const deleteTransaction = (id) => {
    setTransactions(
      (previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            transaction.id !== id
        )
    );
  };

  /**
   * Adds a new category budget.
   */
  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now(),
    };

    setBudgets(
      (previousBudgets) => [
        newBudget,
        ...previousBudgets,
      ]
    );
  };

  /**
   * Deletes a budget using
   * its unique budget ID.
   */
  const deleteBudget = (id) => {
    setBudgets(
      (previousBudgets) =>
        previousBudgets.filter(
          (budget) =>
            budget.id !== id
        )
    );
  };

  return (
    <Routes>

      {/* Shared Application Layout */}
      <Route element={<AppLayout />}>

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <Dashboard
              transactions={
                transactions
              }
              addTransaction={
                addTransaction
              }
              deleteTransaction={
                deleteTransaction
              }
            />
          }
        />

        {/* Income Statement */}
        <Route
          path="/income"
          element={
            <IncomePage
              transactions={
                transactions
              }
              deleteTransaction={
                deleteTransaction
              }
            />
          }
        />

        {/* Expense Statement */}
        <Route
          path="/expenses"
          element={
            <ExpensePage
              transactions={
                transactions
              }
              deleteTransaction={
                deleteTransaction
              }
            />
          }
        />

        {/* Monthly Budget Management */}
        <Route
          path="/budgets"
          element={
            <BudgetsPage
              budgets={budgets}
              transactions={
                transactions
              }
              addBudget={
                addBudget
              }
              deleteBudget={
                deleteBudget
              }
            />
          }
        />

        {/* Savings Goals */}
        <Route
          path="/goals"
          element={
            <GoalsPage />
          }
        />

        {/* Application Settings */}
        <Route
          path="/settings"
          element={
            <SettingsPage />
          }
        />

      </Route>

    </Routes>
  );
}

export default App;