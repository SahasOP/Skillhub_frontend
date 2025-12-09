import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-70">
      <div className="relative bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
