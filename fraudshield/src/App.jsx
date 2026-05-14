import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

/* LAZY LOAD */
const Dashboard = lazy(() => import("./pages/dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Alerts = lazy(() => import("./pages/Alerts"));
const MLInsights = lazy(() => import("./pages/MLInsights"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));

function AnimatedRoutes() {
  const location = useLocation();

  const isAuth = localStorage.getItem("isAuth");

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <Routes location={location} key={location.pathname}>

          {/* ROOT */}
          <Route
            path="/"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* TRANSACTIONS */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute roles={["Admin", "Analyst"]}>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* ALERTS */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute roles={["Admin", "Analyst"]}>
                <Alerts />
              </ProtectedRoute>
            }
          />

          {/* ML */}
          <Route
            path="/ml"
            element={
              <ProtectedRoute roles={["Admin", "Analyst"]}>
                <MLInsights />
              </ProtectedRoute>
            }
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={["Admin", "Analyst", "Viewer"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* SETTINGS (ADMIN ONLY) */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}