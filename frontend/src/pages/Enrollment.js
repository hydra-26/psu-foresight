// import React, { useMemo, useState } from "react";
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
// import { Users, GraduationCap, Download, Search } from "lucide-react";
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
//   const semOrder = ["1st", "2nd", "Mid"];

//   // Filter states
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedCollege, setSelectedCollege] = useState("All");
//   const [selectedSem, setSelectedSem] = useState("All");
//   // const [searchQuery, setSearchQuery] = useState("");

//   // Set default latest year
//   useMemo(() => {
//     if (data && data.length > 0 && selectedYear === null) {
//       const latestYear = data.reduce(
//         (max, row) => (row.Year > max ? row.Year : max),
//         data[0].Year
//       );
//       setSelectedYear(latestYear);
//     }
//   }, [data, selectedYear]);

//   // Filter options
//   const filterOptions = useMemo(() => {
//     if (!data || data.length === 0)
//       return { years: ["all"], colleges: ["All"], semesters: ["All"] };

//     const years = [...new Set(data.map((d) => d.Year))].sort((a, b) => b - a);
//     const colleges = ["All", ...new Set(data.map((d) => d.College))];

//     let semesters = [];
//     if (selectedYear && selectedYear !== "all") {
//       const semestersSet = new Set(
//         data
//           .filter((d) => d.Year === selectedYear)
//           .map((d) => d.Sem)
//           .filter(Boolean)
//       );
//       semesters = ["All", ...semOrder.filter((s) => semestersSet.has(s))];
//     } else {
//       semesters = ["All", ...semOrder];
//     }

//     return { years: ["all", ...years], colleges, semesters };
//   }, [data, selectedYear]);

//   // Set default latest semester
//   useMemo(() => {
//     if (!data || data.length === 0) return;
//     const yearData = selectedYear
//       ? data.filter((d) => d.Year === selectedYear)
//       : data;
//     if (yearData.length === 0) return;

//     const latestSem = yearData
//       .map((d) => d.Sem)
//       .filter(Boolean)
//       .sort((a, b) => semOrder.indexOf(b) - semOrder.indexOf(a))[0];

//     if (selectedSem !== latestSem) {
//       setSelectedSem(latestSem);
//     }
//   }, [data, selectedYear]);

//   // Apply filters
//   const statsData = useMemo(() => {
//     if (!data) return [];
//     return data.filter((item) => {
//       if (selectedYear && selectedYear !== "all" && item.Year !== selectedYear)
//         return false;
//       if (selectedCollege !== "All" && item.College !== selectedCollege)
//         return false;
//       if (selectedSem && selectedSem !== "All" && item.Sem !== selectedSem)
//         return false;
//       // if (searchQuery) {
//       //   const query = searchQuery.toLowerCase();
//       //   return (
//       //     item.Program?.toLowerCase().includes(query) ||
//       //     item.College?.toLowerCase().includes(query) ||
//       //     String(item.Year)?.toLowerCase().includes(query)
//       //   );
//       // }
//       return true;
//     });
//   }, [data, selectedYear, selectedCollege, selectedSem]);

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
//       {/* Header with Filters */}
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
//           <p className="text-sm text-gray-500">Comprehensive enrollment analysis</p>
//         </div>

//         <div className="flex flex-wrap gap-2 items-center">
//           {/* search */}
//           {/* <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search students, programs, or data..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div> */}

//           <select
//             value={selectedYear || "all"}
//             onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             {filterOptions.years.map((year) => (
//               <option key={year} value={year}>
//                 {year === "all" ? "All Years" : year}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedSem || "All"}
//             onChange={(e) => setSelectedSem(e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             {filterOptions.semesters.map((sem) => (
//               <option key={sem} value={sem}>
//                 {sem === "All" ? "All Semesters" : sem}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedCollege}
//             onChange={(e) => setSelectedCollege(e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             {filterOptions.colleges.map((college) => (
//               <option key={college} value={college}>
//                 {college}
//               </option>
//             ))}
//           </select>

//           <button onClick={handleExport} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 flex items-center gap-2">
//             <Download className="w-4 h-4" />
//             <span>Export Data</span>
//           </button>
//         </div>
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

