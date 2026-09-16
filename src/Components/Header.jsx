/**
 * Header displays the dashboard title,
 * current month and Add Transaction button.
 */
function Header() {
  /**
   * Gets the current month and year.
   *
   * Example:
   * September 2026
   */
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  /**
   * Scrolls the page smoothly to the
   * Add Transaction form.
   */
  const handleAddTransactionClick = () => {
    const form =
      document.getElementById(
        "transaction-form"
      );

    if (form) {
      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const currentMonth =
    getCurrentMonth();

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

      {/* Dashboard Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Financial Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here&apos;s your financial overview for{" "}
          {currentMonth}.
        </p>
      </div>

      {/* Dashboard Actions */}
      <div className="flex items-center gap-3">

        <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm sm:block">
          {currentMonth}
        </div>

        <button
          type="button"
          onClick={
            handleAddTransactionClick
          }
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700"
        >
          + Add Transaction
        </button>

      </div>

    </header>
  );
}

export default Header;