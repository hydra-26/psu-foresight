// import React, { useEffect, useState, useMemo } from "react";
// import Logo from "../assets/logo-white.svg";
// import Icon from "../assets/Icon-white.svg";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart
// } from "recharts";
// import {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   BarChart3,
//   MapPin,
//   TrendingUp,
//   LogOut,
//   ChevronDown,
//   Search,
//   Bell,
//   Calendar,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import { supabase } from "../config/supabase";

// const PSUForeSight = () => {
//   const [data, setData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState("all");
//   const [selectedCollege, setSelectedCollege] = useState("All");
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const COLORS = ["#003366", "#fbbf24", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       // Redirect to login page or home page after logout
//       window.location.href = '/login'; // Adjust this path to your login page
//     } catch (error) {
//       console.error('Error logging out:', error.message);
//       alert('Failed to logout. Please try again.');
//     }
//   };

//   // Fetch data from Supabase
//   const fetchData = async () => {
//     const { data: fetchedData, error } = await supabase
//       .from("enrolled")
//       .select("*")
//       .order("Year");

//     if (error) {
//       console.error("Error fetching data:", error);
//     } else {
//       setData(fetchedData || []);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     const channel = supabase
//       .channel("realtime-enrollments")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "enrolled" },
//         () => fetchData()
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   // Get unique filter options
//   const filterOptions = useMemo(() => {
//     return {
//       years: ["all", ...new Set(data.map((d) => d.Year))],
//       colleges: ["All", ...new Set(data.map((d) => d.College))]
//     };
//   }, [data]);

//   // Apply filters
//   const filteredData = useMemo(() => {
//     return data.filter((item) => {
//       if (selectedYear !== "all" && item.Year !== selectedYear) return false;
//       if (selectedCollege !== "All" && item.College !== selectedCollege) return false;
//       return true;
//     });
//   }, [data, selectedYear, selectedCollege]);

//   // Calculate statistics
//   const stats = useMemo(() => {
//     const totalStudents = filteredData.reduce((sum, row) => sum + (row.Total || 0), 0);
//     const totalMale = filteredData.reduce((sum, row) => sum + (row.Male || 0), 0);
//     const totalFemale = filteredData.reduce((sum, row) => sum + (row.Female || 0), 0);
//     const uniqueColleges = new Set(filteredData.map((d) => d.College)).size;
//     const uniquePrograms = new Set(filteredData.map((d) => d.Program)).size;

//     return { totalStudents, totalMale, totalFemale, uniqueColleges, uniquePrograms };
//   }, [filteredData]);

//   // Enrollment trends by year
//   const enrollmentTrends = useMemo(() => {
//     const grouped = {};
//     filteredData.forEach((item) => {
//       const key = item.Year;
//       if (!grouped[key]) {
//         grouped[key] = { year: key, total: 0, male: 0, female: 0 };
//       }
//       grouped[key].total += item.Total || 0;
//       grouped[key].male += item.Male || 0;
//       grouped[key].female += item.Female || 0;
//     });
//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [filteredData]);

//   // Gender distribution
//   const genderData = useMemo(() => {
//     return [
//       {
//         name: "Male",
//         value: stats.totalMale,
//         percentage: ((stats.totalMale / stats.totalStudents) * 100).toFixed(1)
//       },
//       {
//         name: "Female",
//         value: stats.totalFemale,
//         percentage: ((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)
//       }
//     ];
//   }, [stats]);

//   // College enrollment
//   const collegeData = useMemo(() => {
//     const grouped = {};
//     filteredData.forEach((item) => {
//       if (!grouped[item.College]) {
//         grouped[item.College] = { name: item.College, students: 0 };
//       }
//       grouped[item.College].students += item.Total || 0;
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [filteredData]);

//   // Program enrollment
//   const programData = useMemo(() => {
//     const grouped = {};
//     filteredData.forEach((item) => {
//       const key = `${item.College}-${item.Program}`;
//       if (!grouped[key]) {
//         grouped[key] = {
//           college: item.College,
//           program: item.Program,
//           enrolled: 0
//         };
//       }
//       grouped[key].enrolled += item.Total || 0;
//     });
//     return Object.values(grouped).sort((a, b) => b.enrolled - a.enrolled);
//   }, [filteredData]);

