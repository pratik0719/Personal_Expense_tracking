/**
 * SettingsPage displays application preference settings.
 *
 * Future features can include:
 * - Currency selection
 * - Dark mode
 * - Date format
 * - Data export
 * - Data reset
 */
function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Preferences
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Customize your Personal Expense Tracker.
        </p>
      </div>

      {/* Settings Container */}
      <section className="mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* General Settings Header */}
        <div className="border-b border-slate-100 pb-5">
          <h2 className="font-bold text-slate-800">
            General Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage how your financial information is displayed.
          </p>
        </div>

        {/* Currency Setting */}
        <div className="py-6">
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Currency
          </label>

          <select
            id="currency"
            defaultValue="USD"
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="USD">
              USD — US Dollar
            </option>

            <option value="NPR">
              NPR — Nepalese Rupee
            </option>

            <option value="SGD">
              SGD — Singapore Dollar
            </option>

            <option value="EUR">
              EUR — Euro
            </option>

            <option value="GBP">
              GBP — British Pound
            </option>
          </select>
        </div>

      </section>

    </div>
  );
}

export default SettingsPage;