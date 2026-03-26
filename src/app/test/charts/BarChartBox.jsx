"use client"

import {
  ResponsiveContainer,
  BarChart,
  Cell,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import styles from "./charts.module.css"

export default function BarChartBox({
  title = "Chart",
  data = [],
  dataKey = "value",
  xKey = "name",
}) {

  // Safety check
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartCard}>
        <h4 className={styles.chartTitle}>{title}</h4>
        <div className={styles.noData}>No data available</div>
      </div>
    )
  }

  return (
    <div className={styles.chartCard}>
      <h4 className={styles.chartTitle}>{title}</h4>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            {/* X Axis */}
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => [`${value}`, "Count"]}
              contentStyle={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />

            {/* Bars */}
            <Bar
              dataKey={dataKey}
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}