//       <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
//         <div className="space-y-4">
//           {yearLevelData.map(item => (
//             <div key={item.level}>
//               <div className="flex justify-between mb-1">
//                 <span className="text-sm text-gray-700">{item.level}</span>
//                 <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-8">
//                 <div className="bg-yellow-400 h-8 rounded-full transition-all duration-300" style={{ width: `${item.percentage}%` }}></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </ChartContainer>

//       {/* Table */}
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
import { Users, GraduationCap, Download, Search, TrendingUp, BookOpen } from "lucide-react";

// Mock components for demonstration
const LoadingSpinner = ({ size, text }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">{text}</p>
  </div>
);

const ErrorAlert = ({ error }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
    <p className="text-red-800">{error}</p>
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
    {Icon && <Icon className="w-16 h-16 text-gray-400 mb-4" />}
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {action}
  </div>
);

const StatsCard = ({ title, value, subtitle, sem, icon: Icon, gradient }) => (
  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300`}></div>
    <div className="relative">
      <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl w-fit mb-4 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-400 mb-1">{subtitle}</p>
      <p className="text-xs font-medium text-gray-400">{sem}</p>
    </div>
  </div>
);

const ChartContainer = ({ title, description, children }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    {children}
  </div>
);

const DataTable = ({ columns, data, emptyMessage }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
  }
  
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50 transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.key} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const COLORS = {
  primary: "#3b82f6",
  secondary: "#f59e0b",
  tertiary: "#10b981"
};

const CHART_CONFIG = {
  cartesianGrid: { strokeDasharray: "3 3", stroke: "#e5e7eb" },
  axis: { fontSize: 12, fill: "#6b7280" },
  tooltip: { 
    contentStyle: { 
      backgroundColor: "rgba(255, 255, 255, 0.98)", 
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }
  }
};

const Enrollment = ({ data, isLoading, error }) => {
  const semOrder = ["1st", "2nd", "Mid"];

  // Filter states
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedSem, setSelectedSem] = useState("All");

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

// Percentage change of total students compared to previous year (same semester or all)
const percentChange = useMemo(() => {
  if (!data || !selectedYear) return null;

  // Get current and previous year values
  const [start, end] = selectedYear.split("-").map(Number);
  const prevYear = `${start - 1}-${end - 1}`;

  // Filter for current year and prev year
  const currentYearData =
    selectedSem === "All"
      ? data.filter((d) => d.Year === selectedYear)
      : data.filter((d) => d.Year === selectedYear && d.Sem === selectedSem);

  const prevYearData =
    selectedSem === "All"
      ? data.filter((d) => d.Year === prevYear)
      : data.filter((d) => d.Year === prevYear && d.Sem === selectedSem);

  // Compute totals
  const currentTotal = currentYearData.reduce(
    (sum, d) => sum + (d.Male || 0) + (d.Female || 0),
    0
  );
  const prevTotal = prevYearData.reduce(
    (sum, d) => sum + (d.Male || 0) + (d.Female || 0),
    0
  );

  if (prevTotal === 0) return null; // avoid division by zero
  const change = ((currentTotal - prevTotal) / prevTotal) * 100;
  return change.toFixed(1);
}, [data, selectedYear, selectedSem]);


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

  // Semester Enrollment Trends
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
    { header: "Year", key: "Year", render: row => <span className="font-medium">{row.Year}</span> },
    { header: "Semester", key: "Sem", render: row => <span className="font-medium">{row.Sem}</span> },
    { header: "College", key: "College", render: row => <span>{row.College}</span> },
    { header: "Program", key: "Program", render: row => <span>{row.Program}</span> },
    { header: "Level", key: "Level", render: row => <span>{row.Level}</span> },
    { header: "Male", key: "Male", className: "text-right", render: row => <span className="font-semibold text-blue-600">{row.Male}</span> },
    { header: "Female", key: "Female", className: "text-right", render: row => <span className="font-semibold text-pink-600">{row.Female}</span> },
    { header: "Total", key: "Total", className: "text-right", render: row => <span className="font-bold text-gray-900">{(row.Male + row.Female).toLocaleString()}</span> }
  ];

  // Export CSV
  const handleExport = async () => {
    alert("Export functionality would trigger here");
  };

  if (isLoading) return <LoadingSpinner size="large" text="Loading enrollment data..." />;
  if (error) return (
    <div className="space-y-6 p-8">
      <ErrorAlert error={error} />
      <EmptyState title="Failed to Load Data" description="Error loading enrollment data" action={<button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>} />
    </div>
  );
  if (!data || data.length === 0) return <EmptyState icon={Users} title="No Enrollment Data" description="No enrollment data available" />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Enrollment Data</h2>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedYear || "all"}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : e.target.value)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-colors"
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
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-colors"
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
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-colors"
            >
              {filterOptions.colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>

            <button onClick={handleExport} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard 
            title="Total Students" 
            value={stats.totalStudents.toLocaleString()} 
            subtitle={selectedYear === "all" ? "All Years" : `Academic Year: ${selectedYear}`}
            sem={selectedYear === "all" ? "All Semesters" : `Semester: ${selectedSem}`}
            icon={Users} 
            gradient="from-blue-500 to-blue-600" 
          />
          
          <StatsCard
          title="Enrollment Change"
          value={percentChange !== null ? `${Math.abs(percentChange)}%` : "N/A"}
          subtitle={
            percentChange !== null
              ? percentChange > 0
                ? "Increase from last year"
                : percentChange < 0
                ? "Decrease from last year"
                : "No change from last year"
              : "No data for previous year"
          }
          icon={TrendingUp}
          gradient={percentChange > 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"}
        />


          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl w-fit mb-4 shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Continuing</p>
              <p className="text-3xl font-bold text-gray-900">{stats.continuing.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">68% of total</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl w-fit mb-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Transferee</p>
              <p className="text-3xl font-bold text-gray-900">{stats.transferee.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">8% of total</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden text-white">
            <div className="relative">
              <p className="text-sm font-medium text-purple-100 mb-3">Gender Distribution</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium">Male</p>
                    <p className="text-lg font-bold">{stats.totalMale.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(stats.totalMale / stats.totalStudents) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-purple-100 mt-1">{((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium">Female</p>
                    <p className="text-lg font-bold">{stats.totalFemale.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(stats.totalFemale / stats.totalStudents) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-purple-100 mt-1">{((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Enrollment by College" description="Distribution across colleges">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collegeData}>
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
                <YAxis {...CHART_CONFIG.axis} />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Bar dataKey="students" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Enrollment by Program" description="Distribution across programs">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={programData}>
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
                <YAxis {...CHART_CONFIG.axis} />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Bar dataKey="students" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Semester Trends */}
        <ChartContainer title="Semester Enrollment Trends" description="Enrollment trends per semester over the years">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={mergedSemesterTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Legend verticalAlign="top" height={40} iconType="circle" />
              <Line type="monotone" dataKey="1st" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 5, strokeWidth: 2, stroke: "#fff" }} name="1st Semester" />
              <Line type="monotone" dataKey="2nd" stroke={COLORS.secondary} strokeWidth={3} dot={{ fill: COLORS.secondary, r: 5, strokeWidth: 2, stroke: "#fff" }} name="2nd Semester" />
              <Line type="monotone" dataKey="Mid" stroke={COLORS.tertiary} strokeWidth={3} dot={{ fill: COLORS.tertiary, r: 5, strokeWidth: 2, stroke: "#fff" }} name="Midyear" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Year Level Distribution */}
        <ChartContainer title="Enrollment by Year Level" description="Student distribution across year levels">
          <div className="space-y-5">
            {yearLevelData.map(item => (
              <div key={item.level}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">{item.level}</span>
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-10 rounded-full transition-all duration-500 flex items-center justify-end pr-3" style={{ width: `${item.percentage}%` }}>
                    {parseFloat(item.percentage) > 10 && (
                      <span className="text-xs font-semibold text-white">{item.percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Enrollments</h3>
              <p className="text-sm text-gray-500 mt-1">Latest student enrollment records</p>
            </div>
          </div>
          <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No enrollment records found" />
        </div>
      </div>
    </div>
  );
};

export default Enrollment;