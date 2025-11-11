// src/components/shared/StatsCard.js
import React from 'react';

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient = "from-blue-500 to-blue-600",
  textColor = "text-white"
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-md p-6 ${textColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-2">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/shared/LoadingSpinner.js
export const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

// src/components/shared/EmptyState.js
export const EmptyState = ({ 
  icon: Icon, 
  title = "No Data Available", 
  description = "There is no data to display at the moment.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
      {action && action}
    </div>
  );
};

// src/components/shared/ErrorBoundary.js
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// src/components/shared/ErrorAlert.js
export const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-xl">❌</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-1">Error</h4>
          <p className="text-sm text-red-700">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// src/components/shared/ChartContainer.js
export const ChartContainer = ({ title, description, children, action }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {action && action}
      </div>
      {children}
    </div>
  );
};

// src/components/shared/DataTable.js
export const DataTable = ({ columns, data, emptyMessage = "No data available" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`text-left py-3 px-4 text-sm font-semibold text-gray-700 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50 transition">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`py-3 px-4 text-sm ${col.className || ''}`}>
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export all components
export default {
  StatsCard,
  LoadingSpinner,
  EmptyState,
  ErrorBoundary,
  ErrorAlert,
  ChartContainer,
  DataTable
};