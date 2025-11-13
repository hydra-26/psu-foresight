// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import { Users, GraduationCap, Download } from "lucide-react";
// import { 
//   StatsCard, 
//   ChartContainer, 
//   DataTable, 
//   LoadingSpinner, 
//   EmptyState,
//   ErrorAlert 
// } from "../components/shared";
// import { COLORS, CHART_CONFIG } from "../config/constants";
// import { enrollmentService } from "../services/enrollmentService";

// const Enrollment = ({ data, isLoading, error }) => {
//   // Calculate statistics based on latest year only
//   const stats = useMemo(() => {
//     if (!data || data.length === 0) return {
//       totalStudents: 0,
//       totalMale: 0,
//       totalFemale: 0,
//       newStudents: 0,
//       continuing: 0,
//       transferee: 0
//     };

//     // Find latest year
//     const latestYear = data.reduce((max, row) => row.Year > max ? row.Year : max, data[0].Year);

//     // Filter data for latest year
//     const latestData = data.filter(row => row.Year === latestYear);

//     const totalStudents = latestData.reduce((sum, row) => sum + (row.Total || 0), 0);
//     const totalMale = latestData.reduce((sum, row) => sum + (row.Male || 0), 0);
//     const totalFemale = latestData.reduce((sum, row) => sum + (row.Female || 0), 0);

//     const newStudents = Math.floor(totalStudents * 0.24);
//     const continuing = Math.floor(totalStudents * 0.68);
//     const transferee = Math.floor(totalStudents * 0.08);

//     return { 
//       totalStudents, 
//       totalMale, 
//       totalFemale,
//       newStudents,
//       continuing,
//       transferee
//     };
//   }, [data]);

//   // College enrollment data
//   const collegeData = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     const grouped = {};
//     data.forEach((item) => {
//       if (!grouped[item.College]) {
//         grouped[item.College] = { name: item.College, students: 0 };
//       }
//       grouped[item.College].students += item.Total || 0;
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [data]);

//   // Semester Enrollment Trends (1st & 2nd Sem separate lines)
//   const enrollmentTrendsBySem = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     const grouped = {};

//     data.forEach((item) => {
//       const year = item.Year;
//       const sem = item.Sem; // "1st" or "2nd"
//       if (sem && !sem.toLowerCase().includes("mid")) {
//         if (!grouped[year]) grouped[year] = { year };
//         grouped[year][sem] = (grouped[year][sem] || 0) + (item.Total || 0);
//       }
//     });

//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [data]);

//   // Midyear Enrollment Trends by Year
//   const midyearTrends = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     const grouped = {};

//     data.forEach((item) => {
//       if (item.Sem && item.Sem.toLowerCase() === "mid") {
//         const year = item.Year;
//         if (!grouped[year]) grouped[year] = { year, total: 0 };
//         grouped[year].total += item.Total || 0;
//       }
//     });

//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [data]);

//   // Year level distribution (mock)
// // Year level distribution (dynamic)
// const yearLevelData = useMemo(() => {
//   if (!data || data.length === 0) return [];

//   const grouped = {};
//   data.forEach((item) => {
//     const level = item.Level || "Unknown";
//     if (!grouped[level]) grouped[level] = 0;
//     grouped[level] += item.Total || 0;
//   });

//   const totalStudents = data.reduce((sum, row) => sum + (row.Total || 0), 0);

//   return Object.entries(grouped)
//     .map(([level, count]) => ({
//       level,
//       percentage: totalStudents ? ((count / totalStudents) * 100).toFixed(1) : 0,
//     }))
//     .sort((a, b) => a.level.localeCompare(b.level));
// }, [data]);


//   // Table columns
//   const tableColumns = [
//     { header: "Year", key: "Year", render: (row) => <span className="text-gray-900">{row.Year}</span> },
//     { header: "Semester", key: "Sem", render: (row) => <span className="text-gray-600">{row.Sem}</span> },
//     { header: "College", key: "College", render: (row) => <span className="text-gray-900">{row.College}</span> },
//     { header: "Program", key: "Program", render: (row) => <span className="text-gray-600">{row.Program}</span> },
//     { header: "Level", key: "Level", render: (row) => <span className="text-gray-600">{row.Level}</span> },
//     { header: "Male", key: "Male", className: "text-right", render: (row) => <span className="text-gray-900">{row.Male}</span> },
//     { header: "Female", key: "Female", className: "text-right", render: (row) => <span className="text-gray-900">{row.Female}</span> },
//     { header: "Total", key: "Total", className: "text-right", render: (row) => <span className="font-semibold text-gray-900">{row.Total}</span> }
//   ];

//   // Handle export
//   const handleExport = async () => {
//     const result = await enrollmentService.exportToCSV();
//     if (result.error) {
//       alert(`Export failed: ${result.error}`);
//     }
//   };

