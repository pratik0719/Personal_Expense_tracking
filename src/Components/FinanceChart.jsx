import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const INCOME_COLOR = "#16a34a";   // Green
const EXPENSE_COLOR = "#2563eb";  // Blue

function FinanceChart({ transactions = [] }) {

  // Keep only income transactions
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "income"
  );

  // Keep only expense transactions
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  // Calculate total income
  const totalIncome = incomeTransactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount),
    0
  );

  // Calculate total expense
  const totalExpense = expenseTransactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount),
    0
  );

  // Check if real data exists
  const hasData = totalIncome > 0 || totalExpense > 0;

  // Real chart data
  // If no transactions exist, show a 50/50 placeholder
  const chartData = hasData
    ? [
        {
          name: "Income",
          value: totalIncome,
        },
        {
          name: "Expense",
          value: totalExpense,
        },
      ].filter((item) => item.value > 0)
    : [
        {
          name: "Income",
          value: 50,
        },
        {
          name: "Expense",
          value: 50,
        },
      ];

  // Calculate balance
  const balance = totalIncome - totalExpense;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Chart heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Income vs Expense
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare the money coming in and going out.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">

        {/* =========================
            LEFT SIDE - DONUT CHART
        ========================== */}
        <div className="relative h-[300px] w-full">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart
              // Prevent focus box around chart
              style={{ outline: "none" }}
            >

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"

                cx="50%"
                cy="50%"

                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}

                // Prevent focus outline when clicked
                tabIndex={-1}

                // Makes the cursor look interactive
                style={{
                  outline: "none",
                  cursor: "pointer",
                }}
              >

                {chartData.map((item) => (
                  <Cell
                    key={item.name}

                    fill={
                      item.name === "Income"
                        ? INCOME_COLOR
                        : EXPENSE_COLOR
                    }

                    fillOpacity={hasData ? 1 : 0.35}

                    // Remove click/focus outline
                    style={{
                      outline: "none",
                      cursor: "pointer",
                    }}

                    tabIndex={-1}
                  />
                ))}

              </Pie>


              {/* 
                Tooltip appears when hovering
                over a chart slice
              */}
              <Tooltip
                cursor={false}

                formatter={(value, name) => {

                  // Don't show fake placeholder values
                  if (!hasData) {
                    return ["No data yet", name];
                  }

                  return [
                    `$${Number(value).toFixed(2)}`,
                    name,
                  ];
                }}

                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 6px 20px rgba(15, 23, 42, 0.08)",
                }}

                labelStyle={{
                  fontWeight: 600,
                }}
              />

            </PieChart>

          </ResponsiveContainer>


          {/* Center content */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

            {hasData ? (
              <>
                <p className="text-sm text-slate-500">
                  Balance
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    balance >= 0
                      ? "text-slate-900"
                      : "text-rose-600"
                  }`}
                >
                  ${balance.toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  No data yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add a transaction
                </p>
              </>
            )}

          </div>

        </div>


        {/* =========================
            RIGHT SIDE - TOTALS
        ========================== */}
        <div className="space-y-4">

          {/* Income */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Income
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>

              <div className="h-4 w-4 rounded-full bg-green-600" />

            </div>
          </div>


          {/* Expense */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-blue-700">
                  Expense
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  ${totalExpense.toFixed(2)}
                </p>
              </div>

              <div className="h-4 w-4 rounded-full bg-blue-600" />

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default FinanceChart;