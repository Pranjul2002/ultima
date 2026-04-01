"use client"

import Link from "next/link"
import styles from "./BookShelf.module.css"

/*
  Each book entry shape:
  {
    title:      string        — book title
    author:     string        — author name
    label:      string        — e.g. "Physics · Class 10"
    spineText:  string        — short text for the spine
    qCount:     number        — how many questions are in bookQuestions.js for this book
    theme:      string        — CSS module theme class name (see BookShelf.module.css)
    emoji:      string        — small emoji shown next to qCount
    practiceHref: string      — /test?... URL for book questions
    fullTestHref: string      — /test?... URL for the regular subject test
  }
*/

function Book({ book }) {
  return (
    <div className={`${styles.book} ${styles[book.theme]}`}>

      {/* ── Spine ── */}
      <div className={styles.spine}>
        <span className={styles.spineText}>{book.spineText}</span>
      </div>

      {/* ── Cover ── */}
      <div className={styles.cover}>
        <p className={styles.bookLabel}>{book.label}</p>
        <h4 className={styles.bookTitle}>{book.title}</h4>
        <p className={styles.bookAuthor}>{book.author}</p>

        <div className={styles.bookDivider} />

        <div className={styles.bookFooter}>
          <span className={styles.bookQCount}>
            {book.emoji} {book.qCount} Questions
          </span>
          <Link href={book.practiceHref} className={styles.practiceBtn}>
            Practice →
          </Link>
        </div>

        <Link href={book.fullTestHref} className={styles.fullTestLink}>
          Take full subject test instead
        </Link>
      </div>

    </div>
  )
}

export default function BookShelf({ books }) {
  return (
    <section className={styles.bookSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📚 Reference Book Practice</h2>
        <p className={styles.sectionSub}>
          MCQs handpicked from the books toppers actually use
        </p>
      </div>

      <div className={styles.shelf}>
        {books.map((book) => (
          <Book key={book.practiceHref} book={book} />
        ))}
      </div>
    </section>
  )
}