//   const menuItems = [
//     { id: "dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
//     { id: "enrollment", icon: Users, label: "Enrollment Data" },
//     { id: "graduation", icon: GraduationCap, label: "Graduation Data" },
//     { id: "faculty", icon: Users, label: "Faculty Data" },
//     { id: "demographics", icon: MapPin, label: "Demographics" },
//     { id: "forecasting", icon: TrendingUp, label: "Forecasting" }
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className={`bg-[#003366] transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col relative`}>
//         <div className="p-6 border-b border-blue-900 flex items-center justify-center">
//           {sidebarCollapsed ? (
//             <img src={Icon} alt="PSU Icon" className="w-12 h-12 transition-all duration-300" />
//           ) : (
//             <img src={Logo} alt="PSU Logo" className="w-30 h-30 transition-all duration-300" />
//           )}
//         </div>

//         {/* Collapse Button */}
//         <button
//           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border-2 border-[#003366] rounded-full p-1 hover:bg-gray-100 transition z-10"
//         >
//           {sidebarCollapsed ? (
//             <ChevronRight className="w-4 h-4 text-[#003366]" />
//           ) : (
//             <ChevronLeft className="w-4 h-4 text-[#003366]" />
//           )}
//         </button>

//         <nav className="p-4 space-y-2 flex-1">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 title={item.label}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
//                   activeTab === item.id
//                     ? "bg-yellow-400 text-gray-900"
//                     : "text-white hover:bg-blue-900"
//                 }`}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-blue-900">
//           <button 
//             onClick={handleLogout}
//             title="Logout"
//             className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-900 rounded-lg transition"
//           >
//             <LogOut className="w-5 h-5 flex-shrink-0" />
//             {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="bg-white border-b border-gray-200 px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
//               <p className="text-sm text-gray-500">Real-time analytics and insights</p>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Search */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search students, programs, or data..."
//                   className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Notifications */}
//               <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
//                 <Bell className="w-5 h-5" />
//               </button>

