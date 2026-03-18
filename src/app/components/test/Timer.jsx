"use client"
import { useEffect, useState, useRef } from "react"
import styles from "./Timer.module.css"

export default function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onTimeUpRef = useRef(onTimeUp)
   useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])
useEffect(() => {
  window.currentTimeLeft = timeLeft
}, [timeLeft])
  useEffect(() => {
    setTimeLeft(duration)
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [duration]) 

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