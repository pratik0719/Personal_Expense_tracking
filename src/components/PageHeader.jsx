import { Link } from "react-router-dom";

import financeTrackerLogo from "../assets/app-logo.png";
import { useBrand } from "../context/BrandContext";
import { SettingsIcon } from "./Icons";

/**
 * PageHeader sits in the glow at the top of every page.
 *
 * Mobile: [logo]  Centered title  [action or settings]
 * Desktop: large left-aligned title with actions on the right
 * (the sidebar already shows the logo and settings).
 */
function PageHeader({ title, subtitle, action }) {
  const { settings } = useBrand();

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 pt-4 pb-1 sm:px-6 lg:flex lg:justify-between lg:px-8 lg:pt-8">
      <div className="flex justify-start lg:hidden">
        <Link to="/" aria-label="Home">
          <img
            src={settings.logo || financeTrackerLogo}
            alt=""
            className="h-10 w-10 rounded-full border border-line bg-black object-cover"
          />
        </Link>
      </div>

      <div className="min-w-0 text-center lg:text-left">
        <h1 className="truncate text-xl font-bold tracking-tight lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-xs text-muted lg:text-sm">{subtitle}</p>}
      </div>

      <div className="flex justify-end">
        {action ?? (
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-muted transition hover:text-white lg:hidden"
          >
            <SettingsIcon />
          </Link>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
