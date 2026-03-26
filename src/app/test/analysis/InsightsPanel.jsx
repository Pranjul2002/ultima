"use client"

import styles from "./analysis.module.css"

export default function InsightsPanel({
  accuracy = 0,
  correct = 0,
  wrong = 0,
  skipped = 0,
  total = 1,
  markedForReview = {},
}) {

  /* ─────────────────────────────
     🛡️ SAFE NORMALIZATION
  ───────────────────────────── */
  const safeAccuracy = Number(accuracy) || 0
  const safeTotal = total || 1
  const attempted = correct + wrong

  /* ─────────────────────────────
     📊 DERIVED METRICS
  ───────────────────────────── */
  const attemptRate = (attempted / safeTotal) * 100
  const skipRate = (skipped / safeTotal) * 100
  const errorRate = attempted === 0 ? 0 : (wrong / attempted) * 100
  const reviewCount = Object.values(markedForReview).filter(Boolean).length

  /* ─────────────────────────────
     🧠 PERFORMANCE LEVEL
  ───────────────────────────── */
  let level = ""
  if (safeAccuracy >= 85) level = "Excellent 🚀"
  else if (safeAccuracy >= 70) level = "Strong 💪"
  else if (safeAccuracy >= 50) level = "Average ⚖️"
  else level = "Needs Improvement ❗"

  /* ─────────────────────────────
     🎯 CONFIDENCE SCORE (AI STYLE)
  ───────────────────────────── */
  let confidence = Math.round(
    safeAccuracy * 0.6 +
    attemptRate * 0.3 -
    errorRate * 0.2
  )

  confidence = Math.max(0, Math.min(100, confidence))

  /* ─────────────────────────────
     ⚠️ BEHAVIOR ANALYSIS
  ───────────────────────────── */
  let behavior = ""

  if (attemptRate < 50) {
    behavior = "Low attempt rate → hesitation or time pressure."
  } else if (errorRate > 50) {
    behavior = "High incorrect rate → guesswork or weak concepts."
  } else if (skipRate > 30) {
    behavior = "Too many skipped questions → confidence gap."
  } else {
    behavior = "Balanced attempt strategy with controlled risk."
  }

  /* ─────────────────────────────
     💡 RECOMMENDATIONS
  ───────────────────────────── */
  const recommendations = []

  if (safeAccuracy < 60) {
    recommendations.push("Strengthen fundamentals before full tests.")
  }

  if (errorRate > 40) {
    recommendations.push("Reduce guesswork. Focus on accuracy-first solving.")
  }

  if (skipRate > 25) {
    recommendations.push("Attempt easy questions first to maximize score.")
  }

  if (reviewCount > 3) {
    recommendations.push("Too many reviews → improve decision confidence.")
  }

  if (safeAccuracy > 80 && attemptRate > 80) {
    recommendations.push("Move to higher difficulty problems.")
  }

  if (recommendations.length === 0) {
    recommendations.push("Maintain consistency and improve speed gradually.")
  }

  /* ─────────────────────────────
     🚀 STRATEGY
  ───────────────────────────── */
  let strategy = ""

  if (safeAccuracy < 50) {
    strategy = "Revise concepts → Practice topic-wise → Attempt mock tests."
  } else if (safeAccuracy < 75) {
    strategy = "Practice mixed questions + deep mistake analysis."
  } else {
    strategy = "Optimize speed + attempt advanced problems."
  }

  /* ─────────────────────────────
     🎨 RENDER
  ───────────────────────────── */
  return (
    <div className={styles.insightsPanel}>

      <h3 className={styles.sectionTitle}>🧠 AI Performance Insights</h3>

      {/* PERFORMANCE LEVEL */}
      <div className={styles.insightCard}>
        <h4>📊 Performance Level</h4>
        <p>
          You are performing at a <strong>{level}</strong> level with an accuracy of{" "}
          <strong>{safeAccuracy.toFixed(1)}%</strong>.
        </p>
      </div>

      {/* CONFIDENCE */}
      <div className={styles.insightCard}>
        <h4>🎯 Confidence Score</h4>
        <p>
          Your confidence is <strong>{confidence}%</strong>, based on accuracy,
          attempts, and mistakes.
        </p>
      </div>

      {/* BEHAVIOR */}
      <div className={styles.insightCard}>
        <h4>⚠️ Behavior Analysis</h4>
        <p>{behavior}</p>
      </div>

      {/* METRICS */}
      <div className={styles.insightCard}>
        <h4>📈 Attempt Breakdown</h4>
        <ul>
          <li>Attempt Rate: <strong>{attemptRate.toFixed(1)}%</strong></li>
          <li>Error Rate: <strong>{errorRate.toFixed(1)}%</strong></li>
          <li>Skip Rate: <strong>{skipRate.toFixed(1)}%</strong></li>
          <li>Marked for Review: <strong>{reviewCount}</strong></li>
        </ul>
      </div>

      {/* RECOMMENDATIONS */}
      <div className={styles.insightCard}>
        <h4>💡 Smart Recommendations</h4>
        <ul>
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* STRATEGY */}
      <div className={styles.insightCard}>
        <h4>🚀 Suggested Strategy</h4>
        <p>{strategy}</p>
      </div>

    </div>
  )
}