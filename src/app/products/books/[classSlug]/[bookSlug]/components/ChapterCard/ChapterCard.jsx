import ChapterActions from "../ChapterActions/ChapterActions";
import styles from "./ChapterCard.module.css";

export default function ChapterCard({ chapter, bookSlug, classSlug, accentColor }) {
  return (
    <article
      className={`${styles.card} ${chapter.comingSoon ? styles.comingSoon : ""}`}
      style={{ "--accent": accentColor }}
    >
      {/* Chapter number badge */}
      <div className={styles.numBadge}>
        <span>{String(chapter.number).padStart(2, "0")}</span>
      </div>

      {/* Main content */}
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{chapter.title}</h3>
            {chapter.comingSoon && (
              <span className={styles.soonBadge}>Coming Soon</span>
            )}
          </div>
          <p className={styles.description}>{chapter.description}</p>

          {/* Meta: duration + questions */}
          {!chapter.comingSoon && (
            <div className={styles.meta}>
              {chapter.duration && (
                <span className={styles.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {chapter.duration}
                </span>
              )}
              {chapter.questionCount > 0 && (
                <span className={styles.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 4.5h4M4 7h4M4 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {chapter.questionCount} questions
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!chapter.comingSoon && (
          <ChapterActions
            chapterId={chapter.id}
            bookSlug={bookSlug}
            classSlug={classSlug}
          />
        )}
      </div>
    </article>
  );
}
