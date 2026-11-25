import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useCurrencyFormatter } from "../context/BrandContext";
import { filterByMonth, sumAmounts } from "../utils/finance";

const IN_COLOR = "#34d399";
const OUT_COLOR = "#3b82f6";

/**
 * Cash flow over the six months ending at the selected month:
 * money in vs money out as two lines, with totals underneath.
 */
function FinanceChart({ transactions, month, year }) {
  const formatCurrency = useCurrencyFormatter();

  const data = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const date = new Date(year, month - (5 - index), 1);
        const monthly = filterByMonth(transactions, date.getMonth(), date.getFullYear());
        return {
          label: date.toLocaleDateString("en-US", { month: "short" }),
          fullLabel: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          income: sumAmounts(monthly, "income"),
          expenses: sumAmounts(monthly, "expense"),
        };
      }),
    [transactions, month, year]
  );

  const totalIn = data.reduce((sum, item) => sum + item.income, 0);
  const totalOut = data.reduce((sum, item) => sum + item.expenses, 0);
  const hasData = totalIn > 0 || totalOut > 0;

  return (
    <section className="panel p-5">
      <p className="text-sm font-medium text-white/90">Cash flow · last 6 months</p>
      <p className={`money mt-2 text-3xl font-bold ${totalIn - totalOut < 0 ? "text-down" : ""}`}>
        {formatCurrency(totalIn - totalOut)}
      </p>
      <p className="mt-1 text-xs text-muted">Net saved after expenses</p>

      {hasData ? (
        <div className="-mx-2 mt-5 h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9b9bb8", fontSize: 12 }} dy={6} />
              <YAxis
                width={56}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9b9bb8", fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                labelFormatter={(_, payload) => payload?.[0]?.payload.fullLabel ?? ""}
                formatter={(value, name) => [formatCurrency(value), name === "income" ? "Money in" : "Money out"]}
                contentStyle={{
                  background: "#15152f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "#fff",
                  fontSize: 13,
                }}
                labelStyle={{ color: "#9b9bb8" }}
              />
              <Line type="linear" dataKey="income" stroke={IN_COLOR} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line type="linear" dataKey="expenses" stroke={OUT_COLOR} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="tile mt-5 flex h-44 items-center justify-center px-6 text-center text-sm text-muted">
          Add income or expenses to see your trend.
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="tile min-w-0 p-3">
          <p className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: IN_COLOR }} /> Money in
          </p>
          <p className="money mt-1 truncate font-bold">{formatCurrency(totalIn, { whole: true })}</p>
        </div>
        <div className="tile min-w-0 p-3">
          <p className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: OUT_COLOR }} /> Money out
          </p>
          <p className="money mt-1 truncate font-bold">{formatCurrency(totalOut, { whole: true })}</p>
        </div>
      </div>
    </section>
  );
}

export default FinanceChart;
