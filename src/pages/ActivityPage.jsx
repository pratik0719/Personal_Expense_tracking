import { useSearchParams } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import TransactionList from "../components/TransactionList";

/** Activity: every transaction, searchable and filterable. */
function ActivityPage({ transactions }) {
  const [params] = useSearchParams();
  const initialType = ["income", "expense"].includes(params.get("type")) ? params.get("type") : "";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Activity" subtitle="All transactions" />
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <TransactionList key={initialType} transactions={transactions} initialType={initialType} />
      </div>
    </div>
  );
}

export default ActivityPage;
