import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  ResponsiveContainer
} from "recharts";

const formatYAxisTicks = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value;
};

const formatWithCommas = (value) => {
  // Ensure value is a number
  const numValue = Number(value);
  return isNaN(numValue) ? value : numValue.toLocaleString();
};

// Generate a more diverse color palette
const generateColorPalette = (count) => {
  const baseColors = [
    "#AF0171", "#790252", "#D90429", "#2B2D42", "#8D99AE", 
    "#6A4C93", "#1982C4", "#8AC926", "#FFCA3A", "#FF924C",
    "#FF1654", "#011627", "#4ECDC4", "#FF6B6B", "#4834D4"
  ];
  
  // If more colors are needed than in the base palette, generate additional colors
  while (baseColors.length < count) {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    baseColors.push(`rgb(${r},${g},${b})`);
  }
  
  return baseColors.slice(0, count);
};

function ChartDashboard({ budgetList = [] }) {
  const [chartType, setChartType] = useState("BarChart");

  // Ensure data has both amount and totalSpend
  const processedData = budgetList.map(item => ({
    ...item,
    amount: Number(item.amount || 0),
    totalSpend: Number(item.totalSpend || 0)
  }));

  // Safety check for empty data
  if (processedData.length === 0) {
    return (
      <div className="border rounded-lg p-5 text-center text-gray-500">
        No budget data available
      </div>
    );
  }

  const maxValue = Math.max(
    ...processedData.map((item) => Math.max(item.totalSpend, item.amount))
  );

  const colorPalette = generateColorPalette(processedData.length);

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div className="border rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Activity</h2>
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="BarChart">Bar Chart</option>
          <option value="PieChart">Pie Chart</option>
          <option value="LineChart">Line Chart</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto">
        {chartType === "BarChart" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedData}
              margin={{ top: 7, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, Math.ceil(maxValue * 1.2)]}
                tickFormatter={formatYAxisTicks}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatWithCommas(value),
                  name === "totalSpend" ? "Total Spending" : "Budget Amount"
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "totalSpend" ? "Total Spending" : "Budget Amount"
                }
              />
              <Bar dataKey="totalSpend" stackId="a" name="totalSpend" fill="#AF0171" />
              <Bar dataKey="amount" stackId="a" name="amount" fill="#790252" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "PieChart" && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip
                formatter={(value, name) => [
                  `$${formatWithCommas(value)}`,
                  name
                ]}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle" 
                wrapperStyle={{ paddingLeft: '20px' }}
              />
              <Pie
                data={processedData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                fill="#AF0171"
                paddingAngle={5}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
                labelLine={true}
              >
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorPalette[index % colorPalette.length]} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === "LineChart" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={processedData}
              margin={{ top: 7, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, Math.ceil(maxValue * 1.2)]}
                tickFormatter={formatYAxisTicks}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatWithCommas(value),
                  name === "totalSpend" ? "Total Spending" : "Budget Amount"
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "totalSpend" ? "Total Spending" : "Budget Amount"
                }
              />
              <Line
                type="monotone"
                dataKey="totalSpend"
                name="totalSpend"
                stroke="#AF0171"
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="amount"
                stroke="#790252"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ChartDashboard;