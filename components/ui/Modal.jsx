import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

const Modal = ({ children, onClose }) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on escape key press
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div 
      className="absolute inset-0 w-[80vw] h-[50vh] z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex justify-between items-start">
          <div className="flex-1">
            {children}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full -mr-2 -mt-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;