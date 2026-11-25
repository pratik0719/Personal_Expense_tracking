import { useMemo, useState } from "react";

import { SearchIcon } from "./Icons";
import TransactionGroups from "./TransactionGroups";
import { useTransactionSheet } from "../context/TransactionSheetContext";
import { MONTH_NAMES, sortByDate } from "../utils/finance";

const PAGE_SIZE = 40;
const TYPE_TABS = [
  { value: "", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
];

/**
 * Full transaction list with type tabs, search, category/month/year
 * filters (folded behind a button on phones) and paging.
 */
function TransactionList({ transactions, initialType = "" }) {
  const { openAdd } = useTransactionSheet();

  const [type, setType] = useState(initialType);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const ofType = useMemo(
    () => transactions.filter((transaction) => !type || transaction.type === type),
    [transactions, type]
  );
  const categories = useMemo(() => [...new Set(ofType.map((transaction) => transaction.category))].sort(), [ofType]);
  const years = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.date.slice(0, 4)))].sort().reverse(),
    [transactions]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortByDate(
      ofType.filter(
        (transaction) =>
          (!query ||
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query)) &&
          (!category || transaction.category === category) &&
          (!year || transaction.date.slice(0, 4) === year) &&
          (!month || transaction.date.slice(5, 7) === month)
      ),
      sortOrder
    );
  }, [ofType, search, category, month, year, sortOrder]);

  const activeFilterCount = [category, month, year].filter(Boolean).length;
  const isFiltering = activeFilterCount > 0 || search.trim() !== "";

  const reset = () => setVisibleCount(PAGE_SIZE);
  const bind = (setter) => (event) => {
    setter(event.target.value);
    reset();
  };
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMonth("");
    setYear("");
    reset();
  };

  const selectClass = "field py-2.5 sm:w-auto";

  return (
    <div className="space-y-4">
      {/* Type tabs + sort */}
      <div className="flex items-center justify-between gap-3">
        <div className="scrollbar-none flex gap-2 overflow-x-auto" role="group" aria-label="Transaction type">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={type === tab.value}
              onClick={() => {
                setType(tab.value);
                setCategory("");
                reset();
              }}
              className={`pill shrink-0 ${type === tab.value ? "pill-active" : "text-muted"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSortOrder((order) => (order === "newest" ? "oldest" : "newest"))}
          className="shrink-0 text-xs font-semibold text-muted hover:text-white"
          aria-label={`Sorted ${sortOrder} first. Change sort order.`}
        >
          {sortOrder === "newest" ? "Newest ↓" : "Oldest ↑"}
        </button>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={search}
            onChange={bind(setSearch)}
            placeholder="Search notes or categories"
            aria-label="Search transactions"
            enterKeyHint="search"
            className="field rounded-full py-2.5 pl-10"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="list-filters"
          className={`pill shrink-0 sm:hidden ${filtersOpen || activeFilterCount ? "pill-active" : "text-muted"}`}
        >
          Filters{activeFilterCount > 0 && ` · ${activeFilterCount}`}
        </button>
      </div>

      {/* Filters: collapsible on phones, always visible from sm up */}
      <div id="list-filters" className={`${filtersOpen ? "grid" : "hidden"} grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center`}>
        <select value={category} onChange={bind(setCategory)} aria-label="Filter by category" className={`${selectClass} col-span-2`}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={month} onChange={bind(setMonth)} aria-label="Filter by month" className={selectClass}>
          <option value="">All months</option>
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={String(index + 1).padStart(2, "0")}>
              {name}
            </option>
          ))}
        </select>
        <select value={year} onChange={bind(setYear)} aria-label="Filter by year" className={selectClass}>
          <option value="">All years</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {isFiltering && (
          <button type="button" onClick={clearFilters} className="col-span-2 py-2 text-sm font-semibold text-brand sm:col-span-1">
            Clear all
          </button>
        )}
      </div>

      <p className="px-1 text-xs text-muted">
        {isFiltering ? `${filtered.length} of ${ofType.length} shown` : `${ofType.length} transactions`}
      </p>

      {/* Results */}
      {ofType.length === 0 ? (
        <div className="panel px-6 py-12 text-center">
          <p className="font-semibold">No transactions yet</p>
          <p className="mt-1 text-sm text-muted">Tap + to record your first one.</p>
          <button type="button" onClick={() => openAdd(type || "expense")} className="btn-primary mt-5 px-6 text-sm">
            Add transaction
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel px-6 py-12 text-center">
          <p className="font-semibold">No matching transactions</p>
          <p className="mt-1 text-sm text-muted">Try a different search or clear the filters.</p>
          <button type="button" onClick={clearFilters} className="pill mt-5">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <TransactionGroups transactions={filtered.slice(0, visibleCount)} />
          {filtered.length > visibleCount && (
            <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="pill w-full py-3">
              Show more ({filtered.length - visibleCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionList;
