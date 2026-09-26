import { useState } from "react";

import TransactionItem from "./TransactionItem";

/**
 * Labels for the twelve months,
 * used by the month filter dropdown.
 *
 * The option values are zero-padded
 * month numbers ("01" to "12") so they
 * can be compared directly against the
 * month part of the ISO date string.
 */
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * TransactionList displays all recorded transactions.
 *
 * It includes:
 * - A search box that filters transactions
 *   by description or category.
 * - An optional category filter dropdown.
 * - A month and year filter so the user
 *   can view transactions from a specific
 *   month or year.
 * - A date sorting toggle (newest or oldest first).
 *
 * If there are no transactions,
 * it displays an empty state instead.
 *
 * If no transaction matches the active
 * filters, it displays a no-results
 * message instead.
 */
function TransactionList({
  transactions,
  deleteTransaction,
  showCategoryFilter = false,
}) {
  /**
   * Holds the current search text.
   *
   * The search matches against the
   * description and the category.
   */
  const [searchTerm, setSearchTerm] =
    useState("");

  /**
   * Holds the selected category filter.
   *
   * An empty string means "All categories".
   */
  const [categoryFilter, setCategoryFilter] =
    useState("");

  /**
   * Holds the selected month filter.
   *
   * An empty string means "All months".
   * Otherwise it is a zero-padded month
   * number like "01" for January.
   */
  const [monthFilter, setMonthFilter] =
    useState("");

  /**
   * Holds the selected year filter.
   *
   * An empty string means "All years".
   * Otherwise it is a four-digit year
   * like "2026".
   */
  const [yearFilter, setYearFilter] =
    useState("");

  /**
   * Controls the date sort direction.
   *
   * "newest" places the most recent
   * transactions at the top.
   * "oldest" places the earliest
   * transactions at the top.
   */
  const [sortOrder, setSortOrder] =
    useState("newest");

  /**
   * Builds the category dropdown options
   * from the transactions themselves.
   *
   * This way the Income page only offers
   * income categories and the Expense page
   * only offers expense categories.
   */
  const getAvailableCategories = () => {
    const categorySet = new Set(
      transactions.map(
        (transaction) => transaction.category
      )
    );

    return Array.from(categorySet).sort(
      (first, second) =>
        first.localeCompare(second)
    );
  };

  /**
   * Builds the year dropdown options from
   * the transactions themselves.
   *
   * The years are sorted with the most
   * recent one first.
   */
  const getAvailableYears = () => {
    const yearSet = new Set(
      transactions.map(
        (transaction) => transaction.date.slice(0, 4)
      )
    );

    return Array.from(yearSet).sort().reverse();
  };

  /**
   * Sorts transactions by date.
   *
   * The unique transaction ID is used as a
   * tie-breaker when transactions share
   * the same date.
   */
  const sortTransactions = (
    transactionsToSort
  ) => {
    const sortedTransactions = [
      ...transactionsToSort,
    ];

    sortedTransactions.sort(
      (first, second) => {
        const firstDate = new Date(
          `${first.date}T00:00:00`
        );

        const secondDate = new Date(
          `${second.date}T00:00:00`
        );

        if (
          secondDate.getTime() !==
          firstDate.getTime()
        ) {
          return sortOrder === "newest"
            ? secondDate - firstDate
            : firstDate - secondDate;
        }

        return sortOrder === "newest"
          ? second.id - first.id
          : first.id - second.id;
      }
    );

    return sortedTransactions;
  };

  /**
   * Filters and sorts the transaction list
   * using the search text, the selected
   * category, and the selected month
   * and year.
   *
   * The search is case-insensitive and
   * matches a partial word anywhere.
   *
   * Transaction dates are stored as
   * "YYYY-MM-DD" strings, so the year is
   * the first four characters and the
   * month is characters five and six.
   */
  const getFilteredTransactions = () => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const filteredTransactions =
      transactions.filter((transaction) => {
        const description =
          transaction.description.toLowerCase();

        const category =
          transaction.category.toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          description.includes(
            normalizedSearch
          ) ||
          category.includes(
            normalizedSearch
          );

        const matchesCategory =
          !categoryFilter ||
          transaction.category ===
            categoryFilter;

        const matchesYear =
          !yearFilter ||
          transaction.date.slice(0, 4) ===
            yearFilter;

        const matchesMonth =
          !monthFilter ||
          transaction.date.slice(5, 7) ===
            monthFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesYear &&
          matchesMonth
        );
      });

    return sortTransactions(
      filteredTransactions
    );
  };

  /**
   * Resets the search text, the category
   * filter, and the month and year
   * filters.
   */
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setMonthFilter("");
    setYearFilter("");
  };

  /**
   * True when at least one filter
   * is currently active.
   */
  const isFilterActive =
    searchTerm.trim() !== "" ||
    categoryFilter !== "" ||
    monthFilter !== "" ||
    yearFilter !== "";

  const filteredTransactions =
    getFilteredTransactions();

  const availableCategories =
    getAvailableCategories();

  const availableYears =
    getAvailableYears();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Transaction List Header */}
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isFilterActive
              ? `Showing ${filteredTransactions.length} of ${transactions.length}`
              : `${transactions.length} ${
                  transactions.length === 1
                    ? "transaction"
                    : "transactions"
                }`}
          </p>
        </div>

        {/* List Controls: Search, Category Filter, Sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

          {/* Search Box */}
          <div className="relative sm:w-56 sm:shrink-0">

            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full px-1.5 text-slate-400 transition hover:text-slate-700"
              >
                ✕
              </button>
            )}

          </div>

          {/* Category Filter Dropdown */}
          {showCategoryFilter && (
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              aria-label="Filter by category"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-44 sm:shrink-0"
            >
              <option value="">
                All categories
              </option>

              {availableCategories.map(
                (categoryItem) => (
                  <option
                    key={categoryItem}
                    value={categoryItem}
                  >
                    {categoryItem}
                  </option>
                )
              )}
            </select>
          )}

          {/* Year Filter Dropdown */}
          <select
            value={yearFilter}
            onChange={(event) =>
              setYearFilter(
                event.target.value
              )
            }
            aria-label="Filter by year"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-32 sm:shrink-0"
          >
            <option value="">
              All years
            </option>

            {availableYears.map(
              (yearItem) => (
                <option
                  key={yearItem}
                  value={yearItem}
                >
                  {yearItem}
                </option>
              )
            )}
          </select>

          {/* Month Filter Dropdown */}
          <select
            value={monthFilter}
            onChange={(event) =>
              setMonthFilter(
                event.target.value
              )
            }
            aria-label="Filter by month"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-40 sm:shrink-0"
          >
            <option value="">
              All months
            </option>

            {MONTH_LABELS.map(
              (monthLabel, monthIndex) => (
                <option
                  key={monthLabel}
                  value={String(
                    monthIndex + 1
                  ).padStart(2, "0")}
                >
                  {monthLabel}
                </option>
              )
            )}
          </select>

          {/* Date Sort Toggle */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 sm:shrink-0">

            <button
              type="button"
              onClick={() =>
                setSortOrder("newest")
              }
              className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                sortOrder === "newest"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Newest first
            </button>

            <button
              type="button"
              onClick={() =>
                setSortOrder("oldest")
              }
              className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                sortOrder === "oldest"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Oldest first
            </button>

          </div>

          {/* Clear Filters Button */}
          {isFilterActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              ✕ Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (

        <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-600">
            NPR
          </div>

          <h3 className="font-semibold text-slate-700">
            No transactions yet
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Add your first income or expense transaction.
          </p>

        </div>

      ) : filteredTransactions.length === 0 ? (

        <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl">
            🔍
          </div>

          <h3 className="font-semibold text-slate-700">
            No matching transactions
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Nothing matches the current search,
            category, or month and year filters.
            Try different keywords.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Clear filters
          </button>

        </div>

      ) : (
        <div>
          {filteredTransactions.map(
            (transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                deleteTransaction={
                  deleteTransaction
                }
              />
            )
          )}
        </div>
      )}

    </section>
  );
}

export default TransactionList;