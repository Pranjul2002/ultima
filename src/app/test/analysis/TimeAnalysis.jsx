"use client"

import styles from "./analysis.module.css"
import BarChartBox from "../charts/BarChartBox"
import PieChartBox from "../charts/PieChartBox"

export default function TimeAnalysis({
  filteredQuestions = [],
  questionTimers = {},
  answers = {},
}) {

  /* ================================
     🛑 SAFETY GUARD
  ================================ */
  if (!filteredQuestions || filteredQuestions.length === 0) {
    return (
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>⏱️ Time Intelligence</h3>
        <p className={styles.emptyState}>
          No time data available.
        </p>
      </div>
    )
  }

  /* ================================
     ⏱️ TIME CALCULATIONS
  ================================ */

  const timeData = filteredQuestions.map((q, index) => {
    const timeSpent = questionTimers[q.id] ?? 0
    const isCorrect = answers[q.id] === q.answer

    return {
      name: `Q${index + 1}`,
      time: timeSpent,
      correct: isCorrect,
    }
  })

  const totalTime = timeData.reduce((sum, q) => sum + q.time, 0)
  const avgTime = totalTime / timeData.length

  const correctTimes = timeData.filter(q => q.correct).map(q => q.time)
  const wrongTimes = timeData.filter(q => !q.correct).map(q => q.time)

  const avgCorrectTime =
    correctTimes.length > 0
      ? correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length
      : 0

  const avgWrongTime =
    wrongTimes.length > 0
      ? wrongTimes.reduce((a, b) => a + b, 0) / wrongTimes.length
      : 0

  /* ================================
     📊 CLASSIFICATION
  ================================ */

  const fastQuestions = timeData.filter(q => q.time < avgTime * 0.7)
  const slowQuestions = timeData.filter(q => q.time > avgTime * 1.3)
  const balancedQuestions = timeData.filter(
    q => q.time >= avgTime * 0.7 && q.time <= avgTime * 1.3
  )

  const fastCorrect = fastQuestions.filter(q => q.correct).length
  const fastWrong = fastQuestions.length - fastCorrect

  const slowCorrect = slowQuestions.filter(q => q.correct).length
  const slowWrong = slowQuestions.length - slowCorrect

  /* ================================
     📊 CHART DATA
  ================================ */

  const barData = timeData.map(q => ({
    name: q.name,
    value: q.time,
  }))

  const pieData = [
    { name: "Fast", value: fastQuestions.length },
    { name: "Balanced", value: balancedQuestions.length },
    { name: "Slow", value: slowQuestions.length },
  ]

  /* ================================
     🧠 AI INSIGHTS (ENHANCED)
  ================================ */

  let insights = []

  if (avgCorrectTime < avgWrongTime) {
    insights.push("You solve correct questions faster → strong conceptual clarity.")
  } else {
    insights.push("You spend more time but still get wrong answers → revise fundamentals.")
  }

  if (fastWrong > fastCorrect) {
    insights.push("You rush and make mistakes → slow down for better accuracy.")
  }

  if (slowCorrect > slowWrong) {
    insights.push("Spending time improves accuracy → good analytical depth.")
  }

  if (slowWrong > slowCorrect) {
    insights.push("Overthinking detected → simplify approach and revise basics.")
  }

  if (avgTime < 20) {
    insights.push("Very high speed → risk of careless mistakes.")
  }

  if (avgTime > 60) {
    insights.push("Slow solving speed → improve time management.")
  }

  if (insights.length === 0) {
    insights.push("Balanced time usage — maintain consistency.")
  }

  /* ================================
     📊 BAR HELPER
  ================================ */

  const maxTime = Math.max(...timeData.map(q => q.time), 1)

  const getBarWidth = (value) => {
    return `${(value / maxTime) * 100}%`
  }

  /* ================================
     🚀 UI
  ================================ */

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>⏱️ Time Intelligence</h3>

      {/* ===== SUMMARY ===== */}
      <div className={styles.timeSummary}>
        <div className={styles.timeBox}>
          <span>Total Time</span>
          <strong>{totalTime}s</strong>
        </div>

        <div className={styles.timeBox}>
          <span>Avg Time</span>
          <strong>{avgTime.toFixed(1)}s</strong>
        </div>

        <div className={styles.timeBox}>
          <span>Avg Correct</span>
          <strong>{avgCorrectTime.toFixed(1)}s</strong>
        </div>

        <div className={styles.timeBox}>
          <span>Avg Wrong</span>
          <strong>{avgWrongTime.toFixed(1)}s</strong>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className={styles.chartSection}>

        <div className={styles.chartBox}>
          <h4>📊 Time per Question</h4>
          <BarChartBox data={barData} />
        </div>

        <div className={styles.chartBox}>
          <h4>📈 Speed Distribution</h4>
          <PieChartBox data={pieData} />
        </div>

      </div>

      {/* ===== VISUAL BARS ===== */}
      <div className={styles.timeBars}>
        {timeData.map((q, index) => (
          <div key={index} className={styles.timeRow}>
            <span className={styles.timeLabel}>{q.name}</span>

            <div className={styles.timeBarWrapper}>
              <div
                className={`${styles.timeBar} ${
                  q.correct ? styles.correctBar : styles.wrongBar
                }`}
                style={{ width: getBarWidth(q.time) }}
              />
            </div>

            <span className={styles.timeValue}>{q.time}s</span>
          </div>
        ))}
      </div>

      {/* ===== BEHAVIOR ===== */}
      <div className={styles.behaviorGrid}>
        <div className={styles.behaviorCard}>
          <h4>⚡ Fast Attempts</h4>
          <p>Total: {fastQuestions.length}</p>
          <p>Correct: {fastCorrect}</p>
          <p>Wrong: {fastWrong}</p>
        </div>

        <div className={styles.behaviorCard}>
          <h4>🐢 Slow Attempts</h4>
          <p>Total: {slowQuestions.length}</p>
          <p>Correct: {slowCorrect}</p>
          <p>Wrong: {slowWrong}</p>
        </div>
      </div>

      {/* ===== INSIGHTS ===== */}
      <div className={styles.insightBox}>
        <h4>🧠 Time-Based Insights</h4>
        <ul>
          {insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}