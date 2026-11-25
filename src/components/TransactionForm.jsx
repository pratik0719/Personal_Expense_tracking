import { useState } from "react";

import { useBrand } from "../context/BrandContext";
import { CATEGORIES, getCategoryMeta, todayISO } from "../utils/finance";

/**
 * TransactionForm records a new transaction or edits an existing one.
 *
 * Thumb-first: a large amount field with a numeric keypad, tappable
 * category tiles instead of a dropdown, and errors shown inline.
 */
function TransactionForm({ initial, defaultType = "expense", onSubmit, onDelete }) {
  const { settings } = useBrand();
  const isEditing = Boolean(initial);

  const [type, setType] = useState(initial?.type ?? defaultType);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[defaultType][0]);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [error, setError] = useState("");

  const handleTypeChange = (newType) => {
    setType(newType);
    if (!CATEGORIES[newType].includes(category)) setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = Number(amount);

    if (!amount || Number.isNaN(value) || value <= 0) return setError("Enter an amount greater than 0.");
    if (!date) return setError("Choose a date.");

    onSubmit({
      ...(initial ?? {}),
      type,
      amount: Math.round(value * 100) / 100,
      category,
      // A note is optional; fall back to the category so lists stay readable.
      description: description.trim() || category,
      date,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${initial.description}"? This cannot be undone.`)) onDelete(initial.id);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Expense / Income */}
      <div className="flex gap-2" role="group" aria-label="Transaction type">
        {[
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={type === option.value}
            onClick={() => handleTypeChange(option.value)}
            className={`pill flex-1 py-2.5 ${type === option.value ? "pill-active" : ""}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="tile px-4 py-4 text-center">
        <label htmlFor="tx-amount" className="text-xs font-semibold tracking-wide text-muted uppercase">
          Amount ({settings.currency})
        </label>
        <input
          id="tx-amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
          placeholder="0.00"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "tx-error" : undefined}
          className={`money mt-1 w-full bg-transparent text-center text-4xl! font-bold outline-none placeholder:text-white/20 ${
            type === "income" ? "text-up" : "text-white"
          }`}
        />
      </div>

      {/* Category tiles */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-muted">Category</legend>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES[type].map((item) => {
            const meta = getCategoryMeta(item);
            const selected = item === category;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(item)}
                className={`flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 text-[11px] font-semibold transition sm:text-xs ${
                  selected ? "border-brand bg-brand/20 text-white" : "border-line bg-white/[0.03] text-muted hover:text-white"
                }`}
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {meta.icon}
                </span>
                <span className="w-full truncate text-center">{item}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Note + date */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="tx-description" className="mb-2 block text-sm font-semibold text-muted">
            Note <span className="font-normal text-faint">(optional)</span>
          </label>
          <input
            id="tx-description"
            type="text"
            maxLength="120"
            enterKeyHint="done"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={type === "income" ? "e.g. November salary" : "e.g. Groceries"}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="tx-date" className="mb-2 block text-sm font-semibold text-muted">
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setError("");
            }}
            className="field min-h-[46px] sm:w-44"
          />
        </div>
      </div>

      {error && (
        <p id="tx-error" role="alert" className="rounded-2xl bg-down/10 px-4 py-3 text-sm font-medium text-down">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
        {isEditing && onDelete && (
          <button type="button" onClick={handleDelete} className="rounded-full px-5 py-3 text-sm font-semibold text-down transition hover:bg-down/10 sm:mr-auto">
            Delete
          </button>
        )}
        <button type="submit" className="btn-primary w-full sm:w-auto sm:flex-1">
          {isEditing ? "Save changes" : type === "income" ? "Add income" : "Add expense"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
