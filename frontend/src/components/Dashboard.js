// src/components/Dashboard.js - UPDATED VERSION
import React, { useState, useMemo } from "react";
import Logo from "../assets/logo-white.svg";
import Icon from "../assets/Icon-white.svg";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MapPin,
  TrendingUp,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { supabase } from "../config/supabase";
import { useEnrollmentData } from "../hooks/useEnrollmentData";
import { ErrorBoundary } from "../components/shared";
import { MENU_ITEMS } from "../config/constants";

// Import page components
import Overview from "../pages/Overview";
import Enrollment from "../pages/Enrollment";
import Graduation from "../pages/Graduation";
import Faculty from "../pages/Faculty";
import Demographics from "../pages/Demographics";
import Forecasting from "../pages/Forecasting";

const PSUForeSight = () => {
  const { data, isLoading, error } = useEnrollmentData();
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error.message);
      alert('Failed to logout. Please try again.');
    }
  };

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return { years: ["all"], colleges: ["All"] };
    }
    return {
      years: ["all", ...new Set(data.map((d) => d.Year))],
      colleges: ["All", ...new Set(data.map((d) => d.College))]
    };
  }, [data]);

  // Apply filters
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter((item) => {
      // Year filter
      if (selectedYear !== "all" && item.Year !== selectedYear) return false;
      
      // College filter
      if (selectedCollege !== "All" && item.College !== selectedCollege) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.Program?.toLowerCase().includes(query) ||
          item.College?.toLowerCase().includes(query) ||
          item.Year?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [data, selectedYear, selectedCollege, searchQuery]);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
    { id: "enrollment", icon: Users, label: "Enrollment Data" },
    { id: "graduation", icon: GraduationCap, label: "Graduation Data" },
    { id: "faculty", icon: Users, label: "Faculty Data" },
    { id: "demographics", icon: MapPin, label: "Demographics" },
    { id: "forecasting", icon: TrendingUp, label: "Forecasting" }
  ];

  // Render active page
  const renderActivePage = () => {
    const pageProps = {
      data: filteredData,
      allData: data,
      isLoading,
      error,
      selectedYear,
      selectedCollege
    };

    switch (activeTab) {
      case "dashboard":
        return <Overview {...pageProps} />;
      case "enrollment":
        return <Enrollment {...pageProps} />;
      case "graduation":
        return <Graduation {...pageProps} />;
      case "faculty":
        return <Faculty {...pageProps} />;
      case "demographics":
        return <Demographics {...pageProps} />;
      case "forecasting":
        return <Forecasting {...pageProps} />;
      default:
        return <Overview {...pageProps} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className={`bg-[#003366] transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col relative`}>
          <div className="p-6 border-b border-blue-900 flex items-center justify-center">
            {sidebarCollapsed ? (
              <img src={Icon} alt="PSU Icon" className="w-12 h-12 transition-all duration-300" />
            ) : (
              <img src={Logo} alt="PSU Logo" className="w-30 h-30 transition-all duration-300" />
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

          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
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
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-blue-900">
            <button 
              onClick={handleLogout}
              title="Logout"
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-900 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500">Real-time analytics and insights</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students, programs, or data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filters */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions.years.map((year) => (
                    <option key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions.colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {renderActivePage()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PSUForeSight;