//   // Loading / Error / Empty
//   if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
//   if (error) return (
//     <div className="space-y-6">
//       <ErrorAlert error={error} />
//       <EmptyState
//         title="Failed to Load Data"
//         description="There was an error loading the enrollment data. Please try again."
//         action={
//           <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//             Retry
//           </button>
//         }
//       />
//     </div>
//   );
//   if (!data || data.length === 0) {
//     return <EmptyState icon={Users} title="No Enrollment Data" description="There is no enrollment data available at the moment." />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//           <p className="text-sm text-gray-500">Comprehensive enrollment analysis and student records</p>
//         </div>
//         <button 
//           onClick={handleExport}
//           className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition flex items-center gap-2"
//         >
//           <Download className="w-4 h-4" />
//           <span>Export Data</span>
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         <StatsCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle={`Latest Year: ${Math.max(...data.map(d => d.Year))}`} icon={Users} gradient="from-blue-500 to-blue-600" />

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-2">
//             <Users className="w-5 h-5 text-yellow-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">New</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.newStudents.toLocaleString()}</p>
//           <p className="text-xs text-green-600 mt-1">↑ 5.3% vs last year</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-green-100 p-2 rounded-lg w-fit mb-2">
//             <GraduationCap className="w-5 h-5 text-green-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Continuing</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
//           <p className="text-xs text-green-600 mt-1">↑ 3.8% vs last year</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-orange-100 p-2 rounded-lg w-fit mb-2">
//             <Users className="w-5 h-5 text-orange-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Transferee</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
//           <p className="text-xs text-red-600 mt-1">↓ 1.2% vs last year</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <p className="text-sm text-gray-600 mb-1">Male</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
//           <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartContainer title="Enrollment by College" description="Distribution of students across colleges">
//           <ResponsiveContainer width="100%" height={280}>
//             <BarChart data={collegeData.slice(0, 6)}>
//               <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//               <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
//               <YAxis {...CHART_CONFIG.axis} />
//               <Tooltip {...CHART_CONFIG.tooltip} />
//               <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>

//         <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
//           <div className="space-y-4">
//             {yearLevelData.map((item) => (
//               <div key={item.level}>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-700">{item.level}</span>
//                   <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-8">
//                   <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartContainer>
//       </div>

//       {/* Semester Enrollment Trends (1st & 2nd Sem) */}
//       <ChartContainer title="Semester Enrollment Trends" description="Trend per semester over the years">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={enrollmentTrendsBySem}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Legend verticalAlign="top" />
//             <Line
//               type="monotone"
//               dataKey="1st"
//               stroke={COLORS.primary}
//               strokeWidth={3}
//               dot={{ fill: COLORS.primary, r: 6 }}
//               name="1st Semester"
//             />
//             <Line
//               type="monotone"
//               dataKey="2nd"
//               stroke={COLORS.secondary || "#f97316"}
//               strokeWidth={3}
//               dot={{ fill: COLORS.secondary || "#f97316", r: 6 }}
//               name="2nd Semester"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       {/* Midyear Enrollment Trends (per year) */}
//       <ChartContainer title="Midyear Enrollment Trends" description="Midyear enrollment per year">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={midyearTrends}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Line
//               type="monotone"
//               dataKey="total"
//               stroke={COLORS.secondary || "#f97316"}
//               strokeWidth={3}
//               dot={{ fill: COLORS.secondary || "#f97316", r: 6 }}
//               name="Midyear"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       {/* Recent Enrollments Table */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
//           <div className="text-sm text-gray-500">Latest student enrollment records</div>
//         </div>
//         <DataTable columns={tableColumns} data={data.slice(0, 10)} emptyMessage="No enrollment records found" />
//       </div>
//     </div>
//   );
// };

// export default Enrollment;

// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import { Users, GraduationCap, Download } from "lucide-react";
// import { 
//   StatsCard, 
//   ChartContainer, 
//   DataTable, 
//   LoadingSpinner, 
//   EmptyState,
//   ErrorAlert 
// } from "../components/shared";
// import { COLORS, CHART_CONFIG } from "../config/constants";
// import { enrollmentService } from "../services/enrollmentService";

// const Enrollment = ({ data, isLoading, error, selectedYear, selectedCollege }) => {

//   // Filtered data for stats
//   const statsData = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     let filtered = data;
//     if (selectedYear && selectedYear !== "all") {
//       filtered = data.filter(d => d.Year === selectedYear);
//     }
//     if (selectedCollege && selectedCollege !== "All") {
//       filtered = filtered.filter(d => d.College === selectedCollege);
//     }
//     return filtered;
//   }, [data, selectedYear, selectedCollege]);

//   const stats = useMemo(() => {
//     if (!statsData || statsData.length === 0) return {
//       totalStudents: 0,
//       totalMale: 0,
//       totalFemale: 0,
//       newStudents: 0,
//       continuing: 0,
//       transferee: 0
//     };

//     const totalStudents = statsData.reduce((sum, row) => sum + (row.Total || 0), 0);
//     const totalMale = statsData.reduce((sum, row) => sum + (row.Male || 0), 0);
//     const totalFemale = statsData.reduce((sum, row) => sum + (row.Female || 0), 0);