//               {/* Profile */}
//               <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
//                 <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-semibold">
//                   A
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
//           {activeTab === "dashboard" && (
//             <div className="space-y-6">
//               {/* Year Filter Badge */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
//                   <span className="text-sm text-gray-600">Academic Year</span>
//                   <select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer"
//                   >
//                     {filterOptions.years.map((year) => (
//                       <option key={year} value={year}>
//                         {year === "all" ? "All Years" : year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm opacity-90 mb-1">Total Students</p>
//                       <p className="text-3xl font-bold">
//                         {stats.totalStudents.toLocaleString()}
//                       </p>
//                       <p className="text-xs opacity-75 mt-2">↑ 4.2% vs last year</p>
//                     </div>
//                     <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                       <Users className="w-8 h-8" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-md p-6 text-gray-900">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm opacity-90 mb-1">Graduation Rate</p>
//                       <p className="text-3xl font-bold">92%</p>
//                       <p className="text-xs opacity-75 mt-2">vs last year</p>
//                     </div>
//                     <div className="bg-white bg-opacity-30 p-3 rounded-lg">
//                       <GraduationCap className="w-8 h-8" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm opacity-90 mb-1">Total Colleges</p>
//                       <p className="text-3xl font-bold">{stats.uniqueColleges}</p>
//                       <p className="text-xs opacity-75 mt-2">Academic units</p>
//                     </div>
//                     <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                       <BarChart3 className="w-8 h-8" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm opacity-90 mb-1">Enrollment Growth</p>
//                       <p className="text-3xl font-bold">+4.2%</p>
//                       <p className="text-xs opacity-75 mt-2">vs last year</p>
//                     </div>
//                     <div className="bg-white bg-opacity-20 p-3 rounded-lg">
//                       <TrendingUp className="w-8 h-8" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Charts Row 1 */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">Enrollment Trends</h3>
//                       <p className="text-sm text-gray-500">Student enrollment over the past 6 years</p>
//                     </div>
//                   </div>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <BarChart data={enrollmentTrends}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                       <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'white', 
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           fontSize: '12px'
//                         }}
//                       />
//                       <Bar dataKey="total" fill="#003366" radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Graduation Rate Trend</h3>
//                     <p className="text-sm text-gray-500">Percentage of students graduating on time</p>
//                   </div>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <LineChart data={enrollmentTrends}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'white', 
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           fontSize: '12px'
//                         }}
//                       />
//                       <Line 
//                         type="monotone" 
//                         dataKey="total" 
//                         stroke="#fbbf24" 
//                         strokeWidth={3}
//                         dot={{ fill: '#fbbf24', r: 5 }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Charts Row 2 */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Students by College</h3>
//                     <p className="text-sm text-gray-500">Distribution of students across colleges</p>
//                   </div>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <PieChart>
//                       <Pie
//                         data={collegeData.slice(0, 5)}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={100}
//                         fill="#8884d8"
//                         dataKey="students"
//                         label={({ name, percent }) => `${name.substring(0, 3)}: ${(percent * 100).toFixed(0)}%`}
//                         labelLine={false}
//                       >
//                         {collegeData.slice(0, 5).map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Top Programs</h3>
//                     <p className="text-sm text-gray-500">Enrollment vs graduation by program</p>
//                   </div>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <BarChart data={programData.slice(0, 5)}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                       <XAxis 
//                         dataKey="program" 
//                         angle={-45} 
//                         textAnchor="end" 
//                         height={80} 
//                         stroke="#94a3b8"
//                         style={{ fontSize: '10px' }}
//                       />
//                       <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'white', 
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           fontSize: '12px'
//                         }}
//                       />
//                       <Bar dataKey="enrolled" fill="#003366" radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Recent Activity Table */}
//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Enrollments</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Semester</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">College</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Program</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Level</th>
//                         <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Male</th>
//                         <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Female</th>
//                         <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData.slice(0, 10).map((row, idx) => (
//                         <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
//                           <td className="py-3 px-4 text-sm text-gray-900">{row.Year}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Sem}</td>
//                           <td className="py-3 px-4 text-sm text-gray-900">{row.College}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Program}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Level}</td>
//                           <td className="py-3 px-4 text-sm text-right text-gray-900">{row.Male}</td>
//                           <td className="py-3 px-4 text-sm text-right text-gray-900">{row.Female}</td>
//                           <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
//                             {row.Total}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "enrollment" && (
//             <div className="space-y-6">
//               {/* Header */}
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//                   <p className="text-sm text-gray-500">Comprehensive enrollment analysis and student records</p>
//                 </div>
//                 <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition flex items-center gap-2">
//                   <span>Export Data</span>
//                 </button>
//               </div>

//               {/* Stats Overview */}
//               <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="bg-blue-100 p-2 rounded-lg">
//                       <Users className="w-5 h-5 text-blue-600" />
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">Total Students</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stats.totalStudents.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-green-600 mt-1">↑ 4.2% vs last year</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="bg-yellow-100 p-2 rounded-lg">
//                       <Users className="w-5 h-5 text-yellow-600" />
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">New</p>
//                   <p className="text-2xl font-bold text-gray-900">8,234</p>
//                   <p className="text-xs text-green-600 mt-1">↑ 5.3% vs last year</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="bg-green-100 p-2 rounded-lg">
//                       <GraduationCap className="w-5 h-5 text-green-600" />
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">Continuing</p>
//                   <p className="text-2xl font-bold text-gray-900">25,678</p>
//                   <p className="text-xs text-green-600 mt-1">↑ 3.8% vs last year</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="bg-orange-100 p-2 rounded-lg">
//                       <Users className="w-5 h-5 text-orange-600" />
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">Transferee</p>
//                   <p className="text-2xl font-bold text-gray-900">2,865</p>
//                   <p className="text-xs text-red-600 mt-1">↓ 1.2% vs last year</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <p className="text-sm text-gray-600 mb-1">Male</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stats.totalMale.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-gray-600 mt-1">
//                     {((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stats.totalFemale.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-gray-600 mt-1">
//                     {((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%
//                   </p>
//                 </div>
//               </div>

