import { getUserProfile } from "@/api/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const UserLoaderRoute = () => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        if (userFromStorage?.isOnboardingComplete) {
          setLoading(false);
          return;
        }
        const res = await getUserProfile();
        console.log(res?.data?.profile, "resSSS");
        if (res?.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
          const user = res.user;
          if (user.role === "school" && !user.isOnboardingComplete) {
            setRedirectPath("/school/onboarding");
          } else if (user.role === "school") {
            setRedirectPath("/school/dashboard");
          }
          // Add similar logic for student if needed
        } else {
          setRedirectPath("/");
        }
      } catch (err) {
        console.error("User fetch failed", err);
        setRedirectPath("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return <Outlet />;
};

export default UserLoaderRoute;