//     const newStudents = Math.floor(totalStudents * 0.24);
//     const continuing = Math.floor(totalStudents * 0.68);
//     const transferee = Math.floor(totalStudents * 0.08);

//     return { 
//       totalStudents, 
//       totalMale, 
//       totalFemale,
//       newStudents,
//       continuing,
//       transferee
//     };
//   }, [statsData]);

//   // College enrollment data
//   const collegeData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];

//     const grouped = {};
//     statsData.forEach((item) => {
//       if (!grouped[item.College]) grouped[item.College] = { name: item.College, students: 0 };
//       grouped[item.College].students += item.Total || 0;
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [statsData]);

//   // Semester Enrollment Trends (1st & 2nd Sem separate lines)
//   const enrollmentTrendsBySem = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach((item) => {
//       const year = item.Year;
//       const sem = item.Sem;
//       if (sem && !sem.toLowerCase().includes("mid")) {
//         if (!grouped[year]) grouped[year] = { year };
//         grouped[year][sem] = (grouped[year][sem] || 0) + (item.Total || 0);
//       }
//     });
//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [statsData]);

//   // Midyear trends
//   const midyearTrends = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach((item) => {
//       if (item.Sem && item.Sem.toLowerCase() === "mid") {
//         const year = item.Year;
//         if (!grouped[year]) grouped[year] = { year, total: 0 };
//         grouped[year].total += item.Total || 0;
//       }
//     });
//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [statsData]);

//   // Year level distribution
//   const yearLevelData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       const level = item.Level || "Unknown";
//       if (!grouped[level]) grouped[level] = 0;
//       grouped[level] += item.Total || 0;
//     });
//     const total = statsData.reduce((sum, row) => sum + (row.Total || 0), 0);
//     return Object.entries(grouped).map(([level, count]) => ({
//       level,
//       percentage: total ? ((count / total) * 100).toFixed(1) : 0
//     })).sort((a, b) => a.level.localeCompare(b.level));
//   }, [statsData]);

//   // Table columns
//   const tableColumns = [
//     { header: "Year", key: "Year", render: row => <span>{row.Year}</span> },
//     { header: "Semester", key: "Sem", render: row => <span>{row.Sem}</span> },
//     { header: "College", key: "College", render: row => <span>{row.College}</span> },
//     { header: "Program", key: "Program", render: row => <span>{row.Program}</span> },
//     { header: "Level", key: "Level", render: row => <span>{row.Level}</span> },
//     { header: "Male", key: "Male", className: "text-right", render: row => <span>{row.Male}</span> },
//     { header: "Female", key: "Female", className: "text-right", render: row => <span>{row.Female}</span> },
//     { header: "Total", key: "Total", className: "text-right", render: row => <span>{row.Total}</span> }
//   ];

//   const handleExport = async () => {
//     const result = await enrollmentService.exportToCSV();
//     if (result.error) alert(`Export failed: ${result.error}`);
//   };

