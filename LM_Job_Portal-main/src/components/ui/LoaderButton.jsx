// components/LoaderButton.jsx
import React from "react";
import { cn } from "@/lib/utils"; // or just use className merging directly

const LoaderButton = ({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  showChildrenWhileLoading = true,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    dark: "bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className={cn(
            "animate-spin h-4 w-4 mr-2",
            !showChildrenWhileLoading && "mx-auto"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {(!loading || showChildrenWhileLoading) && children}
    </button>
  );
};

export default LoaderButton;
