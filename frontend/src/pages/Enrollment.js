import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Users, GraduationCap, Download } from "lucide-react";
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
  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return {
      totalStudents: 0,
      totalMale: 0,
      totalFemale: 0,
      newStudents: 0,
      continuing: 0,
      transferee: 0
    };

    const totalStudents = data.reduce((sum, row) => sum + (row.Total || 0), 0);
    const totalMale = data.reduce((sum, row) => sum + (row.Male || 0), 0);
    const totalFemale = data.reduce((sum, row) => sum + (row.Female || 0), 0);

    // Mock data for now - you can calculate from your actual data
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
  }, [data]);

  // College enrollment data
  const collegeData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.College]) {
        grouped[item.College] = { name: item.College, students: 0 };
      }
      grouped[item.College].students += item.Total || 0;
    });
    return Object.values(grouped).sort((a, b) => b.students - a.students);
  }, [data]);

  // Enrollment trends by year
  const enrollmentTrends = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = {};
    data.forEach((item) => {
      const key = item.Year;
      if (!grouped[key]) {
        grouped[key] = { year: key, total: 0, male: 0, female: 0 };
      }
      grouped[key].total += item.Total || 0;
      grouped[key].male += item.Male || 0;
      grouped[key].female += item.Female || 0;
    });
    return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
  }, [data]);

  // Year level distribution (mock percentages - calculate from actual data if available)
  const yearLevelData = [
    { level: '1st Year', percentage: 35 },
    { level: '2nd Year', percentage: 28 },
    { level: '3rd Year', percentage: 22 },
    { level: '4th Year', percentage: 12 },
    { level: '5th Year', percentage: 3 }
  ];

  // Table columns configuration
  const tableColumns = [
    { 
      header: "Year", 
      key: "Year",
      render: (row) => <span className="text-gray-900">{row.Year}</span>
    },
    { 
      header: "Semester", 
      key: "Sem",
      render: (row) => <span className="text-gray-600">{row.Sem}</span>
    },
    { 
      header: "College", 
      key: "College",
      render: (row) => <span className="text-gray-900">{row.College}</span>
    },
    { 
      header: "Program", 
      key: "Program",
      render: (row) => <span className="text-gray-600">{row.Program}</span>
    },
    { 
      header: "Level", 
      key: "Level",
      render: (row) => <span className="text-gray-600">{row.Level}</span>
    },
    { 
      header: "Male", 
      key: "Male",
      className: "text-right",
      render: (row) => <span className="text-gray-900">{row.Male}</span>
    },
    { 
      header: "Female", 
      key: "Female",
      className: "text-right",
      render: (row) => <span className="text-gray-900">{row.Female}</span>
    },
    { 
      header: "Total", 
      key: "Total",
      className: "text-right",
      render: (row) => <span className="font-semibold text-gray-900">{row.Total}</span>
    }
  ];

  // Handle export
  const handleExport = async () => {
    const result = await enrollmentService.exportToCSV();
    if (result.error) {
      alert(`Export failed: ${result.error}`);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading enrollment data..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert error={error} />
        <EmptyState
          title="Failed to Load Data"
          description="There was an error loading the enrollment data. Please try again."
          action={
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Enrollment Data"
        description="There is no enrollment data available at the moment."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Data</h2>
          <p className="text-sm text-gray-500">Comprehensive enrollment analysis and student records</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="↑ 4.2% vs last year"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">New</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.newStudents.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1">↑ 5.3% vs last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Continuing</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.continuing.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1">↑ 3.8% vs last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Transferee</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.transferee.toLocaleString()}
          </p>
          <p className="text-xs text-red-600 mt-1">↓ 1.2% vs last year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Male</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalMale.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mb-1 mt-3">Female</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalFemale.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by College */}
        <ChartContainer
          title="Enrollment by College"
          description="Distribution of students across colleges"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={collegeData.slice(0, 6)}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis 
                dataKey="name" 
                {...CHART_CONFIG.axis}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="students" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Year Level Distribution */}
        <ChartContainer
          title="Enrollment by Year Level"
          description="Student distribution across year levels"
        >
          <div className="space-y-4">
            {yearLevelData.map((item) => (
              <div key={item.level}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.level}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div 
                    className="bg-yellow-400 h-8 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* College Statistics and Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="College Statistics">
          <div className="space-y-3">
            {collegeData.slice(0, 5).map((college, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{college.name}</p>
                  <p className="text-xs text-gray-500">Students enrolled</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{college.students.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {((college.students / stats.totalStudents) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Gender Distribution">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Male</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalMale.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div 
                className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-medium"
                style={{ width: `${(stats.totalMale / stats.totalStudents) * 100}%` }}
              >
                {((stats.totalMale / stats.totalStudents) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-700">Female</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalFemale.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div 
                className="bg-pink-500 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-medium"
                style={{ width: `${(stats.totalFemale / stats.totalStudents) * 100}%` }}
              >
                {((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Semester Enrollment Trends */}
      <ChartContainer
        title="Semester Enrollment Trends"
        description="Student enrollment trends over recent semesters"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentTrends}>
            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
            <XAxis dataKey="year" {...CHART_CONFIG.axis} />
            <YAxis {...CHART_CONFIG.axis} />
            <Tooltip {...CHART_CONFIG.tooltip} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke={COLORS.primary}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Recent Enrollments Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
          <div className="text-sm text-gray-500">
            Latest student enrollment records
          </div>
        </div>
        <DataTable 
          columns={tableColumns}
          data={data.slice(0, 10)}
          emptyMessage="No enrollment records found"
        />
      </div>
    </div>
  );
};

export default Enrollment;