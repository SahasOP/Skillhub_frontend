// custom/ui/input.jsx
import { forwardRef } from "react";

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`border border-gray-300 rounded py-2 px-3 w-full ${className}`}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;