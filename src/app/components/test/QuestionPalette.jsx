"use client";

import styles from "./QuestionPalette.module.css";

export default function QuestionPalette({
  filteredQuestions,
  answers,
  visited,
  currentPage,
  setCurrentPage
}) {
  const answeredCount = filteredQuestions.filter(q => answers[q.id]).length;
  const visitedCount = filteredQuestions.filter(q => visited[q.id]).length;
  const notVisitedCount = filteredQuestions.length - visitedCount;
  return (
    <div className={styles.paletteSide}>

      <h3>Question Palette</h3>

      {/* Legend */}
      <div className={styles.paletteLegend}>

        <div>
          <span className={`${styles.legendBox} ${styles.notVisited}`}></span>
          Not Visited
        </div>

        <div>
          <span className={`${styles.legendBox} ${styles.visited}`}></span>
          Visited
        </div>

        <div>
          <span className={`${styles.legendBox} ${styles.answered}`}></span>
          Answered
        </div>

      </div>

      {/* Question Grid */}
      <div className={styles.paletteGrid}>

        {filteredQuestions.map((q, index) => {

          const isAnswered = answers[q.id];
          const isVisited = visited[q.id];

          return (

            <button
              key={q.id}
              className={`${styles.paletteBtn}

              ${isAnswered
                ? styles.answered
                : isVisited
                ? styles.visited
                : styles.notVisited}

              ${index === currentPage
                ? styles.currentQuestion
                : ""}
              `}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>

          );

        })}

      </div>

      {/* Stats */}

      <div className={styles.paletteStats}>

        <div>
          Answered: {answeredCount}
        </div>

        <div>
          Visited: {visitedCount}
        </div>

        <div>
          Not Visited: {notVisitedCount}
        </div>

      </div>

    </div>
  );
}