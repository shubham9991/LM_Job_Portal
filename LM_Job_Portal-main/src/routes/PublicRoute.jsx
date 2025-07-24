import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "school") return <Navigate to="/school/dashboard" replace />;
    if (role === "student") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