//   if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
//   if (error) return (
//     <div className="space-y-6">
//       <ErrorAlert error={error} />
//       <EmptyState title="Failed to Load Data" description="Error loading enrollment data" action={<button onClick={() => window.location.reload()}>Retry</button>} />
//     </div>
//   );
//   if (!data || data.length === 0) return <EmptyState icon={Users} title="No Enrollment Data" description="No enrollment data available" />;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//           <p className="text-sm text-gray-500">Comprehensive enrollment analysis</p>
//         </div>
//         <button onClick={handleExport} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 flex items-center gap-2">
//           <Download className="w-4 h-4" />
//           <span>Export Data</span>
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         <StatsCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle={selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`} icon={Users} gradient="from-blue-500 to-blue-600" />

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-2">
//             <Users className="w-5 h-5 text-yellow-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">New</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.newStudents.toLocaleString()}</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-green-100 p-2 rounded-lg w-fit mb-2">
//             <GraduationCap className="w-5 h-5 text-green-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Continuing</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-orange-100 p-2 rounded-lg w-fit mb-2">
//             <Users className="w-5 h-5 text-orange-600" />
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Transferee</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <p className="text-sm text-gray-600 mb-1">Male</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
//           <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
//         </div>
//       </div>

//       {/* Charts & Table */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartContainer title="Enrollment by College" description="Distribution across colleges">
//           <ResponsiveContainer width="100%" height={280}>
//             <BarChart data={collegeData.slice(0, 6)}>
//               <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//               <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
//               <YAxis {...CHART_CONFIG.axis} />
//               <Tooltip {...CHART_CONFIG.tooltip} />
//               <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>

//         <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
//           <div className="space-y-4">
//             {yearLevelData.map(item => (
//               <div key={item.level}>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-700">{item.level}</span>
//                   <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-8">
//                   <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartContainer>
//       </div>

//       <ChartContainer title="Semester Enrollment Trends" description="Trend per semester over the years">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={enrollmentTrendsBySem}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Legend verticalAlign="top" />
//             <Line type="monotone" dataKey="1st" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 6 }} name="1st Semester" />
//             <Line type="monotone" dataKey="2nd" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="2nd Semester" />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       <ChartContainer title="Midyear Enrollment Trends" description="Midyear enrollment per year">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={midyearTrends}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Line type="monotone" dataKey="total" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="Midyear" />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
//           <div className="text-sm text-gray-500">Latest student enrollment records</div>
//         </div>
//         <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No enrollment records found" />
//       </div>
//     </div>
//   );
// };

// export default Enrollment;



// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import { Users, GraduationCap, Download } from "lucide-react";
// import { 
//   StatsCard, 
//   ChartContainer, 
//   DataTable, 
//   LoadingSpinner, 
//   EmptyState,
//   ErrorAlert 
// } from "../components/shared";
// import { COLORS, CHART_CONFIG } from "../config/constants";
// import { enrollmentService } from "../services/enrollmentService";

// const Enrollment = ({ data, isLoading, error, selectedYear, selectedCollege }) => {

//   // Filtered data based on year and college
//   const statsData = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     let filtered = data;
//     if (selectedYear && selectedYear !== "all") {
//       filtered = data.filter(d => d.Year === selectedYear);
//     }
//     if (selectedCollege && selectedCollege !== "All") {
//       filtered = filtered.filter(d => d.College === selectedCollege);
//     }
//     return filtered;
//   }, [data, selectedYear, selectedCollege]);

//   // Stats calculation
//   const stats = useMemo(() => {
//     if (!statsData || statsData.length === 0) return {
//       totalStudents: 0,
//       totalMale: 0,
//       totalFemale: 0,
//       newStudents: 0,
//       continuing: 0,
//       transferee: 0
//     };

//     const totalMale = statsData.reduce((sum, row) => sum + (row.Male || 0), 0);
//     const totalFemale = statsData.reduce((sum, row) => sum + (row.Female || 0), 0);
//     const totalStudents = totalMale + totalFemale;

//     const newStudents = Math.floor(totalStudents * 0.24);
//     const continuing = Math.floor(totalStudents * 0.68);
//     const transferee = Math.floor(totalStudents * 0.08);

//     return { 
//       totalStudents, 
//       totalMale, 
//       totalFemale,
//       newStudents,
//       continuing,
//       transferee
//     };
//   }, [statsData]);

//   // College enrollment data
//   const collegeData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];

//     const grouped = {};
//     statsData.forEach(item => {
//       if (!grouped[item.College]) grouped[item.College] = { name: item.College, students: 0 };
//       grouped[item.College].students += (item.Male || 0) + (item.Female || 0);
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [statsData]);

//   // Semester Enrollment Trends (1st & 2nd Sem)
//   const enrollmentTrendsBySem = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       const year = item.Year;
//       const sem = item.Sem;
//       if (sem && !sem.toLowerCase().includes("mid")) {
//         if (!grouped[year]) grouped[year] = { year };
//         grouped[year][sem] = (grouped[year][sem] || 0) + ((item.Male || 0) + (item.Female || 0));
//       }
//     });
//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [statsData]);

//   // Midyear trends
//   const midyearTrends = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       if (item.Sem && item.Sem.toLowerCase() === "mid") {
//         const year = item.Year;
//         if (!grouped[year]) grouped[year] = { year, total: 0 };
//         grouped[year].total += (item.Male || 0) + (item.Female || 0);
//       }
//     });
//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [statsData]);

//   // Year level distribution
//   const yearLevelData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       const level = item.Level || "Unknown";
//       if (!grouped[level]) grouped[level] = 0;
//       grouped[level] += (item.Male || 0) + (item.Female || 0);
//     });
//     const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);
//     return Object.entries(grouped)
//       .map(([level, count]) => ({
//         level,
//         percentage: total ? ((count / total) * 100).toFixed(1) : 0
//       }))
//       .sort((a, b) => a.level.localeCompare(b.level));
//   }, [statsData]);

//   // Table columns
//   const tableColumns = [
//     { header: "Year", key: "Year", render: row => <span>{row.Year}</span> },
//     { header: "Semester", key: "Sem", render: row => <span>{row.Sem}</span> },
//     { header: "College", key: "College", render: row => <span>{row.College}</span> },
//     { header: "Program", key: "Program", render: row => <span>{row.Program}</span> },
//     { header: "Level", key: "Level", render: row => <span>{row.Level}</span> },
//     { header: "Male", key: "Male", className: "text-right", render: row => <span>{row.Male}</span> },
//     { header: "Female", key: "Female", className: "text-right", render: row => <span>{row.Female}</span> },
//     { header: "Total", key: "Total", className: "text-right", render: row => <span>{(row.Male + row.Female).toLocaleString()}</span> }
//   ];

//   // Export CSV
//   const handleExport = async () => {
//     const result = await enrollmentService.exportToCSV();
//     if (result.error) alert(`Export failed: ${result.error}`);
//   };

//   if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
//   if (error) return (
//     <div className="space-y-6">
//       <ErrorAlert error={error} />
//       <EmptyState title="Failed to Load Data" description="Error loading enrollment data" action={<button onClick={() => window.location.reload()}>Retry</button>} />
//     </div>
//   );
//   if (!data || data.length === 0) return <EmptyState icon={Users} title="No Enrollment Data" description="No enrollment data available" />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//           <p className="text-sm text-gray-500">Comprehensive enrollment analysis</p>
//         </div>
//         <button onClick={handleExport} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 flex items-center gap-2">
//           <Download className="w-4 h-4" />
//           <span>Export Data</span>
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         <StatsCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle={selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`} icon={Users} gradient="from-blue-500 to-blue-600" />
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-yellow-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">New</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.newStudents.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-green-100 p-2 rounded-lg w-fit mb-2"><GraduationCap className="w-5 h-5 text-green-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">Continuing</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-orange-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-orange-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">Transferee</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <p className="text-sm text-gray-600 mb-1">Male</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
//           <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartContainer title="Enrollment by College" description="Distribution across colleges">
//           <ResponsiveContainer width="100%" height={280}>
//             <BarChart data={collegeData.slice(0, 6)}>
//               <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//               <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
//               <YAxis {...CHART_CONFIG.axis} />
//               <Tooltip {...CHART_CONFIG.tooltip} />
//               <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>

