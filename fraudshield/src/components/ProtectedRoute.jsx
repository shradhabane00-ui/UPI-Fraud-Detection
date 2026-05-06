import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const role = localStorage.getItem("role");
  const isAuth = localStorage.getItem("isAuth");

  if (!isAuth) return <Navigate to="/login" />;

  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}