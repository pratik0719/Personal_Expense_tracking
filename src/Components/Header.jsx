import logo from "../assets/finance tracker .png";

function Header() {
  return (
    <header className=" mb-3 rounded-4xl bg-emerald-600 p-2 b-3  bg-gradient-to-r from-green-500 via-slate-900 to-red-500 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          {/* section for logo image  */}
          <img
               src={logo}
               alt="Finance Tracker Logo"
              className="h-15 w-15 rounded-4xl object-cover"
            />

        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Expense Tracker
          </h1>

          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Manage your income and expenses with ease
          </p>
        </div>

      </div>
    </header>
  );
}

export default Header;