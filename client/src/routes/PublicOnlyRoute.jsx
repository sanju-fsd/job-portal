import { Navigate, Outlet } from "react-router-dom";
import { useAuth, getDefaultRouteForRole } from "../context/AuthContext";

const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Checking session...</div>;
  }

  if (user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
