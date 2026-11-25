/**
 * Shared finance helpers and constants.
 *
 * Keeping categories, date helpers and totals here means every screen
 * calculates and labels money the same way.
 */

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Gift", "Other"];

export const CATEGORIES = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
};

/** Icon and colour used to identify each category at a glance. */
const CATEGORY_META = {
  Food: { icon: "🍔", color: "#fb923c" },
  Transport: { icon: "🚌", color: "#22d3ee" },
  Shopping: { icon: "🛍️", color: "#f472b6" },
  Bills: { icon: "🧾", color: "#3b82f6" },
  Entertainment: { icon: "🎬", color: "#fbbf24" },
  Health: { icon: "💊", color: "#a78bfa" },
  Education: { icon: "📚", color: "#2dd4bf" },
  Salary: { icon: "💼", color: "#3b82f6" },
  Freelance: { icon: "💻", color: "#34d399" },
  Gift: { icon: "🎁", color: "#f472b6" },
  Other: { icon: "✳️", color: "#8b5cf6" },
};

export const getCategoryMeta = (category) =>
  CATEGORY_META[category] || CATEGORY_META.Other;

export const MONTH_NAMES = [
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

/** Converts a Date into the local "YYYY-MM-DD" string used by date inputs. */
export const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Today's date in the user's local timezone.
 * (toISOString() would use UTC and can return yesterday's date.)
 */
export const todayISO = () => toISODate(new Date());

/** Parses a stored "YYYY-MM-DD" date as local midnight. */
export const parseDate = (isoDate) => new Date(`${isoDate}T00:00:00`);

export const isInMonth = (isoDate, month, year) => {
  const date = parseDate(isoDate);

  return date.getMonth() === month && date.getFullYear() === year;
};

export const filterByMonth = (transactions, month, year) =>
  transactions.filter((transaction) =>
    isInMonth(transaction.date, month, year)
  );

/** Sums transaction amounts, optionally for a single type. */
export const sumAmounts = (transactions, type) =>
  transactions
    .filter((transaction) => !type || transaction.type === type)
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

/** Human-friendly date heading: "Today", "Yesterday" or "Mon, 23 Nov 2026". */
export const formatDateHeading = (isoDate) => {
  const today = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (isoDate === today) return "Today";
  if (isoDate === toISODate(yesterday)) return "Yesterday";

  const date = parseDate(isoDate);
  const sameYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

/** Totals expenses (or income) per category, largest first. */
export const groupByCategory = (transactions, type = "expense") => {
  const totals = new Map();

  transactions
    .filter((transaction) => transaction.type === type)
    .forEach((transaction) => {
      totals.set(
        transaction.category,
        (totals.get(transaction.category) || 0) + Number(transaction.amount)
      );
    });

  return Array.from(totals, ([category, amount]) => ({ category, amount })).sort(
    (first, second) => second.amount - first.amount
  );
};

/** Newest first; the id breaks ties between transactions on the same day. */
export const sortByDate = (transactions, order = "newest") => {
  const direction = order === "newest" ? -1 : 1;

  return [...transactions].sort((first, second) => {
    if (first.date !== second.date) {
      return first.date < second.date ? -direction : direction;
    }

    return (Number(first.id) - Number(second.id)) * direction;
  });
};

/** Validates a transaction loaded from storage or a backup file. */
export const isValidTransaction = (transaction) =>
  transaction &&
  typeof transaction === "object" &&
  ["income", "expense"].includes(transaction.type) &&
  Number(transaction.amount) > 0 &&
  typeof transaction.category === "string" &&
  typeof transaction.description === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(transaction.date);

export const isValidBudget = (budget) =>
  budget &&
  typeof budget === "object" &&
  typeof budget.category === "string" &&
  Number(budget.limit) > 0;

/* ---------- Months ---------- */

/** The last `count` months ending at the current month, oldest first. */
export const recentMonths = (count = 12) => {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (count - 1 - index), 1);
    return { month: date.getMonth(), year: date.getFullYear() };
  });
};

export const shiftMonth = ({ month, year }, offset) => {
  const date = new Date(year, month + offset, 1);
  return { month: date.getMonth(), year: date.getFullYear() };
};

/** Percentage change between two numbers, or null when there is no base. */
export const percentChange = (current, previous) =>
  previous > 0 ? ((current - previous) / previous) * 100 : null;

/* ---------- Loans ---------- */

/**
 * A loan is money lent to someone (receivable) or borrowed from
 * someone (payable). Repayments are recorded against it until the
 * outstanding amount reaches zero.
 *
 * { id, direction: "receivable" | "payable", person, amount, date,
 *   dueDate?, note, payments: [{ id, amount, date }] }
 */
export const loanPaid = (loan) =>
  (loan.payments || []).reduce((total, payment) => total + Number(payment.amount), 0);

export const loanOutstanding = (loan) =>
  Math.max(Math.round((Number(loan.amount) - loanPaid(loan)) * 100) / 100, 0);

export const isLoanSettled = (loan) => loanOutstanding(loan) <= 0;

/** Days until the due date (negative when overdue), or null with no due date. */
export const daysUntil = (isoDate) => {
  if (!isoDate) return null;
  const today = parseDate(todayISO());
  return Math.round((parseDate(isoDate) - today) / 86_400_000);
};

export const isValidLoan = (loan) =>
  loan &&
  typeof loan === "object" &&
  ["receivable", "payable"].includes(loan.direction) &&
  typeof loan.person === "string" &&
  Number(loan.amount) > 0 &&
  /^\d{4}-\d{2}-\d{2}$/.test(loan.date) &&
  Array.isArray(loan.payments);

/** "12 Nov 2026" */
export const formatShortDate = (isoDate) =>
  parseDate(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Human description of a due date: "Due today", "Due in 3 days", "Overdue by 2 days". */
export const describeDue = (isoDate) => {
  const days = daysUntil(isoDate);
  if (days === null) return null;
  if (days === 0) return { text: "Due today", tone: "warn" };
  if (days === 1) return { text: "Due tomorrow", tone: "warn" };
  if (days > 1) return { text: `Due in ${days} days`, tone: days <= 7 ? "warn" : "ok" };
  return { text: `Overdue by ${-days} ${days === -1 ? "day" : "days"}`, tone: "late" };
};
