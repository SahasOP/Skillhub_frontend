// Modal.jsx - reusable modal wrapper used by QuestionList for add/edit forms

import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-auto max-h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
