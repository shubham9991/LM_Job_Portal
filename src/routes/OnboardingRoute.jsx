import { Navigate, Outlet, useLocation } from "react-router-dom";
const OnboardingRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  if (!user) return <Navigate to="/" replace />;

  const onboardingPaths = {
    school: "/school/onboarding",
    student: "/student/onboarding",
  };
  const isOnboardingPage = location.pathname === onboardingPaths[user.role];
  if (!user.isOnboardingComplete) {
    return isOnboardingPage ? (
      <Outlet />
    ) : (
      <Navigate to={onboardingPaths[user.role]} replace />
    );
  }
  if (user.isOnboardingComplete && isOnboardingPage) {
    const dashboards = {
      school: "/school/dashboard",
      student: "/student/dashboard",
    };
    return <Navigate to={dashboards[user.role]} replace />;
  }
  return <Outlet />;
};

export default OnboardingRoute;
