const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    isAuthenticated: !!token,
    token,
    user,
    role: user?.role,
  };
};
export default useAuth;
