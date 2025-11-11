// src/config/constants.js

// Color palette
export const COLORS = {
  primary: "#003366",
  secondary: "#fbbf24",
  success: "#10b981",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  blue: "#3b82f6",
  orange: "#f97316"
};

// Chart colors array
export const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.danger,
  COLORS.purple,
  COLORS.pink
];

// Year levels
export const YEAR_LEVELS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year'
];

// Student status options
export const STUDENT_STATUS = {
  NEW: 'New',
  CONTINUING: 'Continuing',
  TRANSFEREE: 'Transferee',
  RETURNEE: 'Returnee'
};

// Semester options
export const SEMESTERS = {
  FIRST: '1st Semester',
  SECOND: '2nd Semester',
  SUMMER: 'Summer'
};

// Menu items configuration
export const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard Overview", icon: "LayoutDashboard" },
  { id: "enrollment", label: "Enrollment Data", icon: "Users" },
  { id: "graduation", label: "Graduation Data", icon: "GraduationCap" },
  { id: "faculty", label: "Faculty Data", icon: "Users" },
  { id: "demographics", label: "Demographics", icon: "MapPin" },
  { id: "forecasting", label: "Forecasting", icon: "TrendingUp" }
];

// Chart configuration
export const CHART_CONFIG = {
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "#f0f0f0",
    vertical: false
  },
  axis: {
    stroke: "#94a3b8",
    style: { fontSize: '12px' }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '12px'
    }
  }
};

export default {
  COLORS,
  CHART_COLORS,
  YEAR_LEVELS,
  STUDENT_STATUS,
  SEMESTERS,
  MENU_ITEMS,
  CHART_CONFIG
};