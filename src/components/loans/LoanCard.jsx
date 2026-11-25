import { useCurrencyFormatter } from "../../context/BrandContext";
import { describeDue, formatShortDate, isLoanSettled, loanOutstanding, loanPaid } from "../../utils/finance";

const AVATAR_COLORS = ["#6c5ce7", "#3b82f6", "#14b8a6", "#f97316", "#ec4899", "#eab308", "#8b5cf6", "#22c55e"];

/** Same person -> same avatar colour. */
const avatarColor = (name) =>
  AVATAR_COLORS[[...name].reduce((hash, char) => hash + char.charCodeAt(0), 0) % AVATAR_COLORS.length];

export function PersonAvatar({ name, size = "h-11 w-11 text-base" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${size}`}
      style={{ backgroundColor: avatarColor(name) }}
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

const TONE = {
  ok: "text-muted",
  warn: "text-amber-300",
  late: "text-down font-semibold",
};

/** A loan row: person, due status, outstanding amount and repayment progress. */
function LoanCard({ loan, onOpen }) {
  const formatCurrency = useCurrencyFormatter();

  const settled = isLoanSettled(loan);
  const outstanding = loanOutstanding(loan);
  const progress = Math.min((loanPaid(loan) / loan.amount) * 100, 100);
  const due = settled ? null : describeDue(loan.dueDate);
  const isReceivable = loan.direction === "receivable";

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(loan)}
        className={`panel block w-full p-4 text-left transition hover:brightness-110 active:scale-[0.99] ${settled ? "opacity-70" : ""}`}
      >
        <div className="flex items-center gap-3">
          <PersonAvatar name={loan.person} />

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{loan.person}</p>
            <p className={`mt-0.5 truncate text-xs ${due ? TONE[due.tone] : "text-muted"}`}>
              {settled ? "Settled" : due ? due.text : `${isReceivable ? "Lent" : "Borrowed"} ${formatShortDate(loan.date)}`}
              {loan.note && !due && !settled ? ` · ${loan.note}` : ""}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className={`money text-sm font-bold ${settled ? "text-muted" : isReceivable ? "text-up" : "text-down"}`}>
              {formatCurrency(settled ? loan.amount : outstanding, { whole: true })}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              {settled ? "repaid" : loanPaid(loan) > 0 ? `of ${formatCurrency(loan.amount, { whole: true })}` : "outstanding"}
            </p>
          </div>
        </div>

        {!settled && loanPaid(loan) > 0 && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
            <div className={`h-full rounded-full ${isReceivable ? "bg-up" : "bg-down"}`} style={{ width: `${progress}%` }} />
          </div>
        )}
      </button>
    </li>
  );
}

export default LoanCard;
