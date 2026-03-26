"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import TestConfig from "../components/test/TestConfig"
import Timer from "../components/test/Timer"
import QuestionCard from "../components/test/QuestionCard"
import QuestionPalette from "../components/test/QuestionPalette"
import StartConfig from "./start/Startconfig"
import ResultPage from "./result/ResultPage"
import questionsData from "../../data/questions"
import styles from "./page.module.css"

export default function TestPage() {
  /* ================= STATE ================= */
  const [numQuestions, setNumQuestions] = useState(10)
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [negativeMarking, setNegativeMarking] = useState(false)

  const [lockedQuestions, setLockedQuestions] = useState({})
  const [answers, setAnswers] = useState({})
  const [visited, setVisited] = useState({})
  const [markedForReview, setMarkedForReview] = useState({})
  const [questionTimers, setQuestionTimers] = useState({})

  const [currentPage, setCurrentPage] = useState(0)
  const [config, setConfig] = useState(null)
  const [autoStartConfig, setAutoStartConfig] = useState(null)

  const [isFinished, setIsFinished] = useState(false)
  const [overallTime, setOverallTime] = useState(900)
  const [perQuestionTimeEnabled, setPerQuestionTimeEnabled] = useState(true)

  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const searchParams = useSearchParams()
  const router = useRouter()

  const classParam = searchParams.get("class")
  const subjectParam = searchParams.get("subject")
  const topicParam = searchParams.get("topic")

  /* ================= FULLSCREEN ================= */
  const enterFullscreen = () => {
    const elem = document.documentElement
    if (elem.requestFullscreen) elem.requestFullscreen()
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen()
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
  }

  /* ================= AUTO CONFIG ================= */
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

  /* ================= TIMER ================= */
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

  /* ================= FILTER QUESTIONS ================= */
  const filteredQuestions = useMemo(() => {
    return questionsData
      .filter((q) => {
        return (
          (!config?.class || q.class?.toString() === config.class) &&
          (!config?.subject || q.subject?.toLowerCase() === config.subject?.toLowerCase()) &&
          (!config?.topic || q.topic?.toLowerCase() === config.topic?.toLowerCase())
        )
      })
      .slice(0, config?.numQuestions || 10)
  }, [config])

  const start = currentPage * (config?.questionsPerPage || 1)
  const end = start + (config?.questionsPerPage || 1)
  const currentQuestions = filteredQuestions.slice(start, end)

  /* ================= FULLSCREEN EXIT AUTO SUBMIT ================= */
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

  /* ================= VISITED TRACK ================= */
  useEffect(() => {
    if (!filteredQuestions.length) return

    const id = filteredQuestions[currentPage]?.id
    setVisited((prev) => {
      if (prev[id]) return prev
      return { ...prev, [id]: true }
    })
  }, [currentPage, filteredQuestions])

  /* ================= TIME TRACK ================= */
  useEffect(() => {
    setQuestionStartTime(Date.now())
  }, [currentPage])

  /* ================= AUTO START SCREEN ================= */
  if (autoStartConfig && !config) {
    return (
      <StartConfig
        autoStartConfig={autoStartConfig}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        negativeMarking={negativeMarking}
        setNegativeMarking={setNegativeMarking}
        perQuestionTimeEnabled={perQuestionTimeEnabled}
        setPerQuestionTimeEnabled={setPerQuestionTimeEnabled}
        timePerQuestion={timePerQuestion}
        setTimePerQuestion={setTimePerQuestion}
        overallTime={overallTime}
        setOverallTime={setOverallTime}
        enterFullscreen={enterFullscreen}
        setConfig={setConfig}
        filteredQuestions={filteredQuestions}
        setQuestionTimers={setQuestionTimers}
      />
    )
  }

  /* ================= CONFIG SCREEN ================= */
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

  /* ================= RESULT PAGE ================= */
  if (isFinished) {
    return (
      <ResultPage
        filteredQuestions={filteredQuestions}
        answers={answers}
        markedForReview={markedForReview}
        questionTimers={questionTimers} 
        config={config}
        router={router}
      />
    )
  }

  /* ================= HANDLERS ================= */
  const handleAnswer = (id, option) => {
    if (lockedQuestions[id]) return
    setAnswers((prev) => ({ ...prev, [id]: option }))
  }

  const toggleReview = (id) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  /* ================= TEST UI ================= */
  const currentQuestionId = filteredQuestions[currentPage]?.id

  return (
    <div className={styles.pageBackground}>
      <div className={`${styles.testContainer} ${styles.fadeIn}`}>

        {/* ===== TIMER ===== */}
        <div className={styles.timerRow}>
          {!perQuestionTimeEnabled && (
            <div className={styles.overallTimer}>
              Time Left: {Math.floor(overallTime / 60)}:
              {String(overallTime % 60).padStart(2, "0")}
            </div>
          )}

          {perQuestionTimeEnabled && !lockedQuestions[currentQuestionId] && (
            <Timer
              duration={questionTimers[currentQuestionId] ?? timePerQuestion}
              onTimeUp={() => {
                setLockedQuestions((prev) => ({
                  ...prev,
                  [currentQuestionId]: true,
                }))

                const totalPages = Math.ceil(
                  filteredQuestions.length / (config.questionsPerPage || 1)
                )

                if (currentPage + 1 < totalPages) setCurrentPage((p) => p + 1)
                else setIsFinished(true)

                setQuestionTimers((prev) => ({
                  ...prev,
                  [currentQuestionId]: 0,
                }))
              }}
              onTimeUpdate={(timeLeft) => {
                setQuestionTimers((prev) => ({
                  ...prev,
                  [currentQuestionId]: timeLeft,
                }))
              }}
            />
          )}
        </div>

        {/* ===== MAIN LAYOUT ===== */}
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

            {/* ===== NAVIGATION ===== */}
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
                  const id = filteredQuestions[currentPage]?.id

                  if (answers[id] && !markedForReview[id]) {
                    setLockedQuestions((prev) => ({
                      ...prev,
                      [id]: true,
                    }))
                  }

                  const timeSpent = Math.floor(
                    (Date.now() - questionStartTime) / 1000
                  )

                  if (perQuestionTimeEnabled) {
                    setQuestionTimers((prev) => ({
                      ...prev,
                      [id]: Math.max(
                        (prev[id] ?? timePerQuestion) - timeSpent,
                        0
                      ),
                    }))
                  } else {
                    setOverallTime((prev) =>
                      Math.max(prev - timeSpent, 0)
                    )
                  }

                  setCurrentPage((p) => p + 1)
                }}
                disabled={end >= filteredQuestions.length}
              >
                Save & Next →
              </button>
            </div>

            <button
              className={`${styles.buttonPrimary} ${styles.submitButton}`}
              onClick={() => setIsFinished(true)}
            >
              Submit Test
            </button>
          </div>

          {/* ===== PALETTE ===== */}
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