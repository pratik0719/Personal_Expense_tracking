import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

/**
 * AppLayout creates the shared application structure.
 *
 * It keeps the sidebar navigation visible
 * while different pages are displayed inside Outlet.
 *
 * Desktop:
 * Sidebar + Page Content
 *
 * Mobile:
 * Page Content + Bottom Navigation
 */
function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      {/* Desktop Sidebar and Mobile Navigation */}
      <Sidebar />

      {/* Current Route Content */}
      <main className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>

    </div>
  );
}

export default AppLayout;