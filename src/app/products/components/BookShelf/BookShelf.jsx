"use client";

import Link from "next/link";
import styles from "./BookShelf.module.css";

function Book({ book }) {
  return (
    <Link href={book.bookHref} className={styles.bookLink}>
      <div className={`${styles.book} ${styles[book.theme]}`}>
        <div className={styles.spine}>
          <span className={styles.spineText}>{book.spineText}</span>
        </div>

        <div className={styles.cover}>
          <p className={styles.bookLabel}>{book.label}</p>
          <h4 className={styles.bookTitle}>{book.title}</h4>
          <p className={styles.bookAuthor}>{book.author}</p>

          <div className={styles.bookDivider} />

          <div className={styles.bookFooter}>
            <span className={styles.bookQCount}>
              {book.emoji} {book.qCount} Questions
            </span>
            <span className={styles.practiceBtn}>Open Book →</span>
          </div>

          <span className={styles.fullTestLink}>
            View chapters and chapter actions
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BookShelf({
  title,
  subtitle,
  books,
  compactHeader = false,
}) {
  return (
    <section className={styles.bookSection}>
      {!compactHeader ? (
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle ? <p className={styles.sectionSub}>{subtitle}</p> : null}
        </div>
      ) : (
        <div className={styles.compactHeader}>
          <h3 className={styles.compactTitle}>{title}</h3>
          {subtitle ? <p className={styles.compactSub}>{subtitle}</p> : null}
        </div>
      )}

      <div className={styles.shelf}>
        {books.map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}