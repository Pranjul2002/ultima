"use client"
import { useState } from "react"
import styles from "./TestConfig.module.css"

// ✅ Data-driven topics — no more giant if/else
const SUBJECT_TOPICS = {
  Math:             ["Algebra", "Geometry"],
  Science:          ["Physics", "Chemistry"],
  "Computer Science": ["Programming", "DBMS"],
}

export default function TestConfig({ onStart }) {
  const [subject, setSubject]         = useState("")
  const [topic, setTopic]             = useState("")
  const [negativeMarks, setNegativeMarks] = useState(0)
  const [duration, setDuration]       = useState(30)
  const [customTime, setCustomTime]   = useState("")
  const [errors, setErrors]           = useState({}) // ✅ inline errors

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
    setTopic("") // reset topic when subject changes
    setErrors((prev) => ({ ...prev, subject: "", topic: "" }))
  }

  const handleStart = () => {
    const newErrors = {}
    if (!subject) newErrors.subject = "Please select a subject"
    if (!topic)   newErrors.topic   = "Please select a topic"

    const finalDuration = customTime ? Number(customTime) : duration
    if (finalDuration <= 0) newErrors.duration = "Duration must be greater than 0"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onStart({ subject, topic, questionsPerPage: 1, negativeMarks, duration: finalDuration })
  }

  return (
    <div className={styles.configBox}>
      <h2>Test Configuration</h2>

      {/* Subject */}
      <div className={styles.fieldGroup}>
        <label htmlFor="subject">Subject</label>
        <select id="subject" value={subject} onChange={handleSubjectChange}>
          <option value="">Select Subject</option>
          {Object.keys(SUBJECT_TOPICS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <p className={styles.error}>{errors.subject}</p>}
      </div>

      {/* Topic */}
      <div className={styles.fieldGroup}>
        <label htmlFor="topic">Topic</label>
        <select id="topic" value={topic} onChange={(e) => { setTopic(e.target.value); setErrors((p) => ({ ...p, topic: "" })) }} disabled={!subject}>
          <option value="">Select Topic</option>
          {(SUBJECT_TOPICS[subject] || []).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.topic && <p className={styles.error}>{errors.topic}</p>}
      </div>

      {/* Negative Marks */}
      <div className={styles.fieldGroup}>
        <label htmlFor="negMarks">Negative Marks (per wrong answer)</label>
        <select id="negMarks" value={negativeMarks} onChange={(e) => setNegativeMarks(Number(e.target.value))}>
          <option value={0}>No Negative Marking</option>
          <option value={0.33}>0.33</option>
          <option value={0.5}>0.5</option>
          <option value={0.66}>0.66</option>
        </select>
      </div>

      {/* Time per question */}
      <div className={styles.fieldGroup}>
        <label htmlFor="duration">Time Per Question</label>
        <select id="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <option value={10}>10 Seconds</option>
          <option value={15}>15 Seconds</option>
          <option value={30}>30 Seconds</option>
          <option value={60}>60 Seconds</option>
        </select>
      </div>

      {/* Custom time */}
      <div className={styles.fieldGroup}>
        <label htmlFor="customTime">Custom Time (seconds)</label>
        <input
          id="customTime"
          type="number"
          placeholder="Override with custom seconds"
          value={customTime}
          min={1}
          onChange={(e) => { setCustomTime(e.target.value); setErrors((p) => ({ ...p, duration: "" })) }}
        />
        {errors.duration && <p className={styles.error}>{errors.duration}</p>}
      </div>

      <button className={styles.buttonPrimary} onClick={handleStart}>
        Start Test
      </button>
    </div>
  )
}