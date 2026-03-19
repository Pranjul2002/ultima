"use client"
import { useEffect, useState, useRef } from "react"
import styles from "./Timer.module.css"

export default function Timer({ duration, onTimeUp, onTimeUpdate }) {
const [timeLeft, setTimeLeft] = useState(duration || 0)
  const onTimeUpRef = useRef(onTimeUp)
   useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])
const prevDurationRef = useRef(duration)

useEffect(() => {
  // Only set when switching question (not during ticking)
  if (typeof duration === "number") {
    setTimeLeft(duration)
    prevDurationRef.current = duration
  }
}, [duration])
useEffect(() => {
  if (timeLeft <= 0) {
    onTimeUpRef.current()
    return
  }

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      const newTime = prev - 1

      onTimeUpdate?.(newTime)   // ✅ THIS LINE FIXES EVERYTHING

      return newTime
    })
  }, 1000)

  return () => clearInterval(interval)
}, [timeLeft])
  const percentage = (timeLeft / duration) * 100
  const isWarning  = timeLeft <= 5

  return (
    <div className={styles.timerWrapper}>
      <div className={`${styles.timerText} ${isWarning ? styles.timerTextWarning : ""}`}>
        {/* ✅ Replaced emoji with CSS clock icon for layout stability */}
        <span className={styles.clockIcon} aria-hidden="true">◷</span>
        {timeLeft}s
      </div>
      <div className={styles.timerBar} role="progressbar" aria-valuenow={timeLeft} aria-valuemax={duration}>
        <div
          className={`${styles.timerProgress} ${isWarning ? styles.timerWarning : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}