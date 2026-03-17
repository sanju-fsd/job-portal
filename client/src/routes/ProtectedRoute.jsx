import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, getDefaultRouteForRole } from "../context/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
