"use client"
import styles from "./QuestionPalette.module.css"

export default function QuestionPalette({
  filteredQuestions,
  answers,
  visited,
  currentPage,
  setCurrentPage,
}) {
  const total = filteredQuestions.length
  const answeredCount = filteredQuestions.filter((q) => answers[q.id]).length
  const visitedCount = filteredQuestions.filter((q) => visited[q.id]).length
  const notVisitedCount = total - visitedCount
  const answeredPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0

  const legend = [
    { label: "Not Visited", cls: styles.notVisited },
    { label: "Visited",     cls: styles.visited },
    { label: "Answered",    cls: styles.answered },
  ]

  return (
    <div className={styles.paletteSide}>
      <h3 className={styles.paletteTitle}>Question Palette</h3>

      {/* Legend */}
      <div className={styles.paletteLegend}>
        {legend.map(({ label, cls }) => (
          <div key={label} className={styles.legendRow}>
            <span className={`${styles.legendBox} ${cls}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.paletteGrid}>
        {filteredQuestions.map((q, index) => {
          const isAnswered = !!answers[q.id]
          const isVisited  = !!visited[q.id]
          return (
            <button
              key={q.id}
              aria-label={`Go to question ${index + 1}`}
              aria-current={index === currentPage ? "true" : undefined}
              onClick={() => setCurrentPage(index)}
              className={`${styles.paletteBtn}
                ${isAnswered ? styles.answered : isVisited ? styles.visited : styles.notVisited}
                ${index === currentPage ? styles.currentQuestion : ""}
              `}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {/* ✅ Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${answeredPercent}%` }}
        />
      </div>
      <p className={styles.progressLabel}>{answeredPercent}% completed</p>

      {/* Stats */}
      <div className={styles.paletteStats}>
        <div><span className={styles.statDot + " " + styles.answered} /> Answered: <strong>{answeredCount}</strong></div>
        <div><span className={styles.statDot + " " + styles.visited}  /> Visited: <strong>{visitedCount}</strong></div>
        <div><span className={styles.statDot + " " + styles.notVisited} /> Not Visited: <strong>{notVisitedCount}</strong></div>
      </div>
    </div>
  )
}