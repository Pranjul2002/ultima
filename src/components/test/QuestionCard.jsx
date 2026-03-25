"use client"
import styles from "./QuestionCard.module.css"

export default function QuestionCard({ question, onAnswer, selectedAnswer, index, isLocked, isMarked, onMarkReview }) {
  const optionLabels = ["A", "B", "C", "D"]

  const handleSelect = (option) => {
    if (isLocked) return // ✅ prevent click after time up
    onAnswer(question.id, selectedAnswer === option ? null : option)
  }

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>Question {index + 1}</span>
      </div>

      <h3 className={styles.questionText}>{question.question}</h3>

      {/* ✅ Step 6: Show message when locked */}
      {isLocked && (
        <p className={styles.timeUpText}>This question is locked. You cannot answer this question.</p>
      )}

      <div
        className={styles.optionsContainer}
        role="radiogroup"
        aria-label="Answer options"
      >
        {question.options.map((option, i) => (
          <button
            key={option}
            role="radio"
            aria-checked={selectedAnswer === option}
            onClick={() => handleSelect(option)}
            disabled={isLocked} // ✅ Step 5: disable buttons
            className={`${styles.optionButton} ${
              selectedAnswer === option ? styles.selected : ""
            } ${isLocked ? styles.locked : ""}`} // optional styling
          >
            <span className={styles.optionLabel}>{optionLabels[i]}.</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onMarkReview(question.id)}
        className={`${styles.reviewButton} ${isMarked ? styles.marked : ""}`}
      >
        {isMarked ? "Unmark Review" : "Mark for Review"}
      </button>
    </div>
  )
}