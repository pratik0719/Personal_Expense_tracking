import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { CategoryChips } from "../components/CategoryBreakdown";
import { InfoIcon } from "../components/Icons";
import MonthFilter from "../components/MonthFilter";
import PageHeader from "../components/PageHeader";
import SpendGauge, { gaugeAmountClass } from "../components/SpendGauge";
import StatTile from "../components/StatTile";
import TransactionGroups from "../components/TransactionGroups";
import { useCurrencyFormatter } from "../context/BrandContext";
import { useTransactionSheet } from "../context/TransactionSheetContext";
import {
  filterByMonth,
  getCategoryMeta,
  groupByCategory,
  isLoanSettled,
  loanOutstanding,
  MONTH_NAMES,
  percentChange,
  shiftMonth,
  sortByDate,
  sumAmounts,
} from "../utils/finance";

const RECENT_LIMIT = 8;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

/**
 * Home: the selected month's spending gauge, income and balance,
 * open loans and the latest transactions.
 */
function HomePage({ transactions, budgets, loans }) {
  const formatCurrency = useCurrencyFormatter();
  const { openAdd } = useTransactionSheet();
  const today = new Date();
  const [selected, setSelected] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const monthTx = useMemo(() => filterByMonth(transactions, selected.month, selected.year), [transactions, selected]);
  const previous = shiftMonth(selected, -1);
  const previousTx = filterByMonth(transactions, previous.month, previous.year);

  const spent = sumAmounts(monthTx, "expense");
  const income = sumAmounts(monthTx, "income");
  const balance = income - spent;
  const rows = groupByCategory(monthTx, "expense");

  // The gauge fills against the budget total, else this month's income.
  const budgetTotal = budgets.reduce((sum, budget) => sum + Number(budget.limit), 0);
  const capacity = budgetTotal || income || spent;
  const usedShare = capacity > 0 ? (spent / capacity) * 100 : 0;

  const openLoans = loans.filter((loan) => !isLoanSettled(loan));
  const toReceive = openLoans.filter((loan) => loan.direction === "receivable").reduce((sum, loan) => sum + loanOutstanding(loan), 0);
  const toPay = openLoans.filter((loan) => loan.direction === "payable").reduce((sum, loan) => sum + loanOutstanding(loan), 0);

  const recent = sortByDate(monthTx).slice(0, RECENT_LIMIT);
  const monthName = MONTH_NAMES[selected.month];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Overview" subtitle={getGreeting()} />
      <MonthFilter selectedMonth={selected} setSelectedMonth={setSelected} />

      <div className="space-y-4 px-4 pt-2 sm:px-6 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-5 lg:space-y-0 lg:px-8">
        <div className="space-y-4">
          {/* Spending gauge */}
          <section className="panel px-5 pt-6 pb-5">
            <SpendGauge
              parts={rows.map((row) => ({ color: getCategoryMeta(row.category).color, value: row.amount }))}
              capacity={capacity}
              label={`Spent ${formatCurrency(spent)} in ${monthName}`}
            >
              <p className="text-sm text-muted">Total spend</p>
              <p className={gaugeAmountClass(formatCurrency(spent))}>{formatCurrency(spent)}</p>
            </SpendGauge>

            {rows.length > 0 ? (
              <div className="mt-5 flex justify-center">
                <CategoryChips rows={rows} />
              </div>
            ) : (
              <p className="mt-4 text-center text-sm text-muted">No spending recorded in {monthName}.</p>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <InfoIcon className="h-3.5 w-3.5 shrink-0" />
              {budgetTotal > 0
                ? `${usedShare.toFixed(0)}% of your ${formatCurrency(budgetTotal, { whole: true })} monthly limit used`
                : income > 0
                  ? `${usedShare.toFixed(0)}% of this month's income spent`
                  : "Set budgets to track a monthly spending limit"}
            </p>
          </section>

          {/* Income + balance */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              icon="↗"
              label="Income"
              value={formatCurrency(income, { whole: true })}
              valueClass="text-up"
              change={percentChange(income, sumAmounts(previousTx, "income"))}
              note="No income last month"
            />
            <StatTile
              icon="◎"
              label="Balance"
              value={formatCurrency(balance, { whole: true })}
              valueClass={balance < 0 ? "text-down" : ""}
              note={income > 0 ? `${((balance / income) * 100).toFixed(0)}% of income saved` : "Income − expenses"}
            />
          </div>

          {/* Loans snapshot */}
          {openLoans.length > 0 && (
            <Link to="/loans" className="panel flex items-center gap-4 p-4 transition hover:brightness-110">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90">Open loans</p>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">To receive</p>
                    <p className="money truncate font-bold text-up">{formatCurrency(toReceive, { whole: true })}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">To pay</p>
                    <p className="money truncate font-bold text-down">{formatCurrency(toPay, { whole: true })}</p>
                  </div>
                </div>
              </div>
              <span className="text-xl text-muted" aria-hidden="true">›</span>
            </Link>
          )}
        </div>

        {/* Latest transactions */}
        <section className="pt-2 lg:pt-0">
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-lg font-bold">{monthName} activity</h2>
            {monthTx.length > RECENT_LIMIT && (
              <Link to="/activity" className="text-sm font-semibold text-brand">
                See all
              </Link>
            )}
          </div>

          {recent.length > 0 ? (
            <TransactionGroups transactions={recent} />
          ) : (
            <div className="panel px-6 py-10 text-center">
              <p className="font-semibold">Nothing in {monthName} yet</p>
              <p className="mt-1 text-sm text-muted">Record income or an expense to get started.</p>
              <button type="button" onClick={() => openAdd()} className="btn-primary mt-5 px-6 text-sm">
                Add transaction
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
