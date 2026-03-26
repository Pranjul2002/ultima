"use client"

import styles from "./ResultPage.module.css"

import { analyzeTest } from "../utils/analysisHelpers"

import PerformanceSummary from "../analysis/PerformanceSummary"
import TopicAnalysis from "../analysis/TopicAnalysis"
import TimeAnalysis from "../analysis/TimeAnalysis"
import InsightsPanel from "../analysis/InsightsPanel"
import QuestionReview from "../analysis/QuestionReview"

export default function ResultPage({
  filteredQuestions,
  answers,
  markedForReview,
  questionTimers,
  config,
  router,
}) {
  /* ================= 🧠 CENTRAL ANALYSIS ================= */
  const analysis = analyzeTest({
    questions: filteredQuestions,
    answers,
    markedForReview,
    questionTimers,
    config,
  })
const totalQuestions = filteredQuestions.length

let correct = 0
let wrong = 0
let skipped = 0

filteredQuestions.forEach((q) => {
  const userAns = answers[q.id]

  if (!userAns) skipped++
  else if (userAns === q.answer) correct++
  else wrong++
})

const accuracy =
  totalQuestions === 0
    ? 0
    : (correct / totalQuestions) * 100
  /* ================= RENDER ================= */
  return (
    <div className={styles.resultPage}>

      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <h1>Test Analysis</h1>
        <p className={styles.subText}>
          Smart performance insights & improvement roadmap
        </p>
      </div>

      {/* ================= PERFORMANCE SUMMARY ================= */}
      <PerformanceSummary
        correct={analysis.correct}
        wrong={analysis.wrong}
        skipped={analysis.skipped}
        total={analysis.total}
        score={analysis.score}
      />

      {/* ================= CHART SECTION ================= */}
      <div className={styles.gridSection}>

        {/* 🔥 Topic Analysis */}
        <div className={styles.card}>
          <h3>Topic-wise Performance</h3>
          <TopicAnalysis
            filteredQuestions={filteredQuestions}
            answers={answers}
          />
        </div>

        {/* 🔥 Time Analysis */}
        <div className={styles.card}>
          <h3>Time Analysis</h3>
          <TimeAnalysis
            filteredQuestions={filteredQuestions}   
            questionTimers={questionTimers}
            answers={answers}
          />
        </div>

      </div>

      {/* ================= INSIGHTS ================= */}
      <div className={styles.cardFull}>
        <h3>AI Performance Insights</h3>
        <InsightsPanel
            accuracy={accuracy}
            correct={correct}
            wrong={wrong}
            skipped={skipped}
            total={totalQuestions}
            markedForReview={markedForReview}
          />
      </div>

      {/* ================= QUESTION REVIEW ================= */}
      <div className={styles.cardFull}>
        <h3>Detailed Question Review</h3>
        <QuestionReview
          questions={filteredQuestions}
          answers={answers}
          markedForReview={markedForReview}
        />
      </div>

      {/* ================= FOOTER ================= */}
      <div className={styles.footer}>
        <button
          className={styles.primaryBtn}
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>

        <button
          className={styles.secondaryBtn}
          onClick={() => window.location.reload()}
        >
          Retake Test
        </button>
      </div>
    </div>
  )
}