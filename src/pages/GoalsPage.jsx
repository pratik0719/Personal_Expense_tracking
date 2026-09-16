/**
 * GoalsPage displays the user's financial goals.
 *
 * Future functionality will allow users to:
 * - Create savings goals.
 * - Set target amounts.
 * - Track money saved.
 * - Monitor goal progress.
 */
function GoalsPage() {
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Savings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Goals
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create savings goals and track your financial progress.
        </p>
      </div>

      {/* Empty State */}
      <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
          ◎
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-800">
          No savings goals yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Savings goals will be added after the budget system is completed.
        </p>

      </section>

    </div>
  );
}

export default GoalsPage;