"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import styles from "./charts.module.css"

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"]

export default function PieChartBox({
  title = "Distribution",
  data = [],
  dataKey = "value",
  nameKey = "name",
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

  const total = data.reduce((sum, item) => {
    const val = item[dataKey]
    return sum + (typeof val === "number" ? val : 0)
  }, 0)

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
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
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

      {/* ✅ LEGEND */}
      <div className={styles.chartLegend}>
        {data.map((entry, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length],
              }}
            />
            {entry[nameKey]} ({entry[dataKey] ?? 0})
          </div>
        ))}
      </div>
    </div>
  )
}