//         <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
//           <div className="space-y-4">
//             {yearLevelData.map(item => (
//               <div key={item.level}>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-700">{item.level}</span>
//                   <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-8">
//                   <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartContainer>
//       </div>

//       <ChartContainer title="Semester Enrollment Trends" description="Trend per semester over the years">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={enrollmentTrendsBySem}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Legend verticalAlign="top" />
//             <Line type="monotone" dataKey="1st" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 6 }} name="1st Semester" />
//             <Line type="monotone" dataKey="2nd" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="2nd Semester" />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       <ChartContainer title="Midyear Enrollment Trends" description="Midyear enrollment per year">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={midyearTrends}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Line type="monotone" dataKey="total" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="Midyear" />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

//       {/* Recent Enrollments Table */}
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
//           <div className="text-sm text-gray-500">Latest student enrollment records</div>
//         </div>
//         <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No enrollment records found" />
//       </div>
//     </div>
//   );
// };

// export default Enrollment;

// import React, { useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";
// import { Users, GraduationCap, Download } from "lucide-react";
// import { 
//   StatsCard, 
//   ChartContainer, 
//   DataTable, 
//   LoadingSpinner, 
//   EmptyState,
//   ErrorAlert 
// } from "../components/shared";
// import { COLORS, CHART_CONFIG } from "../config/constants";
// import { enrollmentService } from "../services/enrollmentService";

// const Enrollment = ({ data, isLoading, error, selectedYear, selectedCollege }) => {

//   // Filtered data based on year and college
//   const statsData = useMemo(() => {
//     if (!data || data.length === 0) return [];
//     let filtered = data;
//     if (selectedYear && selectedYear !== "all") {
//       filtered = data.filter(d => d.Year === selectedYear);
//     }
//     if (selectedCollege && selectedCollege !== "All") {
//       filtered = filtered.filter(d => d.College === selectedCollege);
//     }
//     return filtered;
//   }, [data, selectedYear, selectedCollege]);

//   // Stats calculation
//   const stats = useMemo(() => {
//     if (!statsData || statsData.length === 0) return {
//       totalStudents: 0,
//       totalMale: 0,
//       totalFemale: 0,
//       newStudents: 0,
//       continuing: 0,
//       transferee: 0
//     };

//     const totalMale = statsData.reduce((sum, row) => sum + (row.Male || 0), 0);
//     const totalFemale = statsData.reduce((sum, row) => sum + (row.Female || 0), 0);
//     const totalStudents = totalMale + totalFemale;

//     const newStudents = Math.floor(totalStudents * 0.24);
//     const continuing = Math.floor(totalStudents * 0.68);
//     const transferee = Math.floor(totalStudents * 0.08);

//     return { 
//       totalStudents, 
//       totalMale, 
//       totalFemale,
//       newStudents,
//       continuing,
//       transferee
//     };
//   }, [statsData]);

//   // College enrollment data
//   const collegeData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       if (!grouped[item.College]) grouped[item.College] = { name: item.College, students: 0 };
//       grouped[item.College].students += (item.Male || 0) + (item.Female || 0);
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [statsData]);

//   // Program enrollment data
//   const programData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       const program = item.Program || "Unknown";
//       if (!grouped[program]) grouped[program] = { name: program, students: 0 };
//       grouped[program].students += (item.Male || 0) + (item.Female || 0);
//     });
//     return Object.values(grouped).sort((a, b) => b.students - a.students);
//   }, [statsData]);

//   // Semester Enrollment Trends (1st, 2nd, Mid)
//   const mergedSemesterTrends = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];

