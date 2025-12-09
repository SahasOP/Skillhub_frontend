import React from "react";
import { cn } from "@/lib/utils";
// Badge.jsx
const badgeVariants = {
  default: "bg-primary hover:bg-primary/80",
  secondary: "bg-secondary hover:bg-secondary/80",
  destructive: "bg-destructive hover:bg-destructive/80",
  outline: "text-foreground",
};

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// // Usage example
// const ExampleUsage = () => {
//   return (
//     <div className="space-y-4">
//       {/* Alert Examples */}
//       <Alert>
//         <AlertTitle>Heads up!</AlertTitle>
//         <AlertDescription>
//           You can add components and dependencies to your app using the cli.
//         </AlertDescription>
//       </Alert>

//       {/* Badge Examples */}
//       <div className="space-x-2">
//         <Badge>Default</Badge>
//         <Badge variant="secondary">Secondary</Badge>
//         <Badge variant="destructive">Destructive</Badge>
//         <Badge variant="outline">Outline</Badge>
//       </div>
//     </div>
//   );
// };

export { Badge };
// export default ExampleUsage;