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
  variant = "default",
}) {

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

            {/* ✅ Dynamic Gradients */}
            <defs>
              {data.map((entry, index) => {
                let colorStart, colorEnd

                // 🎯 PERFORMANCE COLORS
                if (variant === "performance") {
                  const COLOR_MAP = {
                    Correct: ["#22c55e", "#86efac"],
                    Wrong: ["#ef4444", "#fca5a5"],
                    Skipped: ["#f59e0b", "#fcd34d"],
                  }

                  ;[colorStart, colorEnd] =
                    COLOR_MAP[entry.name] || ["#3b82f6", "#93c5fd"]
                }

                // ⏱️ TIME COLORS
                else if (variant === "time") {
                  const COLOR_MAP = {
                    fast: ["#3b82f6", "#93c5fd"],
                    balanced: ["#22c55e", "#86efac"],
                    slow: ["#f59e0b", "#fcd34d"],
                  }

                  ;[colorStart, colorEnd] =
                    COLOR_MAP[entry.type] || ["#64748b", "#cbd5f5"]
                }
                else if (variant === "topic") {
                  const MAP = {
                    strong: ["#22c55e", "#86efac"],   // green
                    average: ["#f59e0b", "#fcd34d"],  // yellow
                    weak: ["#ef4444", "#fca5a5"],     // red
                  }

                  ;[colorStart, colorEnd] =
                    MAP[entry.type] || ["#3b82f6", "#93c5fd"]
                }
                // fallback
                else {
                  colorStart = "#3b82f6"
                  colorEnd = "#93c5fd"
                }

                return (
                  <linearGradient
                    key={index}
                    id={`barGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={colorStart} />
                    <stop offset="100%" stopColor={colorEnd} />
                  </linearGradient>
                )
              })}
            </defs>

            {/* ✅ Bars */}
            <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}