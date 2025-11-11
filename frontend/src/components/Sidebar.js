// import React from "react";
// import * as Icons from "lucide-react";

// const Sidebar = ({ active, setActive }) => {
//   const menuItems = [
//     { name: "Overview", icon: <Icons.Home size={20} /> },
//     { name: "Enrollment", icon: <Icons.Users size={20} /> },
//     { name: "Graduation", icon: <Icons.GraduationCap size={20} /> },
//     { name: "Demographics", icon: <Icons.BarChart2 size={20} /> },
//     { name: "Forecasting", icon: <Icons.LineChart size={20} /> },
//   ];

//   return (
//     <div className="bg-blue-900 text-white h-screen w-64 flex flex-col justify-between">
//       {/* Header */}
//       <div>
//         <div className="text-2xl font-bold text-center py-4 border-b border-blue-700">
//           Dashboard
//         </div>

//         {/* Menu List */}
//         <ul className="mt-4">
//           {menuItems.map((item) => (
//             <li
//               key={item.name}
//               onClick={() => setActive(item.name)}
//               className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-blue-800 transition ${
//                 active === item.name ? "bg-blue-800" : ""
//               }`}
//             >
//               {item.icon}
//               <span>{item.name}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Sign Out Button */}
//       <div
//         onClick={() => setActive("Signout")}
//         className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-blue-800 border-t border-blue-700"
//       >
//         <Icons.LogOut size={20} />
//         <span>Sign Out</span>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  MapPin,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Logo from "../assets/logo-white.svg";
import Icon from "../assets/Icon-white.svg";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  handleLogout
}) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
    { id: "enrollment", icon: Users, label: "Enrollment Data" },
    { id: "graduation", icon: GraduationCap, label: "Graduation Data" },
    { id: "faculty", icon: Users, label: "Faculty Data" },
    { id: "demographics", icon: MapPin, label: "Demographics" },
    { id: "forecasting", icon: TrendingUp, label: "Forecasting" }
  ];

  return (
    <aside
      className={`bg-[#003366] transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      } flex flex-col relative h-screen`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-blue-900 flex items-center justify-center">
        {sidebarCollapsed ? (
          <img
            src={Icon}
            alt="PSU Icon"
            className="w-12 h-12 transition-all duration-300"
          />
        ) : (
          <img
            src={Logo}
            alt="PSU Logo"
            className="w-30 h-30 transition-all duration-300"
          />
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border-2 border-[#003366] rounded-full p-1 hover:bg-gray-100 transition z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-[#003366]" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[#003366]" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                activeTab === item.id
                  ? "bg-yellow-400 text-gray-900"
                  : "text-white hover:bg-blue-900"
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-900">
        <button
          onClick={() => setActiveTab("logout") && handleLogout()}
          title="Logout"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            activeTab === "logout"
              ? "bg-yellow-400 text-gray-900"
              : "text-white hover:bg-blue-900"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
