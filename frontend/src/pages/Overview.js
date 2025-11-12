// src/pages/Overview.js
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  GraduationCap,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  DataTable, 
  LoadingSpinner, 
  EmptyState 
} from "../components/shared";
import { COLORS, CHART_COLORS, CHART_CONFIG } from "../config/constants";

const Overview = ({ data, isLoading, error, selectedYear }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return {
      totalStudents: 0,
      totalMale: 0,
      totalFemale: 0,
      uniqueColleges: 0,
      uniquePrograms: 0,
      growthRate: 0
    };

    const totalStudents = data.reduce((sum, row) => sum + (row.Total || 0), 0);
    const totalMale = data.reduce((sum, row) => sum + (row.Male || 0), 0);
    const totalFemale = data.reduce((sum, row) => sum + (row.Female || 0), 0);
    const uniqueColleges = new Set(data.map((d) => d.College)).size;
    const uniquePrograms = new Set(data.map((d) => d.Program)).size;

    return { 
      totalStudents, 
      totalMale, 
      totalFemale, 
      uniqueColleges, 
      uniquePrograms,
      growthRate: 4.2 // Mock - calculate from actual data
    };
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

  // Gender distribution
  const genderData = useMemo(() => {
    if (!stats.totalStudents) return [];
    
    return [
      {
        name: "Male",
        value: stats.totalMale,
        percentage: ((stats.totalMale / stats.totalStudents) * 100).toFixed(1)
      },
      {
        name: "Female",
        value: stats.totalFemale,
        percentage: ((stats.totalFemale / stats.totalStudents) * 100).toFixed(1)
      }
    ];
  }, [stats]);

  // College enrollment
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

  // Program enrollment - top programs
  const programData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = {};
    data.forEach((item) => {
      const key = `${item.College}-${item.Program}`;
      if (!grouped[key]) {
        grouped[key] = {
          college: item.College,
          program: item.Program,
          enrolled: 0
        };
      }
      grouped[key].enrolled += item.Total || 0;
    });
    return Object.values(grouped)
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 5);
  }, [data]);

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

  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading dashboard data..." />;
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Failed to Load Data"
        description={`Error: ${error}`}
        action={
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reload Dashboard
          </button>
        }
      />
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Data Available"
        description="There is no enrollment data to display at the moment."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle={`↑ ${stats.growthRate}% vs last year`}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />

        <StatsCard
          title="Graduation Rate"
          value="92%"
          subtitle="vs last year"
          icon={GraduationCap}
          gradient="from-yellow-400 to-yellow-500"
          textColor="text-gray-900"
        />

        <StatsCard
          title="Total Colleges"
          value={stats.uniqueColleges}
          subtitle="Academic units"
          icon={BarChart3}
          gradient="from-green-500 to-green-600"
        />

        <StatsCard
          title="Enrollment Growth"
          value={`+${stats.growthRate}%`}
          subtitle="vs last year"
          icon={TrendingUp}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <ChartContainer
          title="Enrollment Trends"
          description="Student enrollment over the past years"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={enrollmentTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="total" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Graduation Rate Trend */}
        <ChartContainer
          title="Enrollment Growth Trend"
          description="Total enrollment growth over time"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by College */}
        <ChartContainer
          title="Students by College"
          description="Distribution of students across colleges"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={collegeData.slice(0, 6)}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="students"
                label={({ name, percent }) => `${name.substring(0, 3)}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {collegeData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Top Programs */}
        <ChartContainer
          title="Top Programs"
          description="Highest enrollment by program"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={programData}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis 
                dataKey="program" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                {...CHART_CONFIG.axis}
                style={{ fontSize: '10px' }}
              />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="enrolled" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Gender Distribution Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Male/Female Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Male Students</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.totalMale.toLocaleString()} ({genderData[0]?.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-blue-600 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${genderData[0]?.percentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Female Students</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.totalFemale.toLocaleString()} ({genderData[1]?.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-pink-500 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${genderData[1]?.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Programs</span>
              <span className="text-lg font-bold text-gray-900">{stats.uniquePrograms}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Colleges</span>
              <span className="text-lg font-bold text-gray-900">{stats.uniqueColleges}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-lg font-bold text-green-600">+{stats.growthRate}%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Academic Years</span>
              <span className="text-lg font-bold text-gray-900">{enrollmentTrends.length}</span>
            </div>
          </div>
        </div>

        {/* Top Colleges */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Colleges</h3>
          <div className="space-y-3">
            {collegeData.slice(0, 4).map((college, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-900 font-medium">{college.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {college.students.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-over-Year Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={enrollmentTrends}>
            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
            <XAxis dataKey="year" {...CHART_CONFIG.axis} />
            <YAxis {...CHART_CONFIG.axis} />
            <Tooltip {...CHART_CONFIG.tooltip} />
            <Bar dataKey="male" fill={COLORS.blue} radius={[4, 4, 0, 0]} name="Male" />
            <Bar dataKey="female" fill={COLORS.pink} radius={[4, 4, 0, 0]} name="Female" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
            <p className="text-sm text-gray-500 mt-1">Latest enrollment records from the database</p>
          </div>
          <div className="text-sm text-gray-500">
            Showing {Math.min(10, data.length)} of {data.length} records
          </div>
        </div>
        <DataTable 
          columns={tableColumns}
          data={data.slice(0, 10)}
          emptyMessage="No enrollment records available"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Academic Excellence</h3>
          <p className="text-3xl font-bold mb-2">92%</p>
          <p className="text-sm opacity-90">
            Graduation rate maintained above 90% for 5 consecutive years
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Student Satisfaction</h3>
          <p className="text-3xl font-bold mb-2">4.5/5</p>
          <p className="text-sm opacity-90">
            Based on recent student feedback and surveys
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;