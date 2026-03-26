"use client"

import styles from "./analysis.module.css"
import BarChartBox from "../charts/BarChartBox"
import PieChartBox from "../charts/PieChartBox"

export default function PerformanceSummary({
  correct = 0,
  wrong = 0,
  skipped = 0,
  total = 0,
  score = 0,
}) {

  /* ─────────────────────────────
     📊 SAFE CALCULATIONS
  ───────────────────────────── */
  const accuracy = total ? (correct / total) * 100 : 0
  const attempted = correct + wrong
  const attemptRate = total ? (attempted / total) * 100 : 0

  const correctPercent = total ? (correct / total) * 100 : 0
  const wrongPercent = total ? (wrong / total) * 100 : 0
  const skippedPercent = total ? (skipped / total) * 100 : 0

  /* ─────────────────────────────
     📊 CHART DATA (SAFE)
  ───────────────────────────── */
  const barData = [
    { name: "Correct", value: correct || 0 },
    { name: "Wrong", value: wrong || 0 },
    { name: "Skipped", value: skipped || 0 },
  ]

  const pieData = [
    { name: "Correct", value: correct || 0 },
    { name: "Wrong", value: wrong || 0 },
    { name: "Skipped", value: skipped || 0 },
  ]

  /* ─────────────────────────────
     🧠 PERFORMANCE LEVEL
  ───────────────────────────── */
  let level = ""
  let levelClass = ""

  if (accuracy >= 85) {
    level = "Excellent 🚀"
    levelClass = styles.excellent
  } else if (accuracy >= 70) {
    level = "Strong 💪"
    levelClass = styles.strong
  } else if (accuracy >= 50) {
    level = "Average ⚖️"
    levelClass = styles.average
  } else {
    level = "Needs Improvement ❗"
    levelClass = styles.weak
  }

  /* ─────────────────────────────
     🧠 SMART INSIGHTS
  ───────────────────────────── */
  const insights = []

  if (attemptRate < 50) {
    insights.push("Low attempt rate → You are skipping too many questions.")
  }

  if (wrong > correct) {
    insights.push("Accuracy issue → Reduce guesswork and improve concept clarity.")
  }

  if (accuracy > 80) {
    insights.push("Great accuracy → Now push for speed & advanced questions.")
  }

  if (accuracy >= 60 && accuracy <= 80) {
    insights.push("Good base → Focus on weak topics to reach top performance.")
  }

  if (skipped > total * 0.3) {
    insights.push("High skipped count → Work on confidence & time management.")
  }

  if (insights.length === 0) {
    insights.push("Balanced performance — keep practicing consistently.")
  }

  /* ─────────────────────────────
     🎯 TAGLINE
  ───────────────────────────── */
  const getTagline = () => {
    if (accuracy >= 85) return "You're exam-ready! 🎯"
    if (accuracy >= 70) return "Strong performance, keep pushing 🚀"
    if (accuracy >= 50) return "Decent attempt, needs refinement ⚡"
    return "Foundation needs improvement 📚"
  }

  /* ─────────────────────────────
     🚀 UI
  ───────────────────────────── */
  return (
    <div className={styles.performanceSummary}>

      {/* ================= HEADER ================= */}
      <div className={styles.summaryHeader}>
        <h2>📊 Performance Summary</h2>
        <span className={`${styles.performanceBadge} ${levelClass}`}>
          {level}
        </span>
      </div>

      {/* ================= SCORE ================= */}
      <div className={styles.scoreCard}>
        <h3>Your Score</h3>
        <p className={styles.scoreValue}>
          {score} / {total}
        </p>

        <p className={styles.accuracyText}>
          Accuracy: <strong>{accuracy.toFixed(1)}%</strong>
        </p>

        <p className={styles.tagline}>
          {getTagline()}
        </p>
      </div>

      {/* ================= CHARTS ================= */}
      <div className={styles.chartSection}>

        <div className={styles.chartBox}>
          <h4>📊 Performance Breakdown</h4>
          <BarChartBox
            data={barData}
            xKey="name"      // ✅ IMPORTANT FIX
            dataKey="value"
          />
        </div>

        <div className={styles.chartBox}>
          <h4>📈 Distribution</h4>
          <PieChartBox
            data={pieData}
            dataKey="value"
            nameKey="name"
          />
        </div>

      </div>


      {/* ================= METRICS ================= */}
      <div className={styles.metricGrid}>

        <div className={`${styles.metricCard} ${styles.correct}`}>
          <h4>✔ Correct</h4>
          <p>{correct}</p>
        </div>

        <div className={`${styles.metricCard} ${styles.wrong}`}>
          <h4>❌ Wrong</h4>
          <p>{wrong}</p>
        </div>

        <div className={`${styles.metricCard} ${styles.skipped}`}>
          <h4>⏭ Skipped</h4>
          <p>{skipped}</p>
        </div>

      </div>

      {/* ================= PROGRESS ================= */}
      <div className={styles.progressSection}>

        <div className={styles.progressItem}>
          <span>Accuracy</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <span>{accuracy.toFixed(1)}%</span>
        </div>

        <div className={styles.progressItem}>
          <span>Attempt Rate</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFillAlt}
              style={{ width: `${attemptRate}%` }}
            />
          </div>
          <span>{attemptRate.toFixed(1)}%</span>
        </div>

      </div>

      {/* ================= INSIGHTS ================= */}
      <div className={styles.quickInsight}>
        <h4>🧠 Smart Insights</h4>

        <ul>
          {insights.map((ins, i) => (
            <li key={i}>{ins}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}