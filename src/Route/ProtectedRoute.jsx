import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-slate-600">Checking session…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
