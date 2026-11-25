import { useState } from "react";

import { PersonAvatar } from "./LoanCard";
import { useCurrencyFormatter } from "../../context/BrandContext";
import {
  describeDue,
  formatShortDate,
  isLoanSettled,
  loanOutstanding,
  loanPaid,
  sortByDate,
  todayISO,
} from "../../utils/finance";

/**
 * LoanDetail: the full picture of one loan with its repayment history,
 * a quick form to record a repayment, and edit / delete actions.
 */
function LoanDetail({ loan, addPayment, deletePayment, onEdit, onDelete }) {
  const formatCurrency = useCurrencyFormatter();
  const outstanding = loanOutstanding(loan);
  const paid = loanPaid(loan);
  const settled = isLoanSettled(loan);
  const isReceivable = loan.direction === "receivable";
  const due = settled ? null : describeDue(loan.dueDate);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState("");

  const record = (value) => {
    if (!(value > 0)) return setError("Enter an amount greater than 0.");
    if (value > outstanding + 0.001) return setError(`That's more than the ${formatCurrency(outstanding)} outstanding.`);
    if (!date) return setError("Choose the payment date.");
    addPayment(loan.id, { amount: Math.round(value * 100) / 100, date });
    setAmount("");
    setError("");
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="tile p-5 text-center">
        <div className="flex justify-center">
          <PersonAvatar name={loan.person} size="h-14 w-14 text-xl" />
        </div>
        <p className="mt-3 font-semibold">{loan.person}</p>
        <p className="text-xs text-muted">
          {isReceivable ? "Owes you" : "You owe"} · {isReceivable ? "lent" : "borrowed"} {formatShortDate(loan.date)}
        </p>

        <p className={`money mt-4 text-4xl font-bold ${settled ? "text-muted" : isReceivable ? "text-up" : "text-down"}`}>
          {formatCurrency(outstanding)}
        </p>
        <p className="mt-1 text-sm text-muted">{settled ? "Fully settled 🎉" : `outstanding of ${formatCurrency(loan.amount)}`}</p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className={`h-full rounded-full ${isReceivable ? "bg-up" : "bg-down"}`} style={{ width: `${Math.min((paid / loan.amount) * 100, 100)}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Repaid {formatCurrency(paid, { whole: true })}</span>
          {due && <span className={due.tone === "late" ? "font-semibold text-down" : due.tone === "warn" ? "text-amber-300" : ""}>{due.text}</span>}
        </div>

        {loan.note && <p className="mt-4 rounded-xl bg-white/[0.04] px-3 py-2 text-left text-sm text-white/80">{loan.note}</p>}
      </div>

      {/* Record repayment */}
      {!settled && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            record(Number(amount));
          }}
          noValidate
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-muted">{isReceivable ? "Record money received" : "Record a repayment"}</h3>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
              placeholder={`Amount (max ${formatCurrency(outstanding, { whole: true })})`}
              aria-label="Repayment amount"
              className="field money"
            />
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Repayment date" className="field w-[9.5rem] px-3" />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-down">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button type="submit" className="btn-primary text-sm">
              Record
            </button>
            <button type="button" onClick={() => record(outstanding)} className="pill py-3">
              Settle in full
            </button>
          </div>
        </form>
      )}

      {/* History */}
      {loan.payments.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted">Repayment history</h3>
          <ul className="tile divide-y divide-white/5">
            {sortByDate(loan.payments).map((payment) => (
              <li key={payment.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="money text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-muted">{formatShortDate(payment.date)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.confirm("Remove this repayment?") && deletePayment(loan.id, payment.id)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-down/10 hover:text-down"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 border-t border-line pt-4">
        <button type="button" onClick={onEdit} className="pill py-3">
          Edit loan
        </button>
        <button
          type="button"
          onClick={() => window.confirm(`Delete the loan with ${loan.person}? This cannot be undone.`) && onDelete(loan.id)}
          className="rounded-full py-3 text-sm font-semibold text-down transition hover:bg-down/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default LoanDetail;
