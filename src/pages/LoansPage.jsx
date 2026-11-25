import { useState } from "react";

import BottomSheet from "../components/BottomSheet";
import { PlusIcon } from "../components/Icons";
import LoanCard from "../components/loans/LoanCard";
import LoanDetail from "../components/loans/LoanDetail";
import LoanForm from "../components/loans/LoanForm";
import PageHeader from "../components/PageHeader";
import { useCurrencyFormatter } from "../context/BrandContext";
import { daysUntil, isLoanSettled, loanOutstanding } from "../utils/finance";

const TABS = [
  { value: "receivable", label: "To receive" },
  { value: "payable", label: "To pay" },
];

/** Overdue first, then soonest due, then most recent. */
const sortLoans = (loans) =>
  [...loans].sort((first, second) => {
    const firstDue = daysUntil(first.dueDate) ?? Infinity;
    const secondDue = daysUntil(second.dueDate) ?? Infinity;
    if (firstDue !== secondDue) return firstDue - secondDue;
    return second.date.localeCompare(first.date);
  });

/**
 * Loans: money lent to others (receivable) and money borrowed (payable),
 * with repayments tracked until each loan is settled.
 *
 * Loans are kept separate from income and expenses so they don't
 * distort monthly spending.
 */
function LoansPage({ loans, addLoan, updateLoan, deleteLoan, addPayment, deletePayment }) {
  const formatCurrency = useCurrencyFormatter();
  const [tab, setTab] = useState("receivable");
  const [showSettled, setShowSettled] = useState(false);
  // null | { mode: "new" } | { mode: "view", id } | { mode: "edit", id }
  const [sheet, setSheet] = useState(null);

  const open = loans.filter((loan) => !isLoanSettled(loan));
  const totalFor = (direction) =>
    open.filter((loan) => loan.direction === direction).reduce((sum, loan) => sum + loanOutstanding(loan), 0);
  const toReceive = totalFor("receivable");
  const toPay = totalFor("payable");
  const net = toReceive - toPay;
  const overdue = open.filter((loan) => (daysUntil(loan.dueDate) ?? 0) < 0).length;

  const ofTab = loans.filter((loan) => loan.direction === tab);
  const active = sortLoans(ofTab.filter((loan) => !isLoanSettled(loan)));
  const settled = ofTab.filter(isLoanSettled).sort((first, second) => second.date.localeCompare(first.date));

  const current = sheet?.id ? loans.find((loan) => loan.id === sheet.id) : null;
  const close = () => setSheet(null);
  const openLoan = (loan) => setSheet({ mode: "view", id: loan.id });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Loans"
        subtitle="Payable & receivable"
        action={
          <button type="button" onClick={() => setSheet({ mode: "new" })} className="pill flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm">
            <PlusIcon className="h-4 w-4" /> New
          </button>
        }
      />

      <div className="space-y-5 px-4 pt-4 sm:px-6 lg:px-8">
        {/* Summary */}
        <section className="panel p-5">
          <p className="text-sm font-medium text-white/90">Net position</p>
          <p className={`money mt-1 text-3xl font-bold ${net < 0 ? "text-down" : net > 0 ? "text-up" : ""}`}>
            {net > 0 ? "+" : net < 0 ? "−" : ""}
            {formatCurrency(Math.abs(net))}
          </p>
          <p className="mt-1 text-xs text-muted">
            {net > 0 ? "Others owe you more than you owe" : net < 0 ? "You owe more than others owe you" : "All square"}
            {overdue > 0 && <span className="font-semibold text-down"> · {overdue} overdue</span>}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setTab("receivable")} className="tile min-w-0 p-3 text-left transition hover:bg-white/[0.04]">
              <p className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-up" /> To receive
              </p>
              <p className="money mt-1 truncate font-bold text-up">{formatCurrency(toReceive, { whole: true })}</p>
            </button>
            <button type="button" onClick={() => setTab("payable")} className="tile min-w-0 p-3 text-left transition hover:bg-white/[0.04]">
              <p className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-down" /> To pay
              </p>
              <p className="money mt-1 truncate font-bold text-down">{formatCurrency(toPay, { whole: true })}</p>
            </button>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2" role="tablist" aria-label="Loan type">
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
          {settled.length > 0 && (
            <button type="button" onClick={() => setShowSettled((value) => !value)} className="text-xs font-semibold text-muted hover:text-white">
              {showSettled ? "Hide settled" : `Settled (${settled.length})`}
            </button>
          )}
        </div>

        {/* List */}
        {active.length === 0 && !(showSettled && settled.length) ? (
          <div className="panel px-6 py-10 text-center">
            <p className="font-semibold">{tab === "receivable" ? "No one owes you money" : "You don't owe anyone"}</p>
            <p className="mt-1 text-sm text-muted">
              {tab === "receivable" ? "Record money you lend so you never forget to collect it." : "Record money you borrow to keep track of repayments."}
            </p>
            <button type="button" onClick={() => setSheet({ mode: "new" })} className="btn-primary mt-5 px-6 text-sm">
              Add a loan
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {active.map((loan) => (
              <LoanCard key={loan.id} loan={loan} onOpen={openLoan} />
            ))}
            {showSettled && settled.map((loan) => <LoanCard key={loan.id} loan={loan} onOpen={openLoan} />)}
          </ul>
        )}

        <p className="px-1 text-xs text-faint">
          Loans are tracked separately and don&apos;t change your income, expenses or budgets.
        </p>
      </div>

      <BottomSheet
        open={Boolean(sheet && (sheet.mode === "new" || current))}
        onClose={close}
        title={sheet?.mode === "new" ? "New loan" : sheet?.mode === "edit" ? "Edit loan" : "Loan details"}
      >
        {sheet?.mode === "new" && (
          <LoanForm
            defaultDirection={tab}
            onSubmit={(loan) => {
              addLoan(loan);
              setTab(loan.direction);
              close();
            }}
          />
        )}
        {sheet?.mode === "edit" && current && (
          <LoanForm
            initial={current}
            onSubmit={(loan) => {
              updateLoan(loan);
              setSheet({ mode: "view", id: loan.id });
            }}
          />
        )}
        {sheet?.mode === "view" && current && (
          <LoanDetail
            loan={current}
            addPayment={addPayment}
            deletePayment={deletePayment}
            onEdit={() => setSheet({ mode: "edit", id: current.id })}
            onDelete={(id) => {
              deleteLoan(id);
              close();
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}

export default LoansPage;
