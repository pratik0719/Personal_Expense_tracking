import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * FinanceChart displays the user's cash flow
 * for the most recent six months.
 *
 * It compares:
 * - Monthly income
 * - Monthly expenses
 *
 * All chart data comes from real transactions.
 * No sample data is used.
 */
function FinanceChart({ transactions }) {
  /**
   * Formats a number into USD currency.
   *
   * Example:
   * 1500 becomes $1,500.00
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  /**
   * Creates the most recent six-month range.
   *
   * Example:
   * Apr
   * May
   * Jun
   * Jul
   * Aug
   * Sep
   */
  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index,
        1
      );

      months.push({
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
        }),

        year: monthDate.getFullYear(),

        monthNumber: monthDate.getMonth(),
      });
    }

    return months;
  };

  /**
   * Builds the chart data from real transactions.
   *
   * Each transaction is placed into its matching month
   * and then added to either income or expenses.
   */
  const chartData = useMemo(() => {
    const months = getLastSixMonths();

    return months.map((monthItem) => {
      const monthlyTransactions = transactions.filter(
        (transaction) => {
          const transactionDate = new Date(
            `${transaction.date}T00:00:00`
          );

          return (
            transactionDate.getFullYear() ===
              monthItem.year &&
            transactionDate.getMonth() ===
              monthItem.monthNumber
          );
        }
      );

      const income = monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      const expenses = monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      return {
        month: monthItem.month,
        income,
        expenses,
      };
    });
  }, [transactions]);

  /**
   * Checks whether at least one real transaction
   * exists inside the displayed six-month period.
   */
  const hasChartData = chartData.some(
    (monthItem) =>
      monthItem.income > 0 ||
      monthItem.expenses > 0
  );

  /**
   * Customizes values displayed inside the
   * Recharts tooltip.
   */
  const tooltipFormatter = (
    value,
    name
  ) => {
    const label =
      name === "income"
        ? "Income"
        : "Expenses";

    return [
      formatCurrency(value),
      label,
    ];
  };

  /**
   * Converts large Y-axis numbers into shorter labels.
   *
   * Example:
   * 1000 becomes $1k
   * 2500 becomes $2.5k
   */
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(
        value / 1000000
      ).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `$${(
        value / 1000
      ).toFixed(1)}k`;
    }

    return `$${value}`;
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Chart Heading */}
      <div className="mb-6 flex items-start justify-between gap-4">

        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Cash Flow Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Income vs expenses over the last 6 months.
          </p>
        </div>

        <div className="hidden rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 sm:block">
          Last 6 months
        </div>

      </div>

      {/* Display the chart when transaction data exists */}
      {hasChartData ? (
        <div className="h-[320px] w-full sm:h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 5,
                left: -15,
                bottom: 0,
              }}
              barGap={6}
            >

              {/* Horizontal chart grid */}
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                vertical={false}
              />

              {/* Month labels */}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                dy={10}
              />

              {/* Money values */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                tickFormatter={
                  formatYAxis
                }
              />

              {/* Hover information */}
              <Tooltip
                formatter={
                  tooltipFormatter
                }
                cursor={{
                  fill: "#f8fafc",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 25px rgba(15, 23, 42, 0.08)",
                }}
              />

              {/* Chart labels */}
              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                }}
                formatter={(value) =>
                  value === "income"
                    ? "Income"
                    : "Expenses"
                }
              />

              {/* Income bars */}
              <Bar
                dataKey="income"
                fill="#6366f1"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
                maxBarSize={34}
              />

              {/* Expense bars */}
              <Bar
                dataKey="expenses"
                fill="#86d7b5"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
                maxBarSize={34}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>
      ) : (

        /* Empty chart state */
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            ▥
          </div>

          <h3 className="font-semibold text-slate-700">
            No cash flow data yet
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Add an income or expense transaction and your monthly chart will appear here.
          </p>

        </div>
      )}

    </section>
  );
}

export default FinanceChart;