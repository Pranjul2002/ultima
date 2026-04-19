import Link from "next/link";
import styles from "./BookCard.module.css";

export default function BookCard({ book, classSlug }) {
  const href = `/products/books/${classSlug}/${book.slug}`;

  return (
    <Link href={href} className={styles.bookLink}>
      <div className={`${styles.book} ${styles[book.theme]}`}>
        {/* Spine */}
        <div className={styles.spine}>
          <span className={styles.spineText}>{book.subject}</span>
        </div>

        {/* Cover */}
        <div className={styles.cover}>
          <p className={styles.bookLabel}>{book.subtitle}</p>
          <h4 className={styles.bookTitle}>{book.title}</h4>
          <p className={styles.bookDesc}>{book.description}</p>

          <div className={styles.bookDivider} />

          <div className={styles.bookFooter}>
            <span className={styles.bookQCount}>
              {book.emoji} {book.questions} Questions
            </span>
            <span className={styles.practiceBtn}>Open Book →</span>
          </div>

          <span className={styles.chaptersHint}>
            {book.chapters} chapters · Read, Test, Practice
          </span>
        </div>
      </div>
    </Link>
  );
}