//     const grouped = {};
//     statsData.forEach(item => {
//       const year = item.Year;
//       const sem = item.Sem;
//       if (!grouped[year]) grouped[year] = { year };
//       if (sem) {
//         grouped[year][sem] = (grouped[year][sem] || 0) + ((item.Male || 0) + (item.Female || 0));
//       }
//     });

//     return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
//   }, [statsData]);

//   // Year level distribution
//   const yearLevelData = useMemo(() => {
//     if (!statsData || statsData.length === 0) return [];
//     const grouped = {};
//     statsData.forEach(item => {
//       const level = item.Level || "Unknown";
//       if (!grouped[level]) grouped[level] = 0;
//       grouped[level] += (item.Male || 0) + (item.Female || 0);
//     });
//     const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);
//     return Object.entries(grouped)
//       .map(([level, count]) => ({
//         level,
//         percentage: total ? ((count / total) * 100).toFixed(1) : 0
//       }))
//       .sort((a, b) => a.level.localeCompare(b.level));
//   }, [statsData]);

//   // Table columns
//   const tableColumns = [
//     { header: "Year", key: "Year", render: row => <span>{row.Year}</span> },
//     { header: "Semester", key: "Sem", render: row => <span>{row.Sem}</span> },
//     { header: "College", key: "College", render: row => <span>{row.College}</span> },
//     { header: "Program", key: "Program", render: row => <span>{row.Program}</span> },
//     { header: "Level", key: "Level", render: row => <span>{row.Level}</span> },
//     { header: "Male", key: "Male", className: "text-right", render: row => <span>{row.Male}</span> },
//     { header: "Female", key: "Female", className: "text-right", render: row => <span>{row.Female}</span> },
//     { header: "Total", key: "Total", className: "text-right", render: row => <span>{(row.Male + row.Female).toLocaleString()}</span> }
//   ];

//   // Export CSV
//   const handleExport = async () => {
//     const result = await enrollmentService.exportToCSV();
//     if (result.error) alert(`Export failed: ${result.error}`);
//   };

