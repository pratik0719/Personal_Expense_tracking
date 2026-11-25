import TransactionItem from "./TransactionItem";
import { useCurrencyFormatter } from "../context/BrandContext";
import { formatDateHeading } from "../utils/finance";

/**
 * Renders already-sorted transactions under day headings
 * ("Today", "Yesterday", "Sun 22 Nov") with each day's net total.
 */
function TransactionGroups({ transactions }) {
  const formatCurrency = useCurrencyFormatter();

  const groups = [];
  transactions.forEach((transaction) => {
    let group = groups[groups.length - 1];
    if (!group || group.date !== transaction.date) {
      group = { date: transaction.date, items: [], net: 0 };
      groups.push(group);
    }
    group.items.push(transaction);
    group.net += transaction.type === "income" ? transaction.amount : -transaction.amount;
  });

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.date} aria-label={formatDateHeading(group.date)}>
          <div className="flex items-center justify-between px-2 pb-1">
            <h3 className="text-[15px] font-semibold text-white">{formatDateHeading(group.date)}</h3>
            <span className={`money text-xs ${group.net >= 0 ? "text-up" : "text-muted"}`}>
              {group.net >= 0 ? "+" : "−"}
              {formatCurrency(Math.abs(group.net))}
            </span>
          </div>
          <ul>
            {group.items.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default TransactionGroups;
