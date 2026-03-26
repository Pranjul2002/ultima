"use client"

import styles from "./analysis.module.css"
import BarChartBox from "../charts/BarChartBox"
import PieChartBox from "../charts/PieChartBox"

export default function TopicAnalysis({
  filteredQuestions,
  answers,
}) {

  /* ================================
     📊 GROUP QUESTIONS BY TOPIC
  ================================ */
  const topicMap = {}

  filteredQuestions.forEach((q) => {
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = {
        total: 0,
        correct: 0,
        wrong: 0,
        attempted: 0,
      }
    }

    topicMap[q.topic].total++

    if (answers[q.id]) {
      topicMap[q.topic].attempted++

      if (answers[q.id] === q.answer) {
        topicMap[q.topic].correct++
      } else {
        topicMap[q.topic].wrong++
      }
    }
  })

  /* ================================
     📈 CONVERT TO ARRAY
  ================================ */
  const topicData = Object.keys(topicMap).map((topic) => {
    const data = topicMap[topic]

    const accuracy =
      data.attempted > 0
        ? (data.correct / data.attempted) * 100
        : 0

    return {
      topic,
      ...data,
      accuracy: parseFloat(accuracy.toFixed(1)),
    }
  })

  /* ================================
     🔥 SORTING
  ================================ */
  const sortedTopics = [...topicData].sort(
    (a, b) => a.accuracy - b.accuracy
  )

  const strongTopics = [...topicData].sort(
    (a, b) => b.accuracy - a.accuracy
  )

  /* ================================
     📊 CHART DATA
  ================================ */

  // Bar chart (accuracy per topic)
  const barData = topicData.map((t) => ({
    name: t.topic,
    value: t.accuracy,
  }))

  // Pie chart (overall attempts distribution)
  const totalCorrect = topicData.reduce((s, t) => s + t.correct, 0)
  const totalWrong = topicData.reduce((s, t) => s + t.wrong, 0)
  const totalSkipped =
    topicData.reduce((s, t) => s + t.total, 0) -
    (totalCorrect + totalWrong)

  const pieData = [
    { name: "Correct", value: totalCorrect },
    { name: "Wrong", value: totalWrong },
    { name: "Skipped", value: totalSkipped },
  ]

  /* ================================
     🧠 AI INSIGHTS
  ================================ */
  const generateInsight = (t) => {
    const acc = t.accuracy

    if (t.attempted === 0) {
      return "Skipped completely → High priority topic."
    }

    if (acc === 100) {
      return "Perfect accuracy → Strong mastery."
    }

    if (acc >= 75) {
      return "Strong topic → Minor improvements needed."
    }

    if (acc >= 50) {
      return "Average → Needs revision."
    }

    if (acc >= 30) {
      return "Weak → Practice required."
    }

    return "Very weak → Rebuild from basics."
  }

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>📚 Topic Intelligence</h3>

      {/* ================= CHART SECTION ================= */}
      <div className={styles.chartSection}>

        <div className={styles.chartBox}>
          <h4>📊 Topic Accuracy Comparison</h4>
          <BarChartBox data={barData} />
        </div>

        <div className={styles.chartBox}>
          <h4>📈 Attempt Distribution</h4>
          <PieChartBox data={pieData} />
        </div>

      </div>

      {/* ================= STRONG TOPICS ================= */}
      <div className={styles.topicSection}>
        <h4 className={styles.sectionTitle}>🔥 Strong Areas</h4>

        {strongTopics.slice(0, 3).map((t) => (
          <div key={t.topic} className={styles.topicCard}>
            <div className={styles.topicHeader}>
              <span>{t.topic}</span>
              <span className={styles.accuracyGreen}>
                {t.accuracy}%
              </span>
            </div>

            <div className={styles.topicBarWrapper}>
              <div
                className={styles.topicBarGreen}
                style={{ width: `${t.accuracy}%` }}
              />
            </div>

            <p className={styles.topicInsight}>
              {generateInsight(t)}
            </p>
          </div>
        ))}
      </div>

      {/* ================= WEAK TOPICS ================= */}
      <div className={styles.topicSection}>
        <h4 className={styles.sectionTitle}>⚠️ Weak Areas</h4>

        {sortedTopics.slice(0, 3).map((t) => (
          <div key={t.topic} className={styles.topicCard}>
            <div className={styles.topicHeader}>
              <span>{t.topic}</span>
              <span className={styles.accuracyRed}>
                {t.accuracy}%
              </span>
            </div>

            <div className={styles.topicBarWrapper}>
              <div
                className={styles.topicBarRed}
                style={{ width: `${t.accuracy}%` }}
              />
            </div>

            <p className={styles.topicInsight}>
              {generateInsight(t)}
            </p>
          </div>
        ))}
      </div>

      {/* ================= FULL BREAKDOWN ================= */}
      <div className={styles.topicTable}>
        <h4 className={styles.sectionTitle}>📊 Full Topic Breakdown</h4>

        {sortedTopics.map((t) => (
          <div key={t.topic} className={styles.topicRow}>
            <div className={styles.topicName}>{t.topic}</div>

            <div className={styles.topicStats}>
              <span>✔ {t.correct}</span>
              <span>❌ {t.wrong}</span>
              <span>🎯 {t.attempted}</span>
            </div>

            <div className={styles.topicBarWrapper}>
              <div
                className={`${styles.topicBar} ${
                  t.accuracy >= 60
                    ? styles.topicBarGreen
                    : styles.topicBarRed
                }`}
                style={{ width: `${t.accuracy}%` }}
              />
            </div>

            <div className={styles.topicAccuracy}>
              {t.accuracy}%
            </div>
          </div>
        ))}
      </div>

      {/* ================= FINAL STRATEGY ================= */}
      <div className={styles.insightBox}>
        <h4>🧠 Topic Strategy</h4>
        <ul>
          <li>Prioritize weakest topics first for maximum score gain.</li>
          <li>Maintain strong topics with revision cycles.</li>
          <li>Convert skipped topics into attempted ones.</li>
          <li>Focus on accuracy before speed in weak areas.</li>
        </ul>
      </div>
    </div>
  )
}