//   if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
//   if (error) return (
//     <div className="space-y-6">
//       <ErrorAlert error={error} />
//       <EmptyState title="Failed to Load Data" description="Error loading enrollment data" action={<button onClick={() => window.location.reload()}>Retry</button>} />
//     </div>
//   );
//   if (!data || data.length === 0) return <EmptyState icon={Users} title="No Enrollment Data" description="No enrollment data available" />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//           <p className="text-sm text-gray-500">Comprehensive enrollment analysis</p>
//         </div>
//         <button onClick={handleExport} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 flex items-center gap-2">
//           <Download className="w-4 h-4" />
//           <span>Export Data</span>
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         <StatsCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle={selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`} icon={Users} gradient="from-blue-500 to-blue-600" />
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-yellow-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">New</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.newStudents.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-green-100 p-2 rounded-lg w-fit mb-2"><GraduationCap className="w-5 h-5 text-green-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">Continuing</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <div className="bg-orange-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-orange-600" /></div>
//           <p className="text-sm text-gray-600 mb-1">Transferee</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//           <p className="text-sm text-gray-600 mb-1">Male</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
//           <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
//           <p className="text-2xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
//           <p className="text-xs text-gray-600 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartContainer title="Enrollment by College" description="Distribution across colleges">
//           <ResponsiveContainer width="100%" height={280}>
//             <BarChart data={collegeData.slice(0, 6)}>
//               <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//               <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
//               <YAxis {...CHART_CONFIG.axis} />
//               <Tooltip {...CHART_CONFIG.tooltip} />
//               <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>

//         <ChartContainer title="Enrollment by Program" description="Distribution across programs">
//           <ResponsiveContainer width="100%" height={280}>
//             <BarChart data={programData.slice(0, 8)}>
//               <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//               <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
//               <YAxis {...CHART_CONFIG.axis} />
//               <Tooltip {...CHART_CONFIG.tooltip} />
//               <Bar dataKey="students" fill={COLORS.secondary || "#f97316"} radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </div>

//       <ChartContainer title="Semester Enrollment Trends" description="Trend per semester over the years">
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={mergedSemesterTrends}>
//             <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
//             <XAxis dataKey="year" {...CHART_CONFIG.axis} />
//             <YAxis {...CHART_CONFIG.axis} />
//             <Tooltip {...CHART_CONFIG.tooltip} />
//             <Legend verticalAlign="top" />
//             <Line type="monotone" dataKey="1st" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 6 }} name="1st Semester" />
//             <Line type="monotone" dataKey="2nd" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="2nd Semester" />
//             <Line type="monotone" dataKey="Mid" stroke={COLORS.tertiary || "#15fa24ff"} strokeWidth={3} dot={{ fill: COLORS.tertiary || "#00ff4cff", r: 6 }} name="Midyear" />
//           </LineChart>
//         </ResponsiveContainer>
//       </ChartContainer>

      // <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
      //   <div className="space-y-4">
      //     {yearLevelData.map(item => (
      //       <div key={item.level}>
      //         <div className="flex justify-between mb-1">
      //           <span className="text-sm text-gray-700">{item.level}</span>
      //           <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
      //         </div>
      //         <div className="w-full bg-gray-200 rounded-full h-8">
      //           <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
      //         </div>
      //       </div>
      //     ))}
      //   </div>
      // </ChartContainer>

//       {/* Recent Enrollments Table */}
      // <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      //   <div className="flex items-center justify-between mb-6">
      //     <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
      //     <div className="text-sm text-gray-500">Latest student enrollment records</div>
      //   </div>
      //   <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No enrollment records found" />
      // </div>
//     </div>
//   );
// };

// export default Enrollment;

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Users, GraduationCap, Download, Search } from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  DataTable, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert 
} from "../components/shared";
import { COLORS, CHART_CONFIG } from "../config/constants";
import { enrollmentService } from "../services/enrollmentService";

const Enrollment = ({ data, isLoading, error }) => {
  const semOrder = ["1st", "2nd", "Mid"];

  // Filter states
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedSem, setSelectedSem] = useState("All");
  // const [searchQuery, setSearchQuery] = useState("");

  // Set default latest year
  useMemo(() => {
    if (data && data.length > 0 && selectedYear === null) {
      const latestYear = data.reduce(
        (max, row) => (row.Year > max ? row.Year : max),
        data[0].Year
      );
      setSelectedYear(latestYear);
    }
  }, [data, selectedYear]);

  // Filter options
  const filterOptions = useMemo(() => {
    if (!data || data.length === 0)
      return { years: ["all"], colleges: ["All"], semesters: ["All"] };

    const years = [...new Set(data.map((d) => d.Year))].sort((a, b) => b - a);
    const colleges = ["All", ...new Set(data.map((d) => d.College))];

    let semesters = [];
    if (selectedYear && selectedYear !== "all") {
      const semestersSet = new Set(
        data
          .filter((d) => d.Year === selectedYear)
          .map((d) => d.Sem)
          .filter(Boolean)
      );
      semesters = ["All", ...semOrder.filter((s) => semestersSet.has(s))];
    } else {
      semesters = ["All", ...semOrder];
    }

    return { years: ["all", ...years], colleges, semesters };
  }, [data, selectedYear]);

  // Set default latest semester
  useMemo(() => {
    if (!data || data.length === 0) return;
    const yearData = selectedYear
      ? data.filter((d) => d.Year === selectedYear)
      : data;
    if (yearData.length === 0) return;

    const latestSem = yearData
      .map((d) => d.Sem)
      .filter(Boolean)
      .sort((a, b) => semOrder.indexOf(b) - semOrder.indexOf(a))[0];

    if (selectedSem !== latestSem) {
      setSelectedSem(latestSem);
    }
  }, [data, selectedYear]);

  // Apply filters
  const statsData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      if (selectedYear && selectedYear !== "all" && item.Year !== selectedYear)
        return false;
      if (selectedCollege !== "All" && item.College !== selectedCollege)
        return false;
      if (selectedSem && selectedSem !== "All" && item.Sem !== selectedSem)
        return false;
      // if (searchQuery) {
      //   const query = searchQuery.toLowerCase();
      //   return (
      //     item.Program?.toLowerCase().includes(query) ||
      //     item.College?.toLowerCase().includes(query) ||
      //     String(item.Year)?.toLowerCase().includes(query)
      //   );
      // }
      return true;
    });
  }, [data, selectedYear, selectedCollege, selectedSem]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!statsData || statsData.length === 0) return {
      totalStudents: 0,
      totalMale: 0,
      totalFemale: 0,
      newStudents: 0,
      continuing: 0,
      transferee: 0
    };

    const totalMale = statsData.reduce((sum, row) => sum + (row.Male || 0), 0);
    const totalFemale = statsData.reduce((sum, row) => sum + (row.Female || 0), 0);
    const totalStudents = totalMale + totalFemale;

    const newStudents = Math.floor(totalStudents * 0.24);
    const continuing = Math.floor(totalStudents * 0.68);
    const transferee = Math.floor(totalStudents * 0.08);

    return { 
      totalStudents, 
      totalMale, 
      totalFemale,
      newStudents,
      continuing,
      transferee
    };
  }, [statsData]);

  // College enrollment data
  const collegeData = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];
    const grouped = {};
    statsData.forEach(item => {
      if (!grouped[item.College]) grouped[item.College] = { name: item.College, students: 0 };
      grouped[item.College].students += (item.Male || 0) + (item.Female || 0);
    });
    return Object.values(grouped).sort((a, b) => b.students - a.students);
  }, [statsData]);

  // Program enrollment data
  const programData = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];
    const grouped = {};
    statsData.forEach(item => {
      const program = item.Program || "Unknown";
      if (!grouped[program]) grouped[program] = { name: program, students: 0 };
      grouped[program].students += (item.Male || 0) + (item.Female || 0);
    });
    return Object.values(grouped).sort((a, b) => b.students - a.students);
  }, [statsData]);

  // Semester Enrollment Trends (1st, 2nd, Mid)
  const mergedSemesterTrends = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];

    const grouped = {};
    statsData.forEach(item => {
      const year = item.Year;
      const sem = item.Sem;
      if (!grouped[year]) grouped[year] = { year };
      if (sem) {
        grouped[year][sem] = (grouped[year][sem] || 0) + ((item.Male || 0) + (item.Female || 0));
      }
    });

    return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
  }, [statsData]);

  // Year level distribution
  const yearLevelData = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];
    const grouped = {};
    statsData.forEach(item => {
      const level = item.Level || "Unknown";
      if (!grouped[level]) grouped[level] = 0;
      grouped[level] += (item.Male || 0) + (item.Female || 0);
    });
    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);
    return Object.entries(grouped)
      .map(([level, count]) => ({
        level,
        percentage: total ? ((count / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => a.level.localeCompare(b.level));
  }, [statsData]);

  // Table columns
  const tableColumns = [
    { header: "Year", key: "Year", render: row => <span>{row.Year}</span> },
    { header: "Semester", key: "Sem", render: row => <span>{row.Sem}</span> },
    { header: "College", key: "College", render: row => <span>{row.College}</span> },
    { header: "Program", key: "Program", render: row => <span>{row.Program}</span> },
    { header: "Level", key: "Level", render: row => <span>{row.Level}</span> },
    { header: "Male", key: "Male", className: "text-right", render: row => <span>{row.Male}</span> },
    { header: "Female", key: "Female", className: "text-right", render: row => <span>{row.Female}</span> },
    { header: "Total", key: "Total", className: "text-right", render: row => <span>{(row.Male + row.Female).toLocaleString()}</span> }
  ];

  // Export CSV
  const handleExport = async () => {
    const result = await enrollmentService.exportToCSV();
    if (result.error) alert(`Export failed: ${result.error}`);
  };

  if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
  if (error) return (
    <div className="space-y-6">
      <ErrorAlert error={error} />
      <EmptyState title="Failed to Load Data" description="Error loading enrollment data" action={<button onClick={() => window.location.reload()}>Retry</button>} />
    </div>
  );
  if (!data || data.length === 0) return <EmptyState icon={Users} title="No Enrollment Data" description="No enrollment data available" />;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
          <p className="text-sm text-gray-500">Comprehensive enrollment analysis</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, programs, or data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          <select
            value={selectedYear || "all"}
            onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>
                {year === "all" ? "All Years" : year}
              </option>
            ))}
          </select>

          <select
            value={selectedSem || "All"}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterOptions.semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem === "All" ? "All Semesters" : sem}
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

          <button onClick={handleExport} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard title="Total Students" value={stats.totalStudents.toLocaleString()} subtitle={selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`} icon={Users} gradient="from-blue-500 to-blue-600" />
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-yellow-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-yellow-600" /></div>
          <p className="text-sm text-gray-600 mb-1">New</p>
          <p className="text-2xl font-bold text-gray-900">{stats.newStudents.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-green-100 p-2 rounded-lg w-fit mb-2"><GraduationCap className="w-5 h-5 text-green-600" /></div>
          <p className="text-sm text-gray-600 mb-1">Continuing</p>
          <p className="text-2xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="bg-orange-100 p-2 rounded-lg w-fit mb-2"><Users className="w-5 h-5 text-orange-600" /></div>
          <p className="text-sm text-gray-600 mb-1">Transferee</p>
          <p className="text-2xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Male</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Enrollment by College" description="Distribution across colleges">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={collegeData.slice(0, 6)}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Enrollment by Program" description="Distribution across programs">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={programData.slice(0, 8)}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="students" fill={COLORS.secondary || "#f97316"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Semester Enrollment Trends" description="Trend per semester over the years">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mergedSemesterTrends}>
            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
            <XAxis dataKey="year" {...CHART_CONFIG.axis} />
            <YAxis {...CHART_CONFIG.axis} />
            <Tooltip {...CHART_CONFIG.tooltip} />
            <Legend verticalAlign="top" />
            <Line type="monotone" dataKey="1st" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 6 }} name="1st Semester" />
            <Line type="monotone" dataKey="2nd" stroke={COLORS.secondary || "#f97316"} strokeWidth={3} dot={{ fill: COLORS.secondary || "#f97316", r: 6 }} name="2nd Semester" />
            <Line type="monotone" dataKey="Mid" stroke={COLORS.tertiary || "#15fa24ff"} strokeWidth={3} dot={{ fill: COLORS.tertiary || "#00ff4cff", r: 6 }} name="Midyear" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
        <div className="space-y-4">
          {yearLevelData.map(item => (
            <div key={item.level}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{item.level}</span>
                <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
          <div className="text-sm text-gray-500">Latest student enrollment records</div>
        </div>
        <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No enrollment records found" />
      </div>
    </div>
  );
};

export default Enrollment;
