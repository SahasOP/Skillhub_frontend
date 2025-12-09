import React from "react";
const TopicProgressBar = ({ solved, total }) => {
  const progressPercentage = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-in-out ${
          progressPercentage > 0
            ? "bg-gradient-to-r from-sky-400 to-blue-500"
            : "bg-gray-300"
        }`}
        style={{
          width: `${progressPercentage}%`,
          boxShadow:
            progressPercentage > 0 ? "0 2px 5px rgba(0,119,255,0.3)" : "none",
        }}
      />
    </div>
  );
};

export default TopicProgressBar;