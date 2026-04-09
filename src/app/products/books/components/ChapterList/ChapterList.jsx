"use client";

import ChapterCard from "../ChapterCard/ChapterCard";
import styles from "./ChapterList.module.css";

export default function ChapterList({ chapters }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Chapters</h2>
        <p className={styles.subtitle}>
          Choose how you want to study each chapter.
        </p>
      </div>

      <div className={styles.list}>
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}