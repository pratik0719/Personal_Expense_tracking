import { useState } from "react";

/**
 * TransactionForm allows the user to record
 * a new income or expense transaction.
 *
 * The form collects:
 * - Type
 * - Amount
 * - Category
 * - Description
 * - Date
 */
function TransactionForm({ addTransaction }) {
  /**
   * Returns today's date using the format
   * required by an HTML date input.
   */
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Gift",
    "Other",
  ];

  /**
   * Changes the transaction type between
   * income and expense.
   *
   * It also automatically selects a valid
   * category for the selected transaction type.
   */
  const handleTypeChange = (newType) => {
    setType(newType);

    if (newType === "income") {
      setCategory("Salary");
    } else {
      setCategory("Food");
    }
  };

  /**
   * Submits the transaction form.
   *
   * This function:
   * - Prevents page refresh.
   * - Validates the inputs.
   * - Creates the new transaction.
   * - Sends the transaction to App.jsx.
   * - Clears the form.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!date) {
      alert("Please select a date.");
      return;
    }

    const newTransaction = {
      type,
      amount: Number(amount),
      category,
      description: description.trim(),
      date,
    };

    addTransaction(newTransaction);

    setAmount("");
    setDescription("");
    setDate(getTodayDate());
  };

  const categories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Add Transaction
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Record your income or expense.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Income / Expense Selector */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">

          <button
            type="button"
            onClick={() =>
              handleTypeChange("income")
            }
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              type === "income"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Money In
          </button>

          <button
            type="button"
            onClick={() =>
              handleTypeChange("expense")
            }
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              type === "expense"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Money Out
          </button>

        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-slate-600"
          >
            Amount
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="Enter amount"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-slate-600"
          >
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            {categories.map((categoryItem) => (
              <option
                key={categoryItem}
                value={categoryItem}
              >
                {categoryItem}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-600"
          >
            Description
          </label>

          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Example: Grocery shopping"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-semibold text-slate-600"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
        >
          Record Transaction
        </button>

      </form>
    </section>
  );
}

export default TransactionForm;