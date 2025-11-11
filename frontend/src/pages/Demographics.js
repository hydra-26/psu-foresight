// src/pages/Demographics.js
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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
import { MapPin, Users, Home, Globe, GraduationCap} from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  LoadingSpinner, 
  EmptyState 
} from "../components/shared";
import { COLORS, CHART_COLORS } from "../config/constants";

const Demographics = ({ data, isLoading, error }) => {
  // Mock demographic data - replace with actual data from your backend
  const locationData = useMemo(() => [
    { region: "Benguet", students: 8500, percentage: 42 },
    { region: "La Trinidad", students: 6200, percentage: 30 },
    { region: "Baguio City", students: 3800, percentage: 19 },
    { region: "Mountain Province", students: 1200, percentage: 6 },
    { region: "Others", students: 600, percentage: 3 }
  ], []);

  const ageDistribution = useMemo(() => [
    { age: "16-18", count: 6500 },
    { age: "19-21", count: 9800 },
    { age: "22-24", count: 3200 },
    { age: "25-27", count: 800 },
    { age: "28+", count: 400 }
  ], []);

  const housingData = useMemo(() => [
    { type: "Dormitory", value: 7500, percentage: 37 },
    { type: "Boarding House", value: 6200, percentage: 30 },
    { type: "With Family", value: 4800, percentage: 24 },
    { type: "Own House", value: 1800, percentage: 9 }
  ], []);

  const socioeconomicData = useMemo(() => [
    { category: "Upper Class", value: 2000, percentage: 10 },
    { category: "Middle Class", value: 12000, percentage: 59 },
    { category: "Lower Class", value: 6300, percentage: 31 }
  ], []);

  const scholarshipData = useMemo(() => [
    { type: "Academic", students: 4500 },
    { type: "Sports", students: 1200 },
    { type: "Need-based", students: 3800 },
    { type: "Government", students: 2500 },
    { type: "Private", students: 1800 }
  ], []);

  // Diversity metrics for radar chart
  const diversityMetrics = useMemo(() => [
    { metric: "Regional", value: 85 },
    { metric: "Age", value: 70 },
    { metric: "Socioeconomic", value: 75 },
    { metric: "Housing", value: 80 },
    { metric: "Scholarship", value: 65 }
  ], []);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return {
      totalStudents: 20300,
      totalRegions: 15,
      scholarshipRecipients: 13800,
      internationalStudents: 350
    };

    const totalStudents = data.reduce((sum, row) => sum + (row.Total || 0), 0);
    
    return {
      totalStudents,
      totalRegions: 15,
      scholarshipRecipients: 13800,
      internationalStudents: 350
    };
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading demographics data..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={MapPin}
        title="Failed to Load Demographics"
        description="There was an error loading the demographic data."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Demographics</h2>
        <p className="text-sm text-gray-500">Student demographic distribution and diversity metrics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="Active enrollment"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />

        <StatsCard
          title="Regions Represented"
          value={stats.totalRegions}
          subtitle="Provinces & cities"
          icon={MapPin}
          gradient="from-green-500 to-green-600"
        />

        <StatsCard
          title="Scholarship Recipients"
          value={stats.scholarshipRecipients.toLocaleString()}
          subtitle="68% of students"
          icon={GraduationCap}
          gradient="from-yellow-400 to-yellow-500"
          textColor="text-gray-900"
        />

        <StatsCard
          title="International Students"
          value={stats.internationalStudents}
          subtitle="From 8 countries"
          icon={Globe}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <ChartContainer
          title="Geographic Distribution"
          description="Students by region of origin"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="students"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Age Distribution */}
        <ChartContainer
          title="Age Distribution"
          description="Student population by age group"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="age" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Housing Type */}
        <ChartContainer
          title="Housing Type Distribution"
          description="Where students live during the school year"
        >
          <div className="space-y-4">
            {housingData.map((item, idx) => (
              <div key={item.type}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{item.value.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Socioeconomic Status */}
        <ChartContainer
          title="Socioeconomic Distribution"
          description="Student population by family income bracket"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={socioeconomicData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {socioeconomicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scholarship Distribution */}
        <ChartContainer
          title="Scholarship Type Distribution"
          description="Number of students by scholarship category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scholarshipData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis dataKey="type" type="category" stroke="#94a3b8" style={{ fontSize: '12px' }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="students" fill={COLORS.success} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Diversity Metrics Radar */}
        <ChartContainer
          title="Diversity Metrics"
          description="Overall diversity score across different dimensions"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={diversityMetrics}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="metric" 
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
                name="Diversity" 
                dataKey="value" 
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Regional Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Region</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Students</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {locationData.map((region, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-900">{region.region}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    {region.students.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">
                    {region.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ↑ {Math.floor(Math.random() * 5 + 1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Demographics;