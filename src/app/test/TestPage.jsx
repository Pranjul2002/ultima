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

  const searchParams = useSearchParams()
  const router = useRouter();
  const classParam   = searchParams.get("class")
  const subjectParam = searchParams.get("subject")
  const topicParam   = searchParams.get("topic")

  const [config, setConfig]           = useState(null)
  const [autoStartConfig, setAutoStartConfig] = useState(null)
  const [answers, setAnswers]         = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [visited, setVisited]         = useState({})
  const [isFinished, setIsFinished]   = useState(false)
  const [overallTime, setOverallTime] = useState(900)

  /* ── Fullscreen ── */

  const enterFullscreen = () => {

    const elem = document.documentElement

    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } 
    else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    } 
    else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    }

  }

  /* ── Auto config from products link ── */

  useEffect(() => {

    if (classParam || subjectParam || topicParam) {

      setAutoStartConfig({
        class: classParam || "",
        subject: subjectParam || "",
        topic: topicParam || "",
        duration: 30,
        questionsPerPage: 1
      })

    }

  }, [classParam, subjectParam, topicParam])

  /* ── Filter questions ── */

  const filteredQuestions = useMemo(() => {

    return questionsData.filter((q) => {
      return (
        (!config?.class || q.class?.toString() === config.class) &&
        (!config?.subject || q.subject?.toLowerCase() === config?.subject?.toLowerCase()) &&
        (!config?.topic || q.topic?.toLowerCase() === config?.topic?.toLowerCase())
      )
    })

  }, [config])

  const start            = currentPage * (config?.questionsPerPage || 1)
  const end              = start + (config?.questionsPerPage || 1)
  const currentQuestions = filteredQuestions.slice(start, end)

  /* ── Overall test timer ── */

  useEffect(() => {

    if (!config) return

    if (overallTime === 0) {
      setIsFinished(true)
      return
    }

    const timer = setInterval(() => {
      setOverallTime((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)

  }, [overallTime, config])

  /* ── Track visited ── */
useEffect(() => {

  const handleFullscreenChange = () => {

    // If user exits fullscreen
    if (!document.fullscreenElement && config && !isFinished) {

      alert("You exited fullscreen. Test will be submitted.");

      setIsFinished(true);
    }

  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };

}, [config, isFinished]);
  useEffect(() => {

    if (!filteredQuestions.length) return

    const currentQuestionId = filteredQuestions[currentPage]?.id

    setVisited((prev) => {

      if (prev[currentQuestionId]) return prev

      return {
        ...prev,
        [currentQuestionId]: true
      }

    })

  }, [currentPage, filteredQuestions])

  /* ── Start screen when coming from Products ── */

  if (autoStartConfig && !config) {

    return (

      <div className={styles.pageBackground}>
      <div className={styles.startTestCard}>

      <h2 className={styles.startTitle}>Ready to Start Test</h2>

      <button
        className={styles.buttonPrimary}
        onClick={() => {
          enterFullscreen()
          setConfig(autoStartConfig)
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

    const totalPages = Math.ceil(
      filteredQuestions.length / config.questionsPerPage
    )

    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }

  }

  const handleAnswer = (id, option) => {
    setAnswers((prev) => ({ ...prev, [id]: option }))
  }

  /* ── Result screen ── */

  if (isFinished) {

    const totalQuestions = filteredQuestions.length

    const correctAnswers =
      filteredQuestions.filter((q) => answers[q.id] === q.answer).length

    const percentage =
      Math.round((correctAnswers / totalQuestions) * 100)

    return (

      <div className={styles.pageBackground}>
        <div className={styles.resultWrapper}>

          <div className={`${styles.resultCard} ${styles.fadeIn}`}>

            <div className={styles.successIcon}>🎉</div>

            <h2>Test Completed</h2>

            <p className={styles.score}>
              Score: <span>{correctAnswers}</span> / {totalQuestions}
            </p>

            <p className={styles.percentage}>
              {percentage}%
            </p>
            <button
              className={styles.buttonPrimary}
              onClick={() => {
              // Exit fullscreen if active
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch((err) => console.error(err));
                }
              // Redirect to home
              router.push("/");
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

  return (

    <div className={styles.pageBackground}>

      <div className={`${styles.testContainer} ${styles.fadeIn}`}>

        <div className={styles.timerRow}>

          <div className={styles.overallTimer}>
            Test Time Left: {Math.floor(overallTime / 60)}:
            {String(overallTime % 60).padStart(2, "0")}
          </div>

          <Timer
            key={currentPage}
            duration={config.duration}
            onTimeUp={handleTimeUp}
          />

        </div>

        <div className={styles.testLayout}>

          {/* LEFT SIDE */}

          <div className={styles.questionArea}>

            {currentQuestions.map((q) => (

              <QuestionCard
                key={q.id}
                question={q}
                onAnswer={handleAnswer}
                selectedAnswer={answers[q.id]}
                index={currentPage}
              />

            ))}

            <div className={styles.navigation}>

              <button
                className={styles.buttonSecondary}
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>

              <button
                className={styles.buttonSecondary}
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={end >= filteredQuestions.length}
              >
                Next
              </button>

            </div>

            <button
              className={`${styles.buttonPrimary} ${styles.submitButton}`}
              onClick={() => setIsFinished(true)}
            >
              Submit Test
            </button>

          </div>

          {/* RIGHT SIDE */}

          <QuestionPalette
            filteredQuestions={filteredQuestions}
            answers={answers}
            visited={visited}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

        </div>

      </div>

    </div>

  )

}