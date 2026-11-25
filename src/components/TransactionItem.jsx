import { useCurrencyFormatter } from "../context/BrandContext";
import { useTransactionSheet } from "../context/TransactionSheetContext";
import { getCategoryMeta } from "../utils/finance";

/**
 * One transaction row. The whole row is a large tap target that opens
 * the edit sheet, where the transaction can also be deleted.
 */
function TransactionItem({ transaction }) {
  const formatCurrency = useCurrencyFormatter();
  const { openEdit } = useTransactionSheet();

  const isIncome = transaction.type === "income";
  const meta = getCategoryMeta(transaction.category);
  const hasNote = transaction.description && transaction.description !== transaction.category;

  return (
    <li>
      <button
        type="button"
        onClick={() => openEdit(transaction)}
        className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition hover:bg-white/[0.04] active:bg-white/[0.07]"
        aria-label={`${transaction.description}, ${isIncome ? "income" : "expense"} of ${formatCurrency(transaction.amount)}. Tap to edit.`}
      >
        <span className="relative shrink-0" aria-hidden="true">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[0.06] text-lg">
            {meta.icon}
          </span>
          {/* In / out badge */}
          <span
            className={`absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-ink text-[8px] font-bold text-ink ${
              isIncome ? "bg-up" : "bg-down"
            }`}
          >
            {isIncome ? "+" : "−"}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-white">{transaction.description}</span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {hasNote ? transaction.category : isIncome ? "Income" : "Expense"}
          </span>
        </span>

        <span className={`money shrink-0 text-sm font-bold ${isIncome ? "text-up" : "text-down"}`}>
          {isIncome ? "+" : "−"}
          {formatCurrency(transaction.amount)}
        </span>
      </button>
    </li>
  );
}

export default TransactionItem;
