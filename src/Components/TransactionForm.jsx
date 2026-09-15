import { useRef, useState } from "react";

const categoriesByType = {
  expense: [
    ["Food", "\u{1F35C}"],
    ["Transport", "\u{1F697}"],
    ["Shopping", "\u{1F6CD}"],
    ["Bills", "\u{1F3E0}"],
    ["Entertainment", "\u{1F3AC}"],
    ["Health", "\u{1F49A}"],
    ["Education", "\u{1F4DA}"],
    ["Other", "\u{2728}"],
  ],
  income: [
    ["Salary", "\u{1F4BC}"],
    ["Freelance", "\u{1F4BB}"],
    ["Gift", "\u{1F381}"],
    ["Other", "\u{2728}"],
  ],
};

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TransactionForm({ onAddTransaction }) {
  const dialogRef = useRef(null);
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getToday);
  const [error, setError] = useState("");

  function openComposer() {
    setError("");
    dialogRef.current.showModal();
    amountRef.current.focus();
  }

  function closeComposer() {
    // Closing keeps your unfinished entry until the page reloads.
    dialogRef.current.close();
  }

  function changeType(nextType) {
    setType(nextType);
    setCategory("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const numericAmount = Number(amount);
    const cleanDescription = description.trim();

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      amountRef.current.focus();
      return;
    }

    if (!category || !date) {
      setError("Choose a category and a date.");
      return;
    }

    if (!cleanDescription) {
      setError("Add a short description so you remember this entry.");
      descriptionRef.current.focus();
      return;
    }

    onAddTransaction({
      id: crypto.randomUUID(),
      type,
      amount: Math.round(numericAmount * 100) / 100,
      category,
      description: cleanDescription,
      date,
    });

    closeComposer();
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(getToday());
    setError("");
  }

  return (
    <>
      <button
        type="button"
        onClick={openComposer}
        aria-haspopup="dialog"
        aria-controls="quick-add-dialog"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        <span aria-hidden="true" className="text-xl">+</span>
        Add entry
      </button>

      <dialog
        ref={dialogRef}
        id="quick-add-dialog"
        aria-labelledby="quick-add-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeComposer();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border-0 bg-white p-0 text-left text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm sm:inset-0 sm:m-auto sm:max-w-lg sm:rounded-3xl"
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-600">
                QUICK ADD
              </p>
              <h2 id="quick-add-title" className="mt-1 text-2xl font-bold text-slate-900">
                One entry. More clarity.
              </h2>
            </div>
            <button
              type="button"
              onClick={closeComposer}
              aria-label="Close quick add"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <fieldset className="mb-5">
            <legend className="sr-only">Transaction type</legend>
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
              {["expense", "income"].map((option) => (
                <label key={option} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="quick-type"
                    value={option}
                    checked={type === option}
                    onChange={() => changeType(option)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition peer-checked:bg-white peer-checked:text-indigo-700 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600">
                    {option === "expense" ? "Money out" : "Money in"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mb-5 rounded-2xl bg-indigo-50 px-5 py-5 focus-within:ring-2 focus-within:ring-indigo-500">
            <label htmlFor="quick-amount" className="block text-center text-sm font-medium text-indigo-800">
              {type === "expense" ? "How much went out?" : "How much came in?"}
            </label>
            <div className="mx-auto mt-3 flex max-w-72 items-center gap-2">
              <span aria-hidden="true" className="text-3xl font-medium text-indigo-400">$</span>
              <input
                ref={amountRef}
                id="quick-amount"
                name="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="999999999.99"
                step="0.01"
                required
                aria-label="Amount in dollars"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full min-w-0 bg-transparent text-center text-5xl font-bold tracking-tight text-slate-900 outline-none placeholder:text-indigo-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <fieldset className="mb-5">
            <legend className="mb-3 text-sm font-semibold text-slate-800">
              Pick a category
            </legend>
            <div className="grid grid-cols-4 gap-2">
              {categoriesByType[type].map(([name, icon]) => (
                <label key={name} className="relative min-w-0 cursor-pointer">
                  <input
                    type="radio"
                    name="quick-category"
                    value={name}
                    checked={category === name}
                    onChange={() => setCategory(name)}
                    required
                    className="peer sr-only"
                  />
                  <span className="flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-1 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-800 peer-checked:ring-1 peer-checked:ring-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600">
                    <span aria-hidden="true" className="text-2xl">{icon}</span>
                    <span>{name === "Entertainment" ? "Fun" : name}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mb-4">
            <label htmlFor="quick-description" className="mb-2 block text-sm font-semibold text-slate-800">
              {type === "expense" ? "What was it for?" : "Where did it come from?"}
            </label>
            <input
              ref={descriptionRef}
              id="quick-description"
              name="description"
              type="text"
              maxLength={120}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={type === "expense" ? "Lunch with friends" : "September salary"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3">
            <label htmlFor="quick-date" className="text-sm font-medium text-slate-700">
              {date === getToday() ? "Today" : "Date"}
            </label>
            <input
              id="quick-date"
              name="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="min-w-0 max-w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-base text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeComposer}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {type === "expense" ? "Record expense" : "Record income"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default TransactionForm;