// src/pages/Faculty.js
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Users, Award, BookOpen, Briefcase } from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  DataTable,
  LoadingSpinner, 
  EmptyState 
} from "../components/shared";
import { COLORS, CHART_COLORS } from "../config/constants";

const Faculty = ({ data, isLoading, error }) => {
  // Mock faculty data - replace with actual data from your backend
  const facultyByCollege = useMemo(() => [
    { college: "COE", faculty: 85, phd: 32, masters: 48, bachelors: 5 },
    { college: "CAS", faculty: 72, phd: 28, masters: 40, bachelors: 4 },
    { college: "CBA", faculty: 58, phd: 18, masters: 36, bachelors: 4 },
    { college: "CAFNR", faculty: 65, phd: 25, masters: 35, bachelors: 5 },
    { college: "COED", faculty: 54, phd: 20, masters: 30, bachelors: 4 },
    { college: "CON", faculty: 42, phd: 18, masters: 22, bachelors: 2 }
  ], []);

  const educationalAttainment = useMemo(() => [
    { level: "PhD", count: 141, percentage: 37 },
    { level: "Master's Degree", count: 211, percentage: 56 },
    { level: "Bachelor's Degree", count: 24, percentage: 6 },
    { level: "Others", count: 4, percentage: 1 }
  ], []);

  const academicRank = useMemo(() => [
    { rank: "Professor", count: 45 },
    { rank: "Associate Professor", count: 68 },
    { rank: "Assistant Professor", count: 95 },
    { rank: "Instructor", count: 162 },
    { rank: "Part-time", count: 10 }
  ], []);

  const researchOutput = useMemo(() => [
    { year: "2019", publications: 85, presentations: 42, projects: 28 },
    { year: "2020", publications: 92, presentations: 38, projects: 32 },
    { year: "2021", publications: 108, presentations: 55, projects: 35 },
    { year: "2022", publications: 125, presentations: 68, projects: 42 },
    { year: "2023", publications: 142, presentations: 75, projects: 48 },
    { year: "2024", publications: 158, presentations: 82, projects: 52 }
  ], []);

  const facultyDevelopment = useMemo(() => [
    { category: "Trainings", value: 95 },
    { category: "Seminars", value: 88 },
    { category: "Research", value: 82 },
    { category: "Teaching", value: 92 },
    { category: "Leadership", value: 75 }
  ], []);

  const stats = useMemo(() => ({
    totalFaculty: 380,
    phdHolders: 141,
    studentFacultyRatio: 53,
    activeResearchers: 156
  }), []);

  // Table columns
  const tableColumns = [
    { 
      header: "College", 
      key: "college",
      render: (row) => <span className="text-gray-900 font-medium">{row.college}</span>
    },
    { 
      header: "Total Faculty", 
      key: "faculty",
      className: "text-right",
      render: (row) => <span className="text-gray-900">{row.faculty}</span>
    },
    { 
      header: "PhD", 
      key: "phd",
      className: "text-right",
      render: (row) => <span className="text-blue-600 font-semibold">{row.phd}</span>
    },
    { 
      header: "Master's", 
      key: "masters",
      className: "text-right",
      render: (row) => <span className="text-green-600">{row.masters}</span>
    },
    { 
      header: "Bachelor's", 
      key: "bachelors",
      className: "text-right",
      render: (row) => <span className="text-gray-600">{row.bachelors}</span>
    },
    { 
      header: "PhD %", 
      key: "percentage",
      className: "text-right",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          {((row.phd / row.faculty) * 100).toFixed(1)}%
        </span>
      )
    }
  ];

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading faculty data..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={Users}
        title="Failed to Load Faculty Data"
        description="There was an error loading the faculty information."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Faculty Data</h2>
        <p className="text-sm text-gray-500">Faculty profiles, qualifications, and research activities</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Faculty"
          value={stats.totalFaculty}
          subtitle="Active faculty members"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />

        <StatsCard
          title="PhD Holders"
          value={stats.phdHolders}
          subtitle={`${((stats.phdHolders / stats.totalFaculty) * 100).toFixed(0)}% of faculty`}
          icon={Award}
          gradient="from-purple-500 to-purple-600"
        />

        <StatsCard
          title="Student-Faculty Ratio"
          value={`${stats.studentFacultyRatio}:1`}
          subtitle="Students per faculty"
          icon={BookOpen}
          gradient="from-green-500 to-green-600"
        />

        <StatsCard
          title="Active Researchers"
          value={stats.activeResearchers}
          subtitle="With published works"
          icon={Briefcase}
          gradient="from-yellow-400 to-yellow-500"
          textColor="text-gray-900"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Educational Attainment */}
        <ChartContainer
          title="Educational Attainment"
          description="Highest degree earned by faculty members"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={educationalAttainment}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ level, percentage }) => `${level}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {educationalAttainment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Academic Rank Distribution */}
        <ChartContainer
          title="Academic Rank Distribution"
          description="Number of faculty by academic rank"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={academicRank}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="rank" 
                stroke="#94a3b8" 
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty by College */}
        <ChartContainer
          title="Faculty Distribution by College"
          description="Number of faculty members per college"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facultyByCollege} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis 
                dataKey="college" 
                type="category" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }} 
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="faculty" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Faculty Development Metrics */}
        <ChartContainer
          title="Faculty Development Metrics"
          description="Participation rates in development activities"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={facultyDevelopment}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <Radar 
                name="Participation %" 
                dataKey="value" 
                stroke={COLORS.success}
                fill={COLORS.success}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Research Output Trends */}
      <ChartContainer
        title="Research Output Trends"
        description="Publications, presentations, and research projects over time"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={researchOutput}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="publications" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Publications" />
            <Bar dataKey="presentations" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Presentations" />
            <Bar dataKey="projects" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Research Projects" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Educational Attainment by College */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Educational Attainment by College
        </h3>
        <DataTable 
          columns={tableColumns}
          data={facultyByCollege}
          emptyMessage="No faculty data available"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Educational Profile</h3>
          <div className="space-y-3">
            {educationalAttainment.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Rank Distribution</h3>
          <div className="space-y-3">
            {academicRank.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-700">{item.rank}</span>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">2024 Research Output</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Publications</span>
                <span className="text-sm font-bold text-gray-900">158</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Presentations</span>
                <span className="text-sm font-bold text-gray-900">82</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Research Projects</span>
                <span className="text-sm font-bold text-gray-900">52</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" />
            <h3 className="text-xl font-semibold">High Qualification Rate</h3>
          </div>
          <p className="text-3xl font-bold mb-2">93%</p>
          <p className="text-sm opacity-90">
            93% of faculty members hold graduate degrees (Master's or PhD), 
            ensuring high-quality instruction and research capabilities.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Research Excellence</h3>
          </div>
          <p className="text-3xl font-bold mb-2">158</p>
          <p className="text-sm opacity-90">
            158 publications in 2024, demonstrating strong research productivity 
            and contributing to academic knowledge and innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faculty;