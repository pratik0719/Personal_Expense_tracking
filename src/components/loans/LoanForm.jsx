import { useState } from "react";

import { useBrand, useCurrencyFormatter } from "../../context/BrandContext";
import { loanPaid, todayISO } from "../../utils/finance";

/**
 * LoanForm records money you lent (receivable) or borrowed (payable).
 * Editing keeps the existing repayment history.
 */
function LoanForm({ initial, defaultDirection = "receivable", onSubmit }) {
  const { settings } = useBrand();
  const formatCurrency = useCurrencyFormatter();

  const [direction, setDirection] = useState(initial?.direction ?? defaultDirection);
  const [person, setPerson] = useState(initial?.person ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState("");

  const alreadyPaid = initial ? loanPaid(initial) : 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = Number(amount);

    if (!person.trim()) return setError("Enter who the loan is with.");
    if (!(value > 0)) return setError("Enter an amount greater than 0.");
    if (value < alreadyPaid) return setError(`Amount can't be less than what's already repaid (${formatCurrency(alreadyPaid)}).`);
    if (!date) return setError("Choose the loan date.");
    if (dueDate && dueDate < date) return setError("The due date can't be before the loan date.");

    onSubmit({
      ...(initial ?? {}),
      direction,
      person: person.trim(),
      amount: Math.round(value * 100) / 100,
      date,
      dueDate: dueDate || "",
      note: note.trim(),
      payments: initial?.payments ?? [],
    });
  };

  const clearError = (setter) => (event) => {
    setter(event.target.value);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Loan type">
        {[
          { value: "receivable", label: "I lent money", hint: "They owe me" },
          { value: "payable", label: "I borrowed", hint: "I owe them" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={direction === option.value}
            onClick={() => setDirection(option.value)}
            className={`rounded-2xl border px-3 py-3 text-left transition ${
              direction === option.value ? "pill-active" : "border-line bg-white/[0.03] text-muted"
            }`}
          >
            <span className="block text-sm font-bold">{option.label}</span>
            <span className="block text-xs opacity-80">{option.hint}</span>
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="loan-person" className="mb-2 block text-sm font-semibold text-muted">
          {direction === "receivable" ? "Lent to" : "Borrowed from"}
        </label>
        <input
          id="loan-person"
          type="text"
          maxLength="60"
          autoComplete="off"
          value={person}
          onChange={clearError(setPerson)}
          placeholder="Name of person or lender"
          className="field"
        />
      </div>

      <div className="tile px-4 py-4 text-center">
        <label htmlFor="loan-amount" className="text-xs font-semibold tracking-wide text-muted uppercase">
          Amount ({settings.currency})
        </label>
        <input
          id="loan-amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={clearError(setAmount)}
          placeholder="0.00"
          className={`money mt-1 w-full bg-transparent text-center text-4xl! font-bold outline-none placeholder:text-white/20 ${
            direction === "receivable" ? "text-up" : "text-down"
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="loan-date" className="mb-2 block text-sm font-semibold text-muted">
            Date
          </label>
          <input id="loan-date" type="date" value={date} onChange={clearError(setDate)} className="field min-h-[46px] px-3" />
        </div>
        <div>
          <label htmlFor="loan-due" className="mb-2 block text-sm font-semibold text-muted">
            Due <span className="font-normal text-faint">(optional)</span>
          </label>
          <input id="loan-due" type="date" value={dueDate} min={date} onChange={clearError(setDueDate)} className="field min-h-[46px] px-3" />
        </div>
      </div>

      <div>
        <label htmlFor="loan-note" className="mb-2 block text-sm font-semibold text-muted">
          Note <span className="font-normal text-faint">(optional)</span>
        </label>
        <input
          id="loan-note"
          type="text"
          maxLength="120"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="e.g. For bike repair, 2% monthly interest"
          className="field"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-down/10 px-4 py-3 text-sm font-medium text-down">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full">
        {initial ? "Save changes" : "Add loan"}
      </button>
    </form>
  );
}

export default LoanForm;
