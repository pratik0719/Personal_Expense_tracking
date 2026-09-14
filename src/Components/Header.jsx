function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Expense Tracker
        </h1>

        <p className="text-sm text-gray-500">
          Manage your income and expenses
        </p>
      </div>
    </header>
  );
}

export default Header;