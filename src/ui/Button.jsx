// custom/ui/button.jsx
import { forwardRef } from "react";

const Button = forwardRef(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const base =
      "flex justify-center items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
      outline:
        "border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-[0.98]",
      ghost:
        "text-gray-700 hover:bg-gray-100 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
