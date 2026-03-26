"use client"

import { useState } from "react"
import styles from "./analysis.module.css"

export default function QuestionReview({
  questions,
  answers,
  markedForReview
}) {

  const [activeFilter, setActiveFilter] = useState("all")
  const [expanded, setExpanded] = useState({})

  /* ─────────────────────────────
     🔍 FILTER LOGIC
  ───────────────────────────── */
  const getStatus = (q) => {
    const userAnswer = answers[q.id]

    if (!userAnswer) return "skipped"
    if (userAnswer === q.answer) return "correct"
    return "wrong"
  }

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === "all") return true
    return getStatus(q) === activeFilter
  })

  /* ─────────────────────────────
     📂 TOGGLE EXPAND
  ───────────────────────────── */
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className={styles.reviewContainer}>

      {/* ================= HEADER ================= */}
      <div className={styles.reviewHeader}>
        <h2>📝 Question Review</h2>

        <div className={styles.filterTabs}>
          {["all", "correct", "wrong", "skipped"].map((type) => (
            <button
              key={type}
              className={`${styles.filterBtn} ${
                activeFilter === type ? styles.activeFilter : ""
              }`}
              onClick={() => setActiveFilter(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ================= QUESTIONS ================= */}
      <div className={styles.reviewList}>
        {filteredQuestions.map((q, index) => {

          const userAnswer = answers[q.id]
          const status = getStatus(q)
          const isExpanded = expanded[q.id]
          const isMarked = markedForReview[q.id]

          return (
            <div
              key={q.id}
              className={`${styles.reviewCard} ${styles[status]}`}
            >

              {/* ───── HEADER ───── */}
              <div
                className={styles.reviewTop}
                onClick={() => toggleExpand(q.id)}
              >
                <div>
                  <strong>Q{index + 1}.</strong> {q.question}
                </div>

                <div className={styles.statusBadges}>
                  <span className={`${styles.badge} ${styles[status]}`}>
                    {status}
                  </span>

                  {isMarked && (
                    <span className={styles.reviewMark}>
                      ⚑ Review
                    </span>
                  )}
                </div>
              </div>

              {/* ───── BODY ───── */}
              {isExpanded && (
                <div className={styles.reviewBody}>

                  {/* Answers */}
                  <div className={styles.answerRow}>
                    <p>
                      Your Answer:
                      <strong>
                        {userAnswer || " Not Attempted"}
                      </strong>
                    </p>

                    <p>
                      Correct Answer:
                      <strong>{q.answer}</strong>
                    </p>
                  </div>

                  {/* Options */}
                  <div className={styles.optionsGrid}>
                    {q.options.map((opt) => {
                      const isUser = opt === userAnswer
                      const isCorrect = opt === q.answer

                      return (
                        <div
                          key={opt}
                          className={`${styles.optionItem}
                            ${isCorrect ? styles.correctOption : ""}
                            ${isUser && !isCorrect ? styles.wrongOption : ""}
                          `}
                        >
                          {opt}

                          {isUser && !isCorrect && " ← Your Choice"}
                          {isCorrect && " ← Correct"}
                        </div>
                      )
                    })}
                  </div>

                  {/* AI Explanation */}
                  <div className={styles.explanationBox}>
                    <h4>🧠 Explanation</h4>
                    <p>
                      {status === "correct"
                        ? "Great job! You understood this concept well."
                        : status === "wrong"
                        ? "You made a mistake here. Revisit the concept and avoid similar errors."
                        : "You skipped this question. Try solving similar questions to improve confidence."}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}