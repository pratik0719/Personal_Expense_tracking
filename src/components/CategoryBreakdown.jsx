import { useCurrencyFormatter } from "../context/BrandContext";
import { getCategoryMeta } from "../utils/finance";

/**
 * Stacked bar showing each category's share of a total.
 * rows: [{ category, amount }]
 */
export function StackedBar({ rows }) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  if (total <= 0) return <div className="h-2.5 rounded-full bg-white/[0.06]" />;

  return (
    <div className="flex h-2.5 gap-1" aria-hidden="true">
      {rows.map((row) => (
        <div
          key={row.category}
          className="h-full min-w-2.5 rounded-full"
          style={{ flexGrow: row.amount, backgroundColor: getCategoryMeta(row.category).color }}
        />
      ))}
    </div>
  );
}

/** Wrapping chips: "● Food  NPR 1,250". */
export function CategoryChips({ rows }) {
  const formatCurrency = useCurrencyFormatter();

  return (
    <ul className="flex flex-wrap gap-2">
      {rows.map((row) => (
        <li key={row.category} className="chip">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getCategoryMeta(row.category).color }} />
          <span className="text-white/90">{row.category}</span>
          <span className="money text-xs text-muted">{formatCurrency(row.amount, { whole: true })}</span>
        </li>
      ))}
    </ul>
  );
}

/** Ranked list with percentage share, for detailed breakdowns. */
export function CategoryRanking({ rows }) {
  const formatCurrency = useCurrencyFormatter();
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const meta = getCategoryMeta(row.category);
        const share = total > 0 ? (row.amount / total) * 100 : 0;
        return (
          <li key={row.category} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.04] text-lg" aria-hidden="true">
              {meta.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate font-semibold">{row.category}</span>
                <span className="money shrink-0 font-semibold">{formatCurrency(row.amount)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: meta.color }} />
                </div>
                <span className="w-9 shrink-0 text-right text-xs text-muted">{share.toFixed(0)}%</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
