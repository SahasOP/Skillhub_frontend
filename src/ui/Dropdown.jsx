import React from 'react';

export const DropdownMenu = ({ children }) => (
  <div className="relative inline-block text-left">
    {children}
  </div>
);

export const DropdownMenuTrigger = ({ children, asChild }) => (
  <div>{children}</div>
);

export const DropdownMenuContent = ({ children, align }) => (
  <div className={`absolute z-10 ${align}`}>
    <div className="bg-white shadow-md rounded-md">{children}</div>
  </div>
);

export const DropdownMenuLabel = ({ children }) => (
  <div className="px-4 py-2 text-gray-700">{children}</div>
);

export const DropdownMenuItem = ({ children }) => (
  <div className="px-4 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer">{children}</div>
);
