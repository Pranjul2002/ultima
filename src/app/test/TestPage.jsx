"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import TestConfig from "../components/test/TestConfig"
import Timer from "../components/test/Timer"
import QuestionCard from "../components/test/QuestionCard"
import QuestionPalette from "../components/test/QuestionPalette"
import questionsData from "../../data/questions"
import styles from "./page.module.css"

export default function TestPage() {
  const [completedPages, setCompletedPages] = useState({})
  const [numQuestions, setNumQuestions] = useState(10)
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [negativeMarking, setNegativeMarking] = useState(false)
  const calculatedTime = numQuestions * timePerQuestion
  const [lockedQuestions, setLockedQuestions] = useState({})
  const searchParams = useSearchParams()
  const router = useRouter()
  const classParam = searchParams.get("class")
  const subjectParam = searchParams.get("subject")
  const topicParam = searchParams.get("topic")
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [config, setConfig] = useState(null)
  const [autoStartConfig, setAutoStartConfig] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [visited, setVisited] = useState({})
  const [isFinished, setIsFinished] = useState(false)
  const [overallTime, setOverallTime] = useState(900)
  const [markedForReview, setMarkedForReview] = useState({})
  const [questionTimers, setQuestionTimers] = useState({})
  /* ── Fullscreen ── */
  const enterFullscreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) elem.requestFullscreen()
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen()
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
  }

  /* ── Auto config from URL params ── */
  useEffect(() => {
    if (classParam || subjectParam || topicParam) {
      setAutoStartConfig({
        class: classParam || "",
        subject: subjectParam || "",
        topic: topicParam || "",
        duration: timePerQuestion,
        questionsPerPage: 1,
      })
    }
  }, [classParam, subjectParam, topicParam])
  useEffect(() => {
    if (!config || isFinished) return

    const timer = setInterval(() => {
      setOverallTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [config, isFinished])
  /* ── Filter questions ── */
  const filteredQuestions = useMemo(() => {
    return questionsData
      .filter((q) => {
        return (
          (!config?.class || q.class?.toString() === config.class) &&
          (!config?.subject || q.subject?.toLowerCase() === config?.subject?.toLowerCase()) &&
          (!config?.topic || q.topic?.toLowerCase() === config?.topic?.toLowerCase())
        )
      })
      .slice(0, config?.numQuestions || 10)
  }, [config])

  const start = currentPage * (config?.questionsPerPage || 1)
  const end = start + (config?.questionsPerPage || 1)
  const currentQuestions = filteredQuestions.slice(start, end)

  /* ── Fullscreen exit → auto-submit ── */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && config && !isFinished) {
        alert("You exited fullscreen. Test will be submitted.")
        setIsFinished(true)
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [config, isFinished])

  /* ── Track visited ── */
  useEffect(() => {
    if (!filteredQuestions.length) return

    const currentQuestionId = filteredQuestions[currentPage]?.id
    setVisited((prev) => {
      if (prev[currentQuestionId]) return prev
      return { ...prev, [currentQuestionId]: true }
    })
  }, [currentPage, filteredQuestions])
  useEffect(() => {
    if (overallTime <= 0 && config) {
      setIsFinished(true)
    }
  }, [overallTime, config])

    useEffect(() => {
      setQuestionStartTime(Date.now())
    }, [currentPage])
  /* ── Start screen (from URL params) ── */
  if (autoStartConfig && !config) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.startTestCard}>
          <h2 className={styles.startTitle}>Configure Your Test</h2>

          <div className={styles.configItem}>
            <label>Number of Questions</label>
            <input
              type="number"
              min="1"
              max="100"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            />
          </div>

          <div className={styles.configItem}>
            <label>Time per Question (seconds)</label>
            <input
              type="number"
              min="10"
              max="300"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            />
          </div>

          <div className={styles.configItem}>
            <label>Negative Marking</label>
            <select
              value={negativeMarking}
              onChange={(e) => setNegativeMarking(e.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className={styles.totalTime}>
            Total Test Time:{" "}
            <strong>
              {Math.floor(calculatedTime / 60)}m {calculatedTime % 60}s
            </strong>
          </div>
          <div className={styles.rulesBox}>
            <h3 className={styles.rulesTitle}>Test Rules</h3>
            <ul className={styles.rulesList}>
              <li>Each question has a fixed time limit.</li>
              <li>Once time is up, the question will be locked automatically.</li>
              <li>Once you select an answer and move to the next question, you cannot change it.</li>
              <li>Questions marked for review can be revisited and modified before time expires.</li>
              <li>The overall test timer will keep running continuously.</li>
              <li>Do not exit fullscreen mode during the test.</li>
              <li>If you exit fullscreen mode during the test, your test will be submitted automatically.</li>
            </ul>
          </div>
          <button
            className={styles.buttonPrimary}
            onClick={() => {
              setOverallTime(calculatedTime)
              enterFullscreen()
              setConfig({
                ...autoStartConfig,
                duration: timePerQuestion,
                questionsPerPage: 1,
                numQuestions: numQuestions,
                negativeMarking: negativeMarking,
              })
            }}
          >
            Start Test
          </button>
        </div>
      </div>
    )
  }

  /* ── Config screen ── */
  if (!config) {
    return (
      <div className={styles.pageBackground}>
        <div className={styles.fullScreenWrapper}>
          <TestConfig
            onStart={(cfg) => {
              enterFullscreen()
              setConfig(cfg)
            }}
          />
        </div>
      </div>
    )
  }

  /* ── Timer handler ── */
  const handleTimeUp = () => {
    const currentQuestionId = filteredQuestions[currentPage]?.id

    setLockedQuestions((prev) => ({
      ...prev,
      [currentQuestionId]: true,
    }))

    const totalPages = Math.ceil(filteredQuestions.length / config.questionsPerPage)

    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleAnswer = (id, option) => {
    if (lockedQuestions[id]) return // ❌ block answer
    setAnswers((prev) => ({ ...prev, [id]: option }))
  }
const toggleReview = (id) => {
  setMarkedForReview((prev) => ({
    ...prev,
    [id]: !prev[id],
  }))
}
/* ── Result screen ── */
if (isFinished) {
  const totalQuestions = filteredQuestions.length
  let correctAnswers = 0
  let wrongAnswers = 0

  filteredQuestions.forEach((q) => {
    if (answers[q.id] === q.answer) correctAnswers++
    else if (answers[q.id]) wrongAnswers++
  })

  let score = correctAnswers
  if (config?.negativeMarking) {
    score = correctAnswers - wrongAnswers * 0.25
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.fullResultPage}>

        {/* ✅ HEADER */}
        <div className={styles.resultHeader}>
          <h2>Test Result</h2>

          <p className={styles.score}>
            Score: <strong>{score}</strong> / {totalQuestions}
          </p>

          <div className={styles.summaryBoxes}>
            <div className={`${styles.summaryBox} ${styles.correct}`}>
              ✔ Correct
              <span className={styles.count}>{correctAnswers}</span>
            </div>

            <div className={`${styles.summaryBox} ${styles.wrong}`}>
              ❌ Wrong
              <span className={styles.count}>{wrongAnswers}</span>
            </div>

            <div className={`${styles.summaryBox} ${styles.skipped}`}>
              🟡 Skipped
              <span className={styles.count}>
                {totalQuestions - correctAnswers - wrongAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ DETAILED ANALYSIS */}
        <div className={styles.analysisContainer}>
          {filteredQuestions.map((q, index) => {
            const userAnswer = answers[q.id] || null; // null if skipped
            const isSkipped = !userAnswer;
            const isCorrect = userAnswer === q.answer;
            const isMarked = markedForReview[q.id];

            return (
              <div
                key={q.id}
                className={`${styles.analysisCard} ${
                  isCorrect ? styles.correct : isSkipped ? styles.skipped : styles.wrong
                }`}
              >
                <h4>Q{index + 1}. {q.question}</h4>

                <p>
                  Your Answer: <strong>{userAnswer || "Not Attempted"}</strong>
                  {isMarked && <span className={styles.markedReview}> (Marked for Review)</span>}
                </p>

                <p>
                  Correct Answer: <strong>{q.answer}</strong>
                </p>

                <div className={styles.optionsList}>
                  {q.options.map((opt) => {
                    const isUser = opt === userAnswer;
                    const isCorrectOpt = opt === q.answer;
                    return (
                      <div
                        key={opt}
                        className={`${styles.optionItem} ${
                          isCorrectOpt ? styles.correctOption : ""
                        } ${isUser && !isCorrectOpt ? styles.wrongOption : ""}`}
                      >
                        {opt}
                        {isUser && !isCorrectOpt ? " ← Your Choice" : ""}
                        {isCorrectOpt ? " ←  Answer" : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ FOOTER */}
        <div className={styles.resultFooter}>
          <button
            className={styles.buttonPrimary}
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {})
              }
              router.push("/")
            }}
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
  )
}
  /* ── Test screen ── */
  const currentQuestionId = filteredQuestions[currentPage]?.id;
  return (
    <div className={styles.pageBackground}>
      <div className={`${styles.testContainer} ${styles.fadeIn}`}>
        <div className={styles.timerRow}>
          <div className={styles.overallTimer}>
            Time Left: {Math.floor(overallTime / 60)}:
            {String(overallTime % 60).padStart(2, "0")}
          </div>
          {!lockedQuestions[filteredQuestions[currentPage]?.id] && (
            <Timer
              duration={
                  questionTimers[currentQuestionId] !== undefined
                    ? questionTimers[currentQuestionId]   // revisit → resume
                    : config.duration                     // first time → fresh
                }
              onTimeUp={() => {
                const currentQuestionId = filteredQuestions[currentPage]?.id;

                // Lock if not marked for review
                if (!markedForReview[currentQuestionId]) {
                  setLockedQuestions((prev) => ({
                    ...prev,
                    [currentQuestionId]: true,
                  }));
                }

                handleTimeUp(); // move to next question
              }}
              onTimeUpdate={(timeLeft) => {
                const currentQuestionId = filteredQuestions[currentPage]?.id;
                setQuestionTimers((prev) => ({
                  ...prev,
                  [currentQuestionId]: timeLeft,
                }));
              }}
            />
          )}
        </div>

        <div className={styles.testLayout}>
          <div className={styles.questionArea}>
            {currentQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onAnswer={handleAnswer}
                selectedAnswer={answers[q.id]}
                index={currentPage}
                isLocked={lockedQuestions[q.id]}
                isMarked={markedForReview[q.id]}
                onMarkReview={toggleReview}
              />
            ))}

            <div className={styles.navigation}>
              <button
                className={styles.buttonSecondary}
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                ← Previous
              </button>

              <button
                  className={styles.buttonSecondary}
                  onClick={() => {
                  const currentQuestionId = filteredQuestions[currentPage]?.id

                  // ✅ Save remaining time
                  setQuestionTimers((prev) => prev)

                 if (answers[currentQuestionId] && !markedForReview[currentQuestionId]) {
                    setLockedQuestions((prev) => ({
                      ...prev,
                      [currentQuestionId]: true,
                    }))
                  }

                  const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
                  const remainingTime = config.duration - timeSpent

                  if (remainingTime > 0) {
                    setOverallTime((prev) => prev - remainingTime)
                  }

                  setCurrentPage((p) => p + 1)
                }}
                  disabled={end >= filteredQuestions.length}
                >
                  Next →
                </button>
            </div>

            <button
              className={`${styles.buttonPrimary} ${styles.submitButton}`}
              onClick={() => setIsFinished(true)}
            >
              Submit Test
            </button>
          </div>

          <QuestionPalette
            filteredQuestions={filteredQuestions}
            answers={answers}
            visited={visited}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            markedForReview={markedForReview} 
            lockedQuestions={lockedQuestions}
          />
        </div>
      </div>
    </div>
  )
}