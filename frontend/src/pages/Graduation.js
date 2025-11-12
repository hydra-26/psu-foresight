// src/pages/Graduation.js
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { GraduationCap, TrendingUp, Award, Calendar } from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  DataTable,
  LoadingSpinner, 
  EmptyState 
} from "../components/shared";
import { COLORS, CHART_CONFIG } from "../config/constants";

const Graduation = ({ data, isLoading, error }) => {
  // Mock graduation data - replace with actual data from your backend
  const graduationTrends = useMemo(() => [
    { year: "2019", graduates: 3200, rate: 89, onTime: 2848, delayed: 352 },
    { year: "2020", graduates: 3450, rate: 90, onTime: 3105, delayed: 345 },
    { year: "2021", graduates: 3680, rate: 91, onTime: 3349, delayed: 331 },
    { year: "2022", graduates: 3850, rate: 92, onTime: 3542, delayed: 308 },
    { year: "2023", graduates: 4100, rate: 92, onTime: 3772, delayed: 328 },
    { year: "2024", graduates: 4350, rate: 93, onTime: 4046, delayed: 304 }
  ], []);

  const collegeGraduation = useMemo(() => [
    { college: "COE", graduates: 850, rate: 94 },
    { college: "CAS", graduates: 720, rate: 91 },
    { college: "CBA", graduates: 680, rate: 89 },
    { college: "CAFNR", graduates: 520, rate: 90 },
    { college: "COED", graduates: 490, rate: 92 },
    { college: "CON", graduates: 380, rate: 95 }
  ], []);

  const graduationByProgram = useMemo(() => [
    { program: "BSCS", graduates: 245, rate: 95 },
    { program: "BSIT", graduates: 230, rate: 93 },
    { program: "BSE", graduates: 185, rate: 91 },
    { program: "BSBA", graduates: 210, rate: 89 },
    { program: "BSA", graduates: 175, rate: 90 },
    { program: "BSN", graduates: 195, rate: 96 },
    { program: "AB Comm", graduates: 140, rate: 88 },
    { program: "BSED", graduates: 155, rate: 92 }
  ], []);

  const employmentData = useMemo(() => [
    { category: "Employed", count: 3200, percentage: 74 },
    { category: "Graduate School", count: 680, percentage: 16 },
    { category: "Self-Employed", count: 260, percentage: 6 },
    { category: "Job Seeking", count: 210, percentage: 4 }
  ], []);

  const stats = useMemo(() => ({
    totalGraduates: 4350,
    graduationRate: 93,
    onTimeGraduation: 93,
    employmentRate: 96
  }), []);

  // Table columns
  const tableColumns = [
    { 
      header: "Program", 
      key: "program",
      render: (row) => <span className="text-gray-900 font-medium">{row.program}</span>
    },
    { 
      header: "Graduates", 
      key: "graduates",
      className: "text-right",
      render: (row) => <span className="text-gray-900">{row.graduates}</span>
    },
    { 
      header: "Graduation Rate", 
      key: "rate",
      className: "text-right",
      render: (row) => (
        <span className={`font-semibold ${row.rate >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
          {row.rate}%
        </span>
      )
    },
    { 
      header: "Status", 
      key: "status",
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.rate >= 92 ? 'bg-green-100 text-green-800' : 
          row.rate >= 85 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {row.rate >= 92 ? 'Excellent' : row.rate >= 85 ? 'Good' : 'Needs Improvement'}
        </span>
      )
    }
  ];

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading graduation data..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Failed to Load Graduation Data"
        description="There was an error loading the graduation statistics."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Graduation Data</h2>
        <p className="text-sm text-gray-500">Graduation rates, trends, and student outcomes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Graduates"
          value={stats.totalGraduates.toLocaleString()}
          subtitle="Academic Year 2023-2024"
          icon={GraduationCap}
          gradient="from-blue-500 to-blue-600"
        />

        <StatsCard
          title="Graduation Rate"
          value={`${stats.graduationRate}%`}
          subtitle="↑ 1% vs last year"
          icon={TrendingUp}
          gradient="from-green-500 to-green-600"
        />

        <StatsCard
          title="On-Time Graduation"
          value={`${stats.onTimeGraduation}%`}
          subtitle="Within 4 years"
          icon={Calendar}
          gradient="from-yellow-400 to-yellow-500"
          textColor="text-gray-900"
        />

        <StatsCard
          title="Employment Rate"
          value={`${stats.employmentRate}%`}
          subtitle="Within 6 months"
          icon={Award}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graduation Trends */}
        <ChartContainer
          title="Graduation Rate Trends"
          description="Graduation rates over the past 6 years"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graduationTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} domain={[80, 100]} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={COLORS.success}
                strokeWidth={3}
                dot={{ fill: COLORS.success, r: 6 }}
                name="Graduation Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Graduates Count */}
        <ChartContainer
          title="Number of Graduates"
          description="Total graduates per year"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graduationTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="graduates" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-Time vs Delayed */}
        <ChartContainer
          title="Graduation Timeline"
          description="On-time vs delayed graduation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={graduationTrends}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="year" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="onTime" 
                stackId="1"
                stroke={COLORS.success}
                fill={COLORS.success}
                name="On-Time"
              />
              <Area 
                type="monotone" 
                dataKey="delayed" 
                stackId="1"
                stroke={COLORS.danger}
                fill={COLORS.danger}
                name="Delayed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* College Graduation Rates */}
        <ChartContainer
          title="Graduation Rate by College"
          description="Comparison across colleges"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collegeGraduation}>
              <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
              <XAxis dataKey="college" {...CHART_CONFIG.axis} />
              <YAxis {...CHART_CONFIG.axis} domain={[80, 100]} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Bar dataKey="rate" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Employment Status */}
      <ChartContainer
        title="Graduate Employment Status"
        description="Post-graduation outcomes within 6 months"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {employmentData.map((item, idx) => (
            <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {item.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-2">{item.category}</div>
              <div className="text-2xl font-semibold text-blue-600">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>

      {/* College Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">College Performance</h3>
        <div className="space-y-4">
          {collegeGraduation.map((college, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-900">{college.college}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({college.graduates} graduates)
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{college.rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className={`h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2 ${
                    college.rate >= 92 ? 'bg-green-500' : 
                    college.rate >= 85 ? 'bg-yellow-400' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${college.rate}%` }}
                >
                  <span className="text-xs font-medium text-white">{college.rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Graduation Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Program Performance</h3>
            <p className="text-sm text-gray-500 mt-1">Graduation statistics by program</p>
          </div>
        </div>
        <DataTable 
          columns={tableColumns}
          data={graduationByProgram}
          emptyMessage="No program data available"
        />
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Positive Trend</h3>
          </div>
          <p className="text-3xl font-bold mb-2">+5.2%</p>
          <p className="text-sm opacity-90">
            Graduation rate has improved by 5.2 percentage points over the last 5 years, 
            demonstrating strong academic support and student success initiatives.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" />
            <h3 className="text-xl font-semibold">High Performance</h3>
          </div>
          <p className="text-3xl font-bold mb-2">93%</p>
          <p className="text-sm opacity-90">
            93% of graduates complete their degree on time, reflecting effective curriculum 
            design and student guidance programs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Graduation;