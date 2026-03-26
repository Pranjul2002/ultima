"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./Timer.module.css"

export default function Timer({ duration, onTimeUp, onTimeUpdate }) {

  const [timeLeft, setTimeLeft] = useState(duration || 0)

  const onTimeUpRef = useRef(onTimeUp)
  const onTimeUpdateRef = useRef(onTimeUpdate)

  /* ================= REF UPDATES ================= */
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate
  }, [onTimeUpdate])

  /* ================= RESET ON QUESTION CHANGE ================= */
  useEffect(() => {
    if (typeof duration === "number") {
      setTimeLeft(duration)
    }
  }, [duration])

  /* ================= TIMER LOGIC ================= */
  useEffect(() => {
    if (timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  /* ================= SAFE CALLBACKS ================= */
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUpRef.current?.()
    } else {
      onTimeUpdateRef.current?.(timeLeft)
    }
  }, [timeLeft])

  /* ================= UI HELPERS ================= */
  const percentage = duration ? (timeLeft / duration) * 100 : 0
  const isWarning = timeLeft <= 5

  return (
    <div className={styles.timerWrapper}>
      <div className={`${styles.timerText} ${isWarning ? styles.timerTextWarning : ""}`}>
        <span className={styles.clockIcon} aria-hidden="true">◷</span>
        {timeLeft}s
      </div>

      <div
        className={styles.timerBar}
        role="progressbar"
        aria-valuenow={timeLeft}
        aria-valuemax={duration}
      >
        <div
          className={`${styles.timerProgress} ${isWarning ? styles.timerWarning : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}