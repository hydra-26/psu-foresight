// src/pages/Forecasting.js
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Target, AlertCircle, Activity } from "lucide-react";
import { 
  StatsCard, 
  ChartContainer, 
  LoadingSpinner, 
  EmptyState 
} from "../components/shared";
import { COLORS } from "../config/constants";

const Forecasting = ({ data, isLoading, error }) => {
  const [forecastYears, setForecastYears] = useState(3);

  // Historical and forecasted data
  const enrollmentForecast = useMemo(() => [
    { year: "2019", actual: 18500, predicted: null, lower: null, upper: null },
    { year: "2020", actual: 19200, predicted: null, lower: null, upper: null },
    { year: "2021", actual: 19800, predicted: null, lower: null, upper: null },
    { year: "2022", actual: 20300, predicted: null, lower: null, upper: null },
    { year: "2023", actual: 20800, predicted: null, lower: null, upper: null },
    { year: "2024", actual: 21500, predicted: 21500, lower: 21200, upper: 21800 },
    { year: "2025", actual: null, predicted: 22300, lower: 21800, upper: 22800 },
    { year: "2026", actual: null, predicted: 23100, lower: 22400, upper: 23800 },
    { year: "2027", actual: null, predicted: 23900, lower: 23000, upper: 24800 },
    { year: "2028", actual: null, predicted: 24700, lower: 23500, upper: 25900 }
  ], []);

  const collegeForecast = useMemo(() => [
    { 
      college: "COE", 
      current: 4500, 
      forecast2025: 4725, 
      forecast2026: 4961, 
      growth: 5.0 
    },
    { 
      college: "CAS", 
      current: 3800, 
      forecast2025: 3952, 
      forecast2026: 4110, 
      growth: 4.0 
    },
    { 
      college: "CBA", 
      current: 3200, 
      forecast2025: 3360, 
      forecast2026: 3528, 
      growth: 5.0 
    },
    { 
      college: "CAFNR", 
      current: 2800, 
      forecast2025: 2912, 
      forecast2026: 3028, 
      growth: 4.0 
    },
    { 
      college: "COED", 
      current: 2400, 
      forecast2025: 2520, 
      forecast2026: 2646, 
      growth: 5.0 
    },
    { 
      college: "CON", 
      current: 1800, 
      forecast2025: 1890, 
      forecast2026: 1985, 
      growth: 5.0 
    }
  ], []);

  const trendAnalysis = useMemo(() => [
    { 
      year: "2020", 
      enrollment: 19200, 
      trend: 19100, 
      seasonal: 100 
    },
    { 
      year: "2021", 
      enrollment: 19800, 
      trend: 19900, 
      seasonal: -100 
    },
    { 
      year: "2022", 
      enrollment: 20300, 
      trend: 20700, 
      seasonal: -400 
    },
    { 
      year: "2023", 
      enrollment: 20800, 
      trend: 21500, 
      seasonal: -700 
    },
    { 
      year: "2024", 
      enrollment: 21500, 
      trend: 22300, 
      seasonal: -800 
    }
  ], []);

  const capacityAnalysis = useMemo(() => [
    { year: "2024", enrollment: 21500, capacity: 25000, utilization: 86 },
    { year: "2025", enrollment: 22300, capacity: 25000, utilization: 89 },
    { year: "2026", enrollment: 23100, capacity: 25000, utilization: 92 },
    { year: "2027", enrollment: 23900, capacity: 25000, utilization: 96 },
    { year: "2028", enrollment: 24700, capacity: 25000, utilization: 99 }
  ], []);

  const stats = useMemo(() => ({
    projectedGrowth: 3.7,
    forecastedEnrollment: 22300,
    confidenceLevel: 85,
    capacityUtilization: 89
  }), []);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading forecasting models..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Failed to Load Forecasting Data"
        description="There was an error loading the enrollment forecasts."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enrollment Forecasting</h2>
        <p className="text-sm text-gray-500">
          Predictive analytics and enrollment projections using historical trends
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Projected Growth"
          value={`${stats.projectedGrowth}%`}
          subtitle="Annual growth rate"
          icon={TrendingUp}
          gradient="from-green-500 to-green-600"
        />

        <StatsCard
          title="2025 Forecast"
          value={stats.forecastedEnrollment.toLocaleString()}
          subtitle="Predicted enrollment"
          icon={Target}
          gradient="from-blue-500 to-blue-600"
        />

        <StatsCard
          title="Confidence Level"
          value={`${stats.confidenceLevel}%`}
          subtitle="Model accuracy"
          icon={Activity}
          gradient="from-purple-500 to-purple-600"
        />

        <StatsCard
          title="Capacity Utilization"
          value={`${stats.capacityUtilization}%`}
          subtitle="Current capacity usage"
          icon={AlertCircle}
          gradient="from-yellow-400 to-yellow-500"
          textColor="text-gray-900"
        />
      </div>

      {/* Alert Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-800 mb-1">
              Capacity Warning
            </h4>
            <p className="text-sm text-yellow-700">
              Projected enrollment for 2027 will reach 96% capacity. Consider infrastructure 
              expansion or enrollment caps to maintain quality education standards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <ChartContainer
        title="Enrollment Forecast (2019-2028)"
        description="Historical data with projected enrollment and confidence intervals"
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={enrollmentForecast}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="lower" 
              stroke="none" 
              fill="#e0e0e0" 
              fillOpacity={0.3}
              name="Lower Bound"
            />
            <Area 
              type="monotone" 
              dataKey="upper" 
              stroke="none" 
              fill="#e0e0e0" 
              fillOpacity={0.3}
              name="Upper Bound"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke={COLORS.primary}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 5 }}
              name="Actual Enrollment"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke={COLORS.secondary}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: COLORS.secondary, r: 5 }}
              name="Forecasted Enrollment"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* College-wise Forecast */}
        <ChartContainer
          title="College-wise Enrollment Forecast"
          description="Projected enrollment by college for 2025-2026"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collegeForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="college" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="current" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Current (2024)" />
              <Bar dataKey="forecast2025" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Forecast 2025" />
              <Bar dataKey="forecast2026" fill={COLORS.success} radius={[4, 4, 0, 0]} name="Forecast 2026" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Capacity Utilization */}
        <ChartContainer
          title="Capacity Utilization Forecast"
          description="Projected capacity usage over next 5 years"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={capacityAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="utilization" 
                stroke={COLORS.danger}
                strokeWidth={3}
                dot={{ fill: COLORS.danger, r: 6 }}
                name="Utilization %"
              />
              <Line 
                type="monotone" 
                dataKey={95} 
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Critical Threshold (95%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Trend Analysis */}
      <ChartContainer
        title="Trend Decomposition"
        description="Enrollment trends separated into underlying patterns and seasonal variations"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="enrollment" 
              stroke={COLORS.primary}
              strokeWidth={3}
              name="Actual Enrollment"
            />
            <Line 
              type="monotone" 
              dataKey="trend" 
              stroke={COLORS.success}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Trend Line"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* College Forecast Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          College Enrollment Projections
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">College</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Current (2024)</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Forecast 2025</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Forecast 2026</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {collegeForecast.map((college, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{college.college}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    {college.current.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-blue-600 font-semibold">
                    {college.forecast2025.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                    {college.forecast2026.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      +{college.growth}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {collegeForecast.reduce((sum, c) => sum + c.current, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-blue-600">
                  {collegeForecast.reduce((sum, c) => sum + c.forecast2025, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600">
                  {collegeForecast.reduce((sum, c) => sum + c.forecast2026, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  +{stats.projectedGrowth}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Forecasting Model</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Method:</strong> Time Series Analysis with Linear Regression</p>
            <p><strong>Historical Data:</strong> 2019-2024 (6 years)</p>
            <p><strong>Confidence Interval:</strong> 85%</p>
            <p><strong>Last Updated:</strong> November 2024</p>
            <p className="mt-4 text-xs opacity-90">
              The forecast model uses historical enrollment trends, demographic data, 
              and capacity constraints to project future enrollment numbers.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <ul className="space-y-2 text-sm">
            <li>• Steady growth of 3.7% annually expected through 2028</li>
            <li>• All colleges showing positive enrollment trends</li>
            <li>• Capacity will reach critical levels by 2027</li>
            <li>• COE and CBA showing strongest growth patterns</li>
            <li>• Infrastructure expansion recommended by 2026</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;