//               {/* Charts Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Enrollment by College */}
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Enrollment by College</h3>
//                     <p className="text-sm text-gray-500">Distribution of students across colleges</p>
//                   </div>
//                   <ResponsiveContainer width="100%" height={280}>
//                     <BarChart data={collegeData.slice(0, 6)}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                       <XAxis 
//                         dataKey="name" 
//                         stroke="#94a3b8" 
//                         style={{ fontSize: '10px' }}
//                         angle={-45}
//                         textAnchor="end"
//                         height={80}
//                       />
//                       <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'white', 
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           fontSize: '12px'
//                         }}
//                       />
//                       <Bar dataKey="students" fill="#003366" radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Enrollment by Year Level */}
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Enrollment by Year Level</h3>
//                     <p className="text-sm text-gray-500">Student distribution across year levels</p>
//                   </div>
//                   <div className="space-y-4">
//                     {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map((level, idx) => {
//                       const percentage = [35, 28, 22, 12, 3][idx];
//                       return (
//                         <div key={level}>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm text-gray-700">{level}</span>
//                             <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-8">
//                             <div 
//                               className="bg-yellow-400 h-8 rounded-full transition-all duration-300"
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* College Statistics Table */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">College Statistics</h3>
//                   <div className="space-y-3">
//                     {collegeData.slice(0, 5).map((college, idx) => (
//                       <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{college.name}</p>
//                           <p className="text-xs text-gray-500">Students enrolled</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-lg font-bold text-gray-900">{college.students.toLocaleString()}</p>
//                           <p className="text-xs text-gray-500">
//                             {((college.students / stats.totalStudents) * 100).toFixed(1)}%
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-700">Male</span>
//                       <span className="text-sm font-semibold text-gray-900">{stats.totalMale.toLocaleString()}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-8">
//                       <div 
//                         className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-medium"
//                         style={{ width: `${(stats.totalMale / stats.totalStudents) * 100}%` }}
//                       >
//                         {((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between mt-6">
//                       <span className="text-sm text-gray-700">Female</span>
//                       <span className="text-sm font-semibold text-gray-900">{stats.totalFemale.toLocaleString()}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-8">
//                       <div 
//                         className="bg-pink-500 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-medium"
//                         style={{ width: `${(stats.totalFemale / stats.totalStudents) * 100}%` }}
//                       >
//                         {((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Semester Enrollment Trends */}
//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Semester Enrollment Trends</h3>
//                   <p className="text-sm text-gray-500">Student enrollment trends over recent semesters</p>
//                 </div>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={enrollmentTrends}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                     <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'white', 
//                         border: '1px solid #e5e7eb',
//                         borderRadius: '8px',
//                         fontSize: '12px'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="total" 
//                       stroke="#003366" 
//                       strokeWidth={3}
//                       dot={{ fill: '#003366', r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Recent Enrollments Table */}
//               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
//                   <div className="text-sm text-gray-500">
//                     Latest student enrollment records
//                   </div>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-200 bg-gray-50">
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student ID</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Program</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">College</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Start Year</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year Level</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData.slice(0, 10).map((row, idx) => (
//                         <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
//                           <td className="py-3 px-4 text-sm text-gray-900">2024-{String(idx + 1).padStart(4, '0')}</td>
//                           <td className="py-3 px-4 text-sm text-gray-900">Student {idx + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Program}</td>
//                           <td className="py-3 px-4 text-sm text-gray-900">{row.College}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Year}</td>
//                           <td className="py-3 px-4 text-sm text-gray-600">{row.Level}</td>
//                           <td className="py-3 px-4">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               Enrolled
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PSUForeSight;


import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Overview from "../pages/Overview";
import Enrollment from "../pages/Enrollment";
import Graduation from "../pages/Graduation";
import Demographics from "../pages/Demographics";
import Forecasting from "../pages/Forecasting";
import Header from "./Header";

const Dashboard = () => {
  const [active, setActive] = useState("Overview");

  const renderContent = () => {
    switch (active) {
      case "Overview":
        return <Overview />;
      case "Enrollment":
        return <Enrollment />;
      case "Graduation":
        return <Graduation />;
      case "Demographics":
        return <Demographics />;
      case "Forecasting":
        return <Forecasting />;
      default:
        return <div className="p-6 text-gray-700 text-xl">Signed out successfully.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header title={active} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
