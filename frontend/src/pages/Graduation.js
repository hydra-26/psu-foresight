// import React from "react";

// const Graduation = () => {
//   return (
//     <div className="text-gray-800 text-2xl font-semibold">
//       Graduation Content Placeholder
//     </div>
//   );
// };

// export default Graduation;

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
import { Users, GraduationCap, Download, TrendingUp } from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  DataTable, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert 
} from "../components/shared";
import { COLORS, CHART_CONFIG } from "../config/constants";

const Graduation = ({ data, isLoading, error }) => {
  const semOrder = ["1st", "2nd", "Mid"];

  // Filter states
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedSem, setSelectedSem] = useState("All");

  // Set default latest year
  useMemo(() => {
    if (data && data.length > 0 && selectedYear === null) {
      const latestYear = data.reduce(
        (max, row) => (row.year > max ? row.year : max),
        data[0].year
      );
      setSelectedYear(latestYear);
    }
  }, [data, selectedYear]);

  // Filter options
  const filterOptions = useMemo(() => {
    if (!data || data.length === 0)
      return { years: ["all"], colleges: ["All"], semesters: ["All"] };

    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => b - a);
    const colleges = ["All", ...new Set(data.map((d) => d.college))];

    let semesters = [];
    if (selectedYear && selectedYear !== "all") {
      const semestersSet = new Set(
        data
          .filter((d) => d.year === selectedYear)
          .map((d) => d.sem)
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
      ? data.filter((d) => d.year === selectedYear)
      : data;
    if (yearData.length === 0) return;

    const latestSem = yearData
      .map((d) => d.sem)
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
      if (selectedYear && selectedYear !== "all" && item.year !== selectedYear)
        return false;
      if (selectedCollege !== "All" && item.college !== selectedCollege)
        return false;
      if (selectedSem && selectedSem !== "All" && item.sem !== selectedSem)
        return false;
      return true;
    });
  }, [data, selectedYear, selectedCollege, selectedSem]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!statsData || statsData.length === 0) return {
      totalGraduates: 0,
      totalMale: 0,
      totalFemale: 0
    };

    const totalMale = statsData.reduce((sum, row) => sum + (row.male || 0), 0);
    const totalFemale = statsData.reduce((sum, row) => sum + (row.female || 0), 0);
    const totalGraduates = totalMale + totalFemale;

    return { 
      totalGraduates, 
      totalMale, 
      totalFemale
    };
  }, [statsData]);

  // College graduate data
  const collegeData = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];
    const grouped = {};
    statsData.forEach(item => {
      if (!grouped[item.college]) grouped[item.college] = { name: item.college, graduates: 0 };
      grouped[item.college].graduates += (item.male || 0) + (item.female || 0);
    });
    return Object.values(grouped).sort((a, b) => b.graduates - a.graduates);
  }, [statsData]);

  // Program graduate data
  const programData = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];
    const grouped = {};
    statsData.forEach(item => {
      const program = item.program || "Unknown";
      if (!grouped[program]) grouped[program] = { name: program, graduates: 0 };
      grouped[program].graduates += (item.male || 0) + (item.female || 0);
    });
    return Object.values(grouped).sort((a, b) => b.graduates - a.graduates);
  }, [statsData]);

  // Semester Graduate Trends (1st, 2nd, Mid)
  const mergedSemesterTrends = useMemo(() => {
    if (!statsData || statsData.length === 0) return [];

    const grouped = {};
    statsData.forEach(item => {
      const year = item.year;
      const sem = item.sem;
      if (!grouped[year]) grouped[year] = { year };
      if (sem) {
        grouped[year][sem] = (grouped[year][sem] || 0) + ((item.male || 0) + (item.female || 0));
      }
    });

    return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
  }, [statsData]);

  // Gender distribution data for chart
  const genderData = useMemo(() => {
    if (!stats || stats.totalGraduates === 0) return [];
    return [
      { name: "Male", value: stats.totalMale },
      { name: "Female", value: stats.totalFemale }
    ];
  }, [stats]);

  // Table columns
  const tableColumns = [
    { header: "Year", key: "year", render: row => <span className="font-medium">{row.year}</span> },
    { header: "Semester", key: "sem", render: row => <span className="font-medium">{row.sem}</span> },
    { header: "College", key: "college", render: row => <span>{row.college}</span> },
    { header: "Program", key: "program", render: row => <span>{row.program}</span> },
    { header: "Male", key: "male", className: "text-right", render: row => <span className="font-semibold text-blue-600">{row.male}</span> },
    { header: "Female", key: "female", className: "text-right", render: row => <span className="font-semibold text-pink-600">{row.female}</span> },
    { header: "Total", key: "Total", className: "text-right", render: row => <span className="font-bold text-gray-900">{(row.male + row.female).toLocaleString()}</span> }
  ];

  // Export CSV
  const handleExport = async () => {
    try {
      const csvContent = [
        ["Year", "Semester", "College", "Program", "Male", "Female", "Total"],
        ...statsData.map(row => [
          row.year,
          row.sem,
          row.college,
          row.program,
          row.male,
          row.female,
          row.male + row.female
        ])
      ].map(row => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `graduate_data_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  if (isLoading) return <LoadingSpinner size="large" text="Loading graduate data..." />;
  if (error) return (
    <div className="space-y-6">
      <ErrorAlert error={error} />
      <EmptyState title="Failed to Load Data" description="Error loading graduate data" action={<button onClick={() => window.location.reload()}>Retry</button>} />
    </div>
  );
  if (!data || data.length === 0) return <EmptyState icon={GraduationCap} title="No Graduate Data" description="No graduate data available" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Graduate Analytics</h2>
                <p className="text-sm text-gray-600 mt-1">Comprehensive graduation insights and trends</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedYear || "all"}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : e.target.value)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-300 transition-colors"
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
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-300 transition-colors"
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
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-300 transition-colors"
            >
              {filterOptions.colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>

            <button onClick={handleExport} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Graduates" 
            value={stats.totalGraduates.toLocaleString()} 
            subtitle={selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`} 
            icon={GraduationCap} 
            gradient="from-purple-500 to-purple-600" 
          />
          
          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl w-fit mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Male Graduates</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMale.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalGraduates > 0 ? ((stats.totalMale / stats.totalGraduates) * 100).toFixed(1) : 0}% of total</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-xl w-fit mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Female Graduates</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFemale.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalGraduates > 0 ? ((stats.totalFemale / stats.totalGraduates) * 100).toFixed(1) : 0}% of total</p>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Graduates by College" description="Distribution across colleges">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collegeData.slice(0, 6)}>
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
                <YAxis {...CHART_CONFIG.axis} />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Bar dataKey="graduates" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Graduates by Program" description="Distribution across programs">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={programData.slice(0, 8)}>
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="name" {...CHART_CONFIG.axis} angle={-45} textAnchor="end" height={80} />
                <YAxis {...CHART_CONFIG.axis} />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Bar dataKey="graduates" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Semester Trends */}
        <ChartContainer title="Semester Graduate Trends" description="Graduation trends per semester over the years">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={mergedSemesterTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Legend verticalAlign="top" height={40} iconType="circle" />
              <Line type="monotone" dataKey="1st" stroke="#a855f7" strokeWidth={3} dot={{ fill: "#a855f7", r: 5, strokeWidth: 2, stroke: "#fff" }} name="1st Semester" />
              <Line type="monotone" dataKey="2nd" stroke="#ec4899" strokeWidth={3} dot={{ fill: "#ec4899", r: 5, strokeWidth: 2, stroke: "#fff" }} name="2nd Semester" />
              <Line type="monotone" dataKey="Mid" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#fff" }} name="Midyear" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Gender Distribution Chart */}
        <ChartContainer title="Gender Distribution" description="Graduate distribution by gender">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData} layout="vertical">
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis type="number" {...CHART_CONFIG.axis} />
              <YAxis type="category" dataKey="name" {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="value" fill="#a855f7" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Graduates</h3>
              <p className="text-sm text-gray-500 mt-1">Latest graduate records</p>
            </div>
          </div>
          <DataTable columns={tableColumns} data={statsData.slice(0, 10)} emptyMessage="No graduate records found" />
        </div>
      </div>
    </div>
  );
};

export default Graduation;
