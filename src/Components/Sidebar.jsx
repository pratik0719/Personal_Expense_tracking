import { NavLink } from "react-router-dom";

/**
 * Application logo image.
 *
 * Imported from src/assets so Vite can
 * bundle it and provide a hashed URL.
 */
import financeTrackerLogo from "../assets/finance-tracker-logo.png";

/**
 * Sidebar displays the application's main navigation.
 *
 * Desktop:
 * Shows a fixed left sidebar with the brand logo.
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

        {/* Application Logo and Brand Name */}
        <div className="mb-10 flex items-center gap-3">

          {/* Brand logo image from src/assets */}
          <img
            src={financeTrackerLogo}
            alt="Expense Tracker logo"
            className="h-11 w-11 rounded-2xl bg-white object-contain p-1 shadow-lg shadow-indigo-950"
          />

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

      </aside>


      {/* =================================
          MOBILE BOTTOM NAVIGATION
      ================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-5px_20px_rgba(15,23,42,0.05)] backdrop-blur-md lg:hidden">

        {navigationItems.map((item) => (
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