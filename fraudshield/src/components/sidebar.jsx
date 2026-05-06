import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  AlertTriangle,
  Brain,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "Viewer";

  /* ================= ROLE ACCESS ================= */
  const canAccess = {
    dashboard: true,
    transactions: role === "Admin" || role === "Analyst",
    alerts: role === "Admin" || role === "Analyst",
    ml: role === "Admin" || role === "Analyst",
    analytics: true,
    settings: role === "Admin"
  };

  const item = (path) =>
    `relative flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group ${
      location.pathname === path
        ? "text-white bg-[#131720] shadow-inner"
        : "text-gray-400 hover:text-white hover:bg-[#131720]"
    }`;

  const indicator = (path) =>
    `absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300 ${
      location.pathname === path
        ? "bg-blue-500 opacity-100"
        : "opacity-0 group-hover:opacity-50 bg-gray-500"
    }`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-[#0b0f17] border-r border-[#1e2535] p-6 flex flex-col">

      {/* LOGO */}
      <div className="mb-10 flex items-center gap-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-2 py-1 rounded text-xs font-bold shadow">
          UPI
        </div>
        <h1 className="text-lg font-semibold tracking-tight">
          FraudShield
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2 text-sm flex-1">

        {canAccess.dashboard && (
          <Link to="/dashboard" className={item("/dashboard")}>
            <span className={indicator("/dashboard")} />
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        )}

        {canAccess.transactions && (
          <Link to="/transactions" className={item("/transactions")}>
            <span className={indicator("/transactions")} />
            <CreditCard size={16} />
            Transactions
          </Link>
        )}

        {canAccess.alerts && (
          <Link to="/alerts" className={item("/alerts")}>
            <span className={indicator("/alerts")} />
            <AlertTriangle size={16} />
            Alerts
          </Link>
        )}

        {canAccess.ml && (
          <Link to="/ml" className={item("/ml")}>
            <span className={indicator("/ml")} />
            <Brain size={16} />
            ML Insights
          </Link>
        )}

        {canAccess.analytics && (
          <Link to="/analytics" className={item("/analytics")}>
            <span className={indicator("/analytics")} />
            <BarChart3 size={16} />
            Analytics
          </Link>
        )}

        {canAccess.settings && (
          <Link to="/settings" className={item("/settings")}>
            <span className={indicator("/settings")} />
            <Settings size={16} />
            Settings
          </Link>
        )}

      </nav>

      {/* FOOTER */}
      <div className="pt-6 border-t border-[#1e2535]">

        <div className="flex items-center justify-between">

          {/* USER */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold shadow">
              {role[0]}
            </div>
            <div>
              <p className="text-gray-300 text-sm">{role}</p>
              <p className="text-gray-500 text-xs">Active</p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-[#131720] text-gray-400 hover:text-red-400 transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}