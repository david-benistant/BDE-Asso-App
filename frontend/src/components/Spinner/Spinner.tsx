import React from "react";

export const Spinner: React.FC<{ size?: number }> = ({ size = 3 }) => {
  return (
    <div className="flex h-full w-full justify-center items-center" >
        <div
          className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-500`}
          style={{ width: `${size}rem`, height: `${size}rem` }}
        ></div>
    </div>
  );
};
