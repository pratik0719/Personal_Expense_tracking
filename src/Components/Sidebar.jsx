import { NavLink } from "react-router-dom";

/**
 * Sidebar displays the application's main navigation.
 *
 * Desktop:
 * Shows a fixed left sidebar.
 *
 * Mobile:
 * Shows a fixed navigation bar at the bottom.
 */
function Sidebar() {
  /**
   * Navigation items used by both
   * desktop and mobile navigation.
   */
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "⌂",
    },
    {
      name: "Income",
      path: "/income",
      icon: "↗",
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: "↘",
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: "◔",
    },
    {
      name: "Goals",
      path: "/goals",
      icon: "◎",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  /**
   * Returns styling for desktop navigation links.
   *
   * The active page receives a different
   * background and text color.
   */
  const getDesktopLinkClass = ({
    isActive,
  }) => {
    return `
      flex items-center gap-3 rounded-xl px-4 py-3
      text-sm font-medium transition duration-200
      ${
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }
    `;
  };

  /**
   * Returns styling for mobile navigation links.
   */
  const getMobileLinkClass = ({
    isActive,
  }) => {
    return `
      flex flex-col items-center justify-center gap-1
      text-[10px] font-medium transition
      ${
        isActive
          ? "text-indigo-600"
          : "text-slate-500"
      }
    `;
  };

  return (
    <>
      {/* =================================
          DESKTOP SIDEBAR
      ================================= */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-slate-950 p-6 lg:flex">

        {/* Application Logo */}
        <div className="mb-10 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 font-bold text-white shadow-lg shadow-indigo-950">
            EF
          </div>

          <div>
            <h1 className="font-bold text-white">
              ExpenseFlow
            </h1>

            <p className="text-xs text-slate-500">
              Personal Finance
            </p>
          </div>

        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={
                getDesktopLinkClass
              }
            >
              <span className="w-6 text-center text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </NavLink>
          ))}

        </nav>

        {/* Sidebar Bottom Information */}
        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">

          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            $
          </div>

          <h3 className="text-sm font-semibold text-white">
            Control your spending
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Create budgets and track how much you spend every month.
          </p>

          <NavLink
            to="/budgets"
            className="mt-4 block rounded-xl bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Review Budget
          </NavLink>

        </div>

      </aside>


      {/* =================================
          MOBILE BOTTOM NAVIGATION
      ================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-5px_20px_rgba(15,23,42,0.05)] backdrop-blur-md lg:hidden">

        {navigationItems
          .slice(0, 5)
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={
                getMobileLinkClass
              }
            >
              <span className="text-lg leading-none">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </NavLink>
          ))}

      </nav>
    </>
  );
}

export default Sidebar;