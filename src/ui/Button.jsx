// custom/ui/button.jsx
import { forwardRef } from "react";

const Button = forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 ${className}`}
    {...props}
  >
    {children}
  </button>
));

Button.displayName = "Button";

export default Button;
