import React from "react";

const Header = ({ title }) => {
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4 rounded-lg mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Placeholder for future controls like notifications, user info, etc. */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
          U
        </div>
      </div>
    </div>
  );
};

export default Header;
