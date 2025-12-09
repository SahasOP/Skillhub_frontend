import React from "react";
const InputField = ({ label, icon, ...props }) => (
  <div className="relative">
    <Input {...props} className="w-full border-gray-200 bg-white" />
    {icon && <span className="absolute right-3 top-1/2 transform -translate-y-1/2">{React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}</span>}
  </div>
);
export default InputField;