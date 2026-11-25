import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CategoryChips, CategoryRanking, StackedBar } from "../components/CategoryBreakdown";
import FinanceChart from "../components/FinanceChart";
import { DownloadIcon, InfoIcon } from "../components/Icons";
import MonthFilter from "../components/MonthFilter";
import PageHeader from "../components/PageHeader";
import StatTile from "../components/StatTile";
import { useCurrencyFormatter } from "../context/BrandContext";
import { downloadTransactionsCsv } from "../utils/download";
import {
  filterByMonth,
  getCategoryMeta,
  groupByCategory,
  MONTH_NAMES,
  percentChange,
  shiftMonth,
  sumAmounts,
} from "../utils/finance";

const TABS = [
  { value: "expense", label: "Expenses" },
  { value: "budget", label: "Budget" },
  { value: "income", label: "Income" },
];

/**
 * Report: month-over-month comparison, category breakdown
 * (expenses / budget / income) and the six-month cash-flow trend.
 */
function ReportPage({ transactions, budgets }) {
  const formatCurrency = useCurrencyFormatter();
  const today = new Date();
  const [selected, setSelected] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [tab, setTab] = useState("expense");

  const monthTx = useMemo(() => filterByMonth(transactions, selected.month, selected.year), [transactions, selected]);
  const previous = shiftMonth(selected, -1);
  const previousTx = useMemo(() => filterByMonth(transactions, previous.month, previous.year), [transactions, previous.month, previous.year]);

  const spent = sumAmounts(monthTx, "expense");
  const income = sumAmounts(monthTx, "income");
  const expenseRows = groupByCategory(monthTx, "expense");
  const incomeRows = groupByCategory(monthTx, "income");
  const top = expenseRows[0];
  const topPrevious = top
    ? sumAmounts(previousTx.filter((transaction) => transaction.type === "expense" && transaction.category === top.category))
    : 0;

  const budgetTotal = budgets.reduce((sum, budget) => sum + Number(budget.limit), 0);
  const monthName = MONTH_NAMES[selected.month];

  // Average monthly income over the six months ending at the selected month.
  const avgIncome =
    Array.from({ length: 6 }, (_, index) => {
      const { month, year } = shiftMonth(selected, -index);
      return sumAmounts(filterByMonth(transactions, month, year), "income");
    }).reduce((sum, value) => sum + value, 0) / 6;

  const isCurrentMonth = selected.month === today.getMonth() && selected.year === today.getFullYear();
  const daysCounted = isCurrentMonth ? today.getDate() : new Date(selected.year, selected.month + 1, 0).getDate();

  const download = () =>
    downloadTransactionsCsv(monthTx, `transactions-${selected.year}-${String(selected.month + 1).padStart(2, "0")}.csv`);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Report"
        subtitle={`${monthName} ${selected.year}`}
        action={
          <button
            type="button"
            onClick={download}
            disabled={monthTx.length === 0}
            className="pill flex items-center gap-1.5 px-3 py-2 text-xs disabled:opacity-40 lg:px-4 lg:text-sm"
            title="Download this month as CSV"
          >
            <span className="hidden min-[380px]:inline">Download</span>
            <DownloadIcon className="h-4 w-4" />
          </button>
        }
      />
      <MonthFilter selectedMonth={selected} setSelectedMonth={setSelected} />

      <div className="space-y-5 px-4 pt-3 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:px-8">
        <div className="space-y-5">
          {/* Month vs last month */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile
                icon="💳"
                label="Total spent"
                value={formatCurrency(spent, { whole: true })}
                change={percentChange(spent, sumAmounts(previousTx, "expense"))}
                goodWhenUp={false}
                note="No spending last month"
              />
              <StatTile
                icon="🛍️"
                label="Top spending"
                value={top ? top.category : "—"}
                change={top ? percentChange(top.amount, topPrevious) : null}
                goodWhenUp={false}
                note={top ? formatCurrency(top.amount, { whole: true }) : "No expenses"}
              />
            </div>
            <p className="mt-3 flex items-center gap-1.5 px-1 text-xs text-muted">
              <InfoIcon className="h-3.5 w-3.5 shrink-0" />
              Net cash flow{" "}
              <span className={`money ${income - spent < 0 ? "text-down" : "text-white"}`}>{formatCurrency(income - spent)}</span>
            </p>
          </div>

          {/* Category breakdown */}
          <section>
            <h2 className="mb-3 px-1 text-lg font-bold">Category breakdown</h2>
            <div className="mb-3 flex gap-2" role="tablist" aria-label="Breakdown type">
              {TABS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  onClick={() => setTab(item.value)}
                  className={`pill ${tab === item.value ? "pill-active" : "text-muted"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="panel p-5" role="tabpanel">
              {tab === "expense" && (
                <>
                  <p className="text-sm font-medium text-white/90">Total spend</p>
                  <p className="money mt-1 text-3xl font-bold">{formatCurrency(spent)}</p>
                  <div className="mt-4">
                    <StackedBar rows={expenseRows} />
                  </div>
                  {expenseRows.length > 0 ? (
                    <div className="mt-4">
                      <CategoryChips rows={expenseRows} />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted">No expenses in {monthName}.</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="tile min-w-0 p-3 text-center">
                      <p className="text-xs text-muted">Daily average</p>
                      <p className="money mt-1 truncate font-bold">{formatCurrency(spent / daysCounted, { whole: true })}</p>
                    </div>
                    <div className="tile min-w-0 p-3 text-center">
                      <p className="text-xs text-muted">Expenses</p>
                      <p className="money mt-1 font-bold">{monthTx.filter((transaction) => transaction.type === "expense").length}</p>
                    </div>
                  </div>
                  {budgetTotal > 0 && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                      <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                      Your monthly spending limit is {formatCurrency(budgetTotal, { whole: true })}
                    </p>
                  )}
                </>
              )}

              {tab === "income" && (
                <>
                  <p className="text-sm font-medium text-white/90">Income</p>
                  <p className="money mt-1 text-3xl font-bold text-up">{formatCurrency(income)}</p>
                  <div className="mt-4">
                    <StackedBar rows={incomeRows} />
                  </div>
                  {incomeRows.length > 0 ? (
                    <div className="mt-4">
                      <CategoryChips rows={incomeRows} />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted">No income in {monthName}.</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="tile min-w-0 p-3 text-center">
                      <p className="text-xs text-muted">Total income</p>
                      <p className="money mt-1 truncate font-bold">{formatCurrency(income, { whole: true })}</p>
                    </div>
                    <div className="tile min-w-0 p-3 text-center">
                      <p className="text-xs text-muted">Avg income/mo</p>
                      <p className="money mt-1 truncate font-bold">{formatCurrency(avgIncome, { whole: true })}</p>
                    </div>
                  </div>
                </>
              )}

              {tab === "budget" &&
                (budgets.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="font-semibold">No budgets yet</p>
                    <p className="mt-1 text-sm text-muted">Set monthly limits to compare against your spending.</p>
                    <Link to="/budgets" className="btn-primary mt-5 inline-block px-6 text-sm">
                      Create a budget
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white/90">Spent of budget</p>
                    <p className="money mt-1 text-2xl font-bold sm:text-3xl">
                      {formatCurrency(spent, { whole: true })}
                      <span className="text-base text-muted"> / {formatCurrency(budgetTotal, { whole: true })}</span>
                    </p>
                    <ul className="mt-5 space-y-4">
                      {budgets.map((budget) => {
                        const used = sumAmounts(
                          monthTx.filter((transaction) => transaction.type === "expense" && transaction.category === budget.category)
                        );
                        const share = (used / budget.limit) * 100;
                        return (
                          <li key={budget.id}>
                            <div className="flex items-baseline justify-between gap-3 text-sm">
                              <span className="flex items-center gap-2 font-semibold">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getCategoryMeta(budget.category).color }} />
                                {budget.category}
                              </span>
                              <span className={`money text-xs ${share > 100 ? "text-down" : "text-muted"}`}>
                                {formatCurrency(used, { whole: true })} / {formatCurrency(budget.limit, { whole: true })}
                              </span>
                            </div>
                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(share, 100)}%`,
                                  backgroundColor: share > 100 ? "var(--color-down)" : getCategoryMeta(budget.category).color,
                                }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <Link to="/budgets" className="mt-5 inline-block text-sm font-semibold text-brand">
                      Manage budgets →
                    </Link>
                  </>
                ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <FinanceChart transactions={transactions} month={selected.month} year={selected.year} />

          {expenseRows.length > 0 && (
            <section className="panel p-5">
              <h2 className="mb-4 text-sm font-medium text-white/90">Where {monthName}&apos;s money went</h2>
              <CategoryRanking rows={expenseRows} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
