"use client";
import { useState } from "react";
import styles from "./TestConfig.module.css";

export default function TestConfig({ onStart }) {

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [duration, setDuration] = useState(30);
  const [customTime, setCustomTime] = useState("");

  const handleStart = () => {

    if (!subject || !topic) {
      alert("Please select subject and topic");
      return;
    }

    const finalDuration = customTime ? Number(customTime) : duration;

    if (finalDuration <= 0) {
      alert("Duration must be greater than 0");
      return;
    }

    onStart({
      subject,
      topic,
      questionsPerPage: 1,
      negativeMarks,
      duration: finalDuration
    });
  };

  return (
    <div className={styles.configWrapper}>
    <div className={styles.configBox}>

      <h2>Test Configuration</h2>

      {/* SUBJECT */}
      <label>Subject</label>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">Select Subject</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="Computer Science">Computer Science</option>
      </select>


      {/* TOPIC */}
      <label>Topic</label>
      <select
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      >
        <option value="">Select Topic</option>

        {subject === "Math" && (
          <>
            <option value="Algebra">Algebra</option>
            <option value="Geometry">Geometry</option>
          </>
        )}

        {subject === "Science" && (
          <>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </>
        )}

        {subject === "Computer Science" && (
          <>
            <option value="Programming">Programming</option>
            <option value="DBMS">DBMS</option>
          </>
        )}

      </select>


      {/* NEGATIVE MARKS */}
      <label>Negative Marks (per wrong answer)</label>
      <select
        value={negativeMarks}
        onChange={(e) => setNegativeMarks(Number(e.target.value))}
      >
        <option value={0}>No Negative Marking</option>
        <option value={0.33}>0.33</option>
        <option value={0.5}>0.5</option>
        <option value={0.66}>0.66</option>
      </select>


      {/* QUESTION TIMER */}
      <label>Time Per Question</label>
      <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      >
        <option value={10}>10 Seconds</option>
        <option value={15}>15 Seconds</option>
        <option value={30}>30 Seconds</option>
        <option value={60}>60 Seconds</option>
      </select>


      {/* CUSTOM TIMER */}
      <label>Custom Time (seconds)</label>
      <input
        type="number"
        placeholder="Enter custom seconds"
        value={customTime}
        onChange={(e) => setCustomTime(e.target.value)}
      />


      <button
        className={styles.buttonPrimary}
        onClick={handleStart}
      >
        Start Test
      </button>

    </div>
    </div>
  );
}