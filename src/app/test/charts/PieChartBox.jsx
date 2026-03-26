"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import styles from "./charts.module.css"

// 🎨 Color Config
const COLOR_CONFIG = {
  performance: {
    Correct: "#22c55e",
    Wrong: "#ef4444",
    Skipped: "#f59e0b",
  },
  time: {
    fast: "#0ea5e9",
    balanced: "#22c55e",
    slow: "#f97316",
  },
}

export default function PieChartBox({
  title = "Distribution",
  data = [],
  dataKey = "value",
  nameKey = "name",
  variant = "default", // ✅ FIXED
}) {

  // ✅ SAFETY CHECK
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartCard}>
        <h4 className={styles.chartTitle}>{title}</h4>
        <div className={styles.noData}>No data available</div>
      </div>
    )
  }

  // ✅ Total for percentage
  const total = data.reduce((sum, item) => {
    const val = item[dataKey]
    return sum + (typeof val === "number" ? val : 0)
  }, 0)

  // ✅ Function to get color (used in both chart + legend)
  const getColor = (entry) => {
    if (variant === "performance") {
      return (
        COLOR_CONFIG.performance[entry[nameKey]] ||
        "#3b82f6"
      )
    }

    if (variant === "time") {
      return (
        COLOR_CONFIG.time[entry.type] ||
        "#3b82f6"
      )
    }

    return "#3b82f6"
  }

  return (
    <div className={styles.chartCard}>
      <h4 className={styles.chartTitle}>{title}</h4>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              outerRadius={90}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getColor(entry)} // ✅ unified color logic
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const safeValue =
                  typeof value === "number" ? value : 0

                const percent =
                  total > 0
                    ? ((safeValue / total) * 100).toFixed(1)
                    : 0

                return [`${safeValue} (${percent}%)`, name]
              }}
              contentStyle={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ LEGEND (FIXED COLORS) */}
      <div className={styles.chartLegend}>
        {data.map((entry, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{
                backgroundColor: getColor(entry), // ✅ FIXED
              }}
            />
            {entry[nameKey]} ({entry[dataKey] ?? 0})
          </div>
        ))}
      </div>
    </div>
  )
}