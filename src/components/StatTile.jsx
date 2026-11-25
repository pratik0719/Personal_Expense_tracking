/**
 * Small stat card: icon + label, a value, and an optional trend line
 * such as "-2.5% than last month".
 *
 * goodWhenUp decides whether a rise is shown green (income) or red (spending).
 */
function StatTile({ icon, label, value, change, goodWhenUp = true, note, valueClass = "" }) {
  const hasChange = change !== null && change !== undefined && Number.isFinite(change);
  const isGood = hasChange && (change >= 0) === goodWhenUp;

  return (
    <article className="panel min-w-0 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-white/90">
        {icon && (
          <span aria-hidden="true" className="text-base leading-none">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </p>

      <p className={`money mt-3 truncate text-lg font-bold sm:text-xl ${valueClass}`}>{value}</p>

      {hasChange ? (
        <p className="mt-1 truncate text-xs text-muted">
          <span className={isGood ? "text-up" : "text-down"}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>{" "}
          than last month
        </p>
      ) : (
        note && <p className="mt-1 truncate text-xs text-muted">{note}</p>
      )}
    </article>
  );
}

export default StatTile;
