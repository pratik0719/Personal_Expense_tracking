import { NavLink } from "react-router-dom";

import financeTrackerLogo from "../assets/app-logo.png";
import { useBrand } from "../context/BrandContext";
import { useTransactionSheet } from "../context/TransactionSheetContext";
import {
  ActivityIcon,
  BudgetIcon,
  HomeIcon,
  LoanIcon,
  PlusIcon,
  ReportIcon,
  SettingsIcon,
} from "./Icons";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Activity", path: "/activity", icon: ActivityIcon },
  { label: "Report", path: "/report", icon: ReportIcon },
  { label: "Budgets", path: "/budgets", icon: BudgetIcon },
  { label: "Loans", path: "/loans", icon: LoanIcon },
];

/**
 * Navigation.
 *
 * Mobile: a floating pill tab bar (icons only, active tab widens into a
 * glowing pill) with a separate round "+" button for quick entry.
 * Desktop (lg+): a dark sidebar with labels, Settings and an Add button.
 */
function Sidebar() {
  const { settings } = useBrand();
  const { openAdd } = useTransactionSheet();
  const logo = settings.logo || financeTrackerLogo;

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-[#0a0a18]/80 p-6 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <img src={logo} alt="" className="h-11 w-11 shrink-0 rounded-2xl border border-line bg-black object-cover" />
          <div className="min-w-0">
            <p className="truncate font-bold text-white">{settings.appName}</p>
            <p className="truncate text-xs text-muted">{settings.tagline}</p>
          </div>
        </div>

        <button type="button" onClick={() => openAdd()} className="btn-primary mb-6 flex items-center justify-center gap-2 text-sm">
          <PlusIcon className="h-4 w-4" /> Add transaction
        </button>

        <nav aria-label="Main" className="space-y-1">
          {[...NAV_ITEMS, { label: "Settings", path: "/settings", icon: SettingsIcon }].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? "pill-active" : "text-muted hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto text-xs text-faint">Your data is saved privately on this device.</p>
      </aside>

      {/* ===== Mobile floating tab bar ===== */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        {/* Fade so list content doesn't clash with the floating bar */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink via-ink/80 to-transparent" aria-hidden="true" />

        <div className="relative flex items-center justify-center gap-3 px-4">
          <nav
            aria-label="Main"
            className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-[#15152f]/95 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                aria-label={item.label}
                title={item.label}
                className={({ isActive }) =>
                  `flex h-11 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive ? "pill-active w-16 max-[359px]:w-12" : "w-11 text-muted active:bg-white/10 max-[359px]:w-9"
                  }`
                }
              >
                <item.icon className="h-[22px] w-[22px]" />
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => openAdd()}
            aria-label="Add transaction"
            className="pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand max-[359px]:h-12 max-[359px]:w-12 text-white shadow-[0_8px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/20 transition active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
