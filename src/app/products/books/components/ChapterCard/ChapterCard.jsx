"use client";

import Link from "next/link";
import styles from "./ChapterCard.module.css";

function ActionButton({ href, label, variant = "primary" }) {
  return (
    <Link
      href={href}
      className={`${styles.actionBtn} ${
        variant === "secondary" ? styles.secondary : styles.primary
      }`}
    >
      {label}
    </Link>
  );
}

export default function ChapterCard({ chapter }) {
  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.chapterNumber}>Chapter {chapter.number}</div>
        <h3 className={styles.chapterTitle}>{chapter.title}</h3>
        <p className={styles.chapterDescription}>{chapter.description}</p>
      </div>

      <div className={styles.actions}>
        <ActionButton href={chapter.actions.read} label="Read Chapter" />
        <ActionButton href={chapter.actions.practice} label="Practice Questions" />
        <ActionButton href={chapter.actions.test} label="Take Chapter Test" variant="secondary" />
        <ActionButton href={chapter.actions.notes} label="View Notes" variant="secondary" />
      </div>
    </article>
  );
}