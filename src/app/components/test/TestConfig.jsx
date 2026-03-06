"use client";
import { useState } from "react";
import styles from "../../test/page.module.css";

export default function TestConfig({ onStart }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState();
  const [duration, setDuration] = useState(10);
  const [customTime, setCustomTime] = useState("");

  const handleStart = () => {
    if (!subject || !topic) {
      alert("Please select subject and topic");
      return;
    }

    onStart({
      subject,
      topic,
      questionsPerPage,
      negativeMarks,
      duration: customTime ? Number(customTime) : duration,
    });
  };

  return (
    <div className={styles.configBox}>
      <h2>Test Configuration</h2>

      {/* Subject */}
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">Select Subject</option>
        <option value="Math">Math</option>
        <option value="Science">Science</option>
        <option value="Computer Science">Computer Science</option>
      </select>

      {/* Topic */}
      <select
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      >
        <option value="">Select Topic</option>
        <option value="Algebra">Algebra</option>
        <option value="Geometry">Geometry</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Programming">Programming</option>
        <option value="DBMS">DBMS</option>
      </select>

      {/* Questions per page */}
      <select
        value={questionsPerPage}
        onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
      >
        <option value={1}>1 Question</option>
        <option value={2}>2 Questions</option>
      </select>

      {/* Negative Marks */}
      <select
        value={negativeMarks}
        onChange={(e) => setNegativeMarks(Number(e.target.value))}
      >
        <option value="">Negative per wrong answer</option>
        <option value={0.33}>0.33</option>
        <option value={0.5}>0.5</option>
        <option value={0.66}>0.66</option>
      </select>

      {/* Duration */}
      <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      >
        <option value={5}>5 Sec</option>
        <option value={10}>10 Sec</option>
        <option value={15}>15 Sec</option>
        <option value={30}>30 Sec</option>
      </select>

      {/* Custom Time */}
      <input
        type="number"
        placeholder="Custom Seconds"
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
  );
}