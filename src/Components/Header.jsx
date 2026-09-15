function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Expense Tracker
        </h1>

        <p className="text-slate-300 mt-2 text-sm sm:text-base">
          Manage your income and expenses with ease
        </p>
      </div>
    </header>
  );
}

export default Header;