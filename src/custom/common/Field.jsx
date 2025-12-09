import React from "react";

const Field = ({ label, icon, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon && React.cloneElement(icon, { className: "h-4 w-4 text-blue-500" })}
      {label}
    </label>
    {children}
  </div>
);

export default Field;