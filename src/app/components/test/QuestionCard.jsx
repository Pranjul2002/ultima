"use client"
import styles from "./QuestionCard.module.css"

export default function QuestionCard({ question, onAnswer, selectedAnswer, index }) {
  const optionLabels = ["A", "B", "C", "D"]

  const handleSelect = (option) => {
    // ✅ Toggle deselect
    onAnswer(question.id, selectedAnswer === option ? null : option)
  }

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>Question {index + 1}</span>
      </div>

      <h3 className={styles.questionText}>{question.question}</h3>

      {/* ✅ role="radiogroup" for accessibility */}
      <div className={styles.optionsContainer} role="radiogroup" aria-label="Answer options">
        {question.options.map((option, i) => (
          <button
            key={option} // ✅ use option string, not index
            role="radio"
            aria-checked={selectedAnswer === option}
            onClick={() => handleSelect(option)}
            className={`${styles.optionButton} ${selectedAnswer === option ? styles.selected : ""}`}
          >
            <span className={styles.optionLabel}>{optionLabels[i]}.</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}