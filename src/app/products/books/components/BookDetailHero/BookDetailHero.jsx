"use client";

import Link from "next/link";
import styles from "./BookDetailHero.module.css";

export default function BookDetailHero({ book }) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.cover} ${styles[book.theme] || ""}`}>
        <span className={styles.coverLabel}>{book.subtitle}</span>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.description}>{book.description}</p>
      </div>

      <div className={styles.info}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{book.stats.chapters}</span>
          <span className={styles.statLabel}>Chapters</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{book.stats.questions}</span>
          <span className={styles.statLabel}>Questions</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{book.stats.level}</span>
          <span className={styles.statLabel}>Level</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/products" className={styles.secondaryBtn}>
          ← Back to Products
        </Link>
      </div>
    </section>
  );
}