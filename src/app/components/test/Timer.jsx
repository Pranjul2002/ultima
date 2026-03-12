"use client";
import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

export default function Timer({ duration, onTimeUp }) {

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {

    setTimeLeft(duration);

    const interval = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [duration]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className={styles.timerWrapper}>

      <div className={styles.timerText}>
        ⏳ {timeLeft}s
      </div>

      <div className={styles.timerBar}>

        <div
          className={`${styles.timerProgress}
          ${timeLeft <= 5 ? styles.timerWarning : ""}`}
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}