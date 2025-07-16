import React, { useState } from "react";
import login1 from "../../assets/login1.png";
import logo from "../../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import LoaderButton from "../ui/LoaderButton";
import { AuthAPI } from "@/api/auth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    setLoading(true);
    try {
      const response = await AuthAPI(email, password);
      const user = response.data.user;
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Logged in successfully!");
      const role = user.role;
      console.log(role, "role");
      if (role === "school") navigate("/school/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "student") navigate("/student/dashboard");
      else navigate("/");
    } catch (err) {
      toast.error("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col xl:flex-row">
      <div className="hidden xl:flex relative w-[40%] h-full bg-black items-center">
        <img
          src={login1}
          alt="Welcome"
          className="absolute h-[80%] object-cover left-[100px] 2xl:left-[150px] z-10"
        />

        <div className="absolute bottom-20 left-[120px] pb-10 text-white z-20 max-w-xs">
          <h2 className="text-2xl font-bold mb-2">
            Welcome to <span className="text-green-500">LevelMinds</span>
          </h2>
          <p className="text-sm leading-relaxed">
            We're thrilled to have you! <br />
            LevelMinds is your dedicated platform to help you thrive in your
            teaching career and discover exciting new job opportunities. Get
            ready to unlock your potential and take your career to the next
            level!
          </p>
        </div>
      </div>

      <div className="w-full xl:w-[60%] h-full flex items-center justify-center p-10 xl:pl-[100px]">
        <div className="w-full max-w-md">
          {/* Logo and Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="LevelMinds Logo" className="w-6 h-6" />
              <span className="text-xl font-semibold">LevelMinds</span>
            </div>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-gray-500 text-sm">
              Sign in to enjoy the features of LevelMinds
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <div className="relative w-full mb-6">
              <input
                type="email"
                id="email"
                placeholder=" "
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="peer w-full border rounded-md py-4 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2 bg-white px-1 text-sm text-green-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-600"
              >
                Email
              </label>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="peer w-full border rounded-md py-4 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label
                htmlFor="password"
                className="absolute left-3 -top-2 bg-white px-1 text-sm text-green-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-600"
              >
                Password
              </label>
              {/* Eye Icon */}
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 min-h-[20px] mt-1">
                  {errors.password?.message ?? ""}
                </p>
              )}
            </div>

            <LoaderButton
              loading={loading}
              onSubmit={onSubmit}
              variant="dark"
              size="md"
              className="w-full"
            >
              Sign In
            </LoaderButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
