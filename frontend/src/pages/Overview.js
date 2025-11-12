import React from "react";
import { Search, Bell } from "lucide-react";

const Overview = ({ sidebarCollapsed }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="text-gray-700 text-center py-40">
          <p className="text-xl">This is the Overview placeholder page.</p>
        </div>
      </main>
    </div>
  );
};

export default Overview;
