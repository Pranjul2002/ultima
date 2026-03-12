"use client";
import styles from "./QuestionCard.module.css";
export default function QuestionCard({ question, onAnswer, selectedAnswer, index }) {

  const handleSelect = (option) => {
    onAnswer(question.id, option);
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className={styles.questionCard}>

      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>Question {index + 1}</span>
      </div>

      <h3 className={styles.questionText}>{question.question}</h3>

      <div className={styles.optionsContainer}>
        {question.options.map((option, i) => (

          <button
            key={i}
            onClick={() => handleSelect(option)}
            className={`${styles.optionButton}
            ${selectedAnswer === option ? styles.selected : ""}`}
          >
            <span className={styles.optionLabel}>
              {optionLabels[i]}.
            </span>

            <span>{option}</span>

          </button>

        ))}
      </div>

    </div>
  );
}