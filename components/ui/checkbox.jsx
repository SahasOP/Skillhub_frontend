import * as React from "react";
import { Check } from "lucide-react";
import {cn} from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <label className="flex items-center">
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "peer hidden",
        className // Allow custom styles via props
      )}
      {...props}
    />
    <div
      className={cn(
        "h-4 w-4 flex items-center justify-center rounded-sm border border-primary bg-white ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 peer-checked:bg-primary peer-checked:text-primary-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
    >
      <Check className="hidden h-3 w-3 text-current peer-checked:block" />
    </div>
  </label>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
