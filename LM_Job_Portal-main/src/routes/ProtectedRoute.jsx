import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
