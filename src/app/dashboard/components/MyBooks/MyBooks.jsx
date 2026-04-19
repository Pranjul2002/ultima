"use client";

import { useEffect, useState } from "react";
import styles from "./MyBooks.module.css";
import { getMyBooks } from "@/services/dashboardService";

// ── Free NCERT slugs – always visible to every logged‑in user ─────────────────
const FREE_BOOK_SLUGS = new Set([
  "ncert-physics-class-10",
  "ncert-physics-class-11",
  "ncert-physics-class-12",
  "ncert-chemistry-class-10",
  "ncert-chemistry-class-11",
  "ncert-chemistry-class-12",
  "ncert-maths-class-10",
  "ncert-maths-class-11",
  "ncert-maths-class-12",
]);

const subjectEmoji = {
  Physics: "⚡",
  Chemistry: "🧪",
  Mathematics: "📐",
  Biology: "🌿",
};

const subjectTheme = {
  Physics: { accent: "#4f8ef7", bg: "#eef3ff" },
  Chemistry: { accent: "#f7a24f", bg: "#fff5eb" },
  Mathematics: { accent: "#3dba74", bg: "#edfff5" },
  Biology: { accent: "#a04ff7", bg: "#f5eeff" },
};

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all", label: "All Books" },
  { id: "free", label: "Free Books" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const FilterTab = ({ label, active, onClick }) => (
  <button
    type="button"
    className={`${styles.filterTab} ${active ? styles.activeTab : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const BookCard = ({ book }) => {
  const theme = subjectTheme[book.subject] || { accent: "#888", bg: "#f5f5f5" };
  const emoji = subjectEmoji[book.subject] || "📚";
  const isFree = book.isFree;

  const handleOpen = () => {
    window.location.href = `/products/books/${book.classSlug}/${book.slug}`;
  };

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCardTop} style={{ background: theme.bg }}>
        <span className={styles.bookEmoji}>{emoji}</span>
        {isFree && <span className={styles.freeBadge}>Free</span>}
      </div>

      <div className={styles.bookCardBody}>
        <p className={styles.bookSubject} style={{ color: theme.accent }}>
          {book.subject} · {book.classLabel}
        </p>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        {book.subtitle && (
          <p className={styles.bookSubtitle}>{book.subtitle}</p>
        )}

        <div className={styles.bookMeta}>
          <span className={styles.metaChip}>{book.chapterCount} chapters</span>
          {book.questionCount > 0 && (
            <span className={styles.metaChip}>{book.questionCount} Qs</span>
          )}
        </div>
      </div>

      <div className={styles.bookCardFooter}>
        <button
          type="button"
          className={styles.openBtn}
          style={{ background: theme.accent }}
          onClick={handleOpen}
        >
          Open Book
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className={`${styles.bookCard} ${styles.skeletonCard}`}>
    <div className={`${styles.bookCardTop} ${styles.skeletonBlock}`} />
    <div className={styles.bookCardBody}>
      <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonMed}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonLong}`} />
    </div>
  </div>
);

const EmptyState = ({ filter }) => (
  <div className={styles.emptyState}>
    <span className={styles.emptyIcon}>📚</span>
    <p className={styles.emptyTitle}>
      {filter === "free" ? "No free books found." : "No books yet."}
    </p>
    <p className={styles.emptyHint}>
      {filter === "free"
        ? "Free NCERT books should appear here automatically."
        : "Browse our catalogue and purchase a book to see it here."}
    </p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export default function MyBooks() {
  const [filter, setFilter] = useState("all");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getMyBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message || "Failed to load books.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const displayed = filter === "free"
    ? books.filter((b) => b.isFree)
    : books;

  const freeCount = books.filter((b) => b.isFree).length;
  const paidCount = books.filter((b) => !b.isFree).length;

  return (
    <div className={styles.root}>
      {/* ── Summary row ─────────────────────────────────────────────────── */}
      <div className={styles.summRow}>
        <div className={styles.summCard}>
          <span className={styles.summVal}>{isLoading ? "—" : books.length}</span>
          <span className={styles.summLbl}>Total Books</span>
        </div>
        <div className={styles.summCard}>
          <span className={styles.summVal} style={{ color: "#3dba74" }}>
            {isLoading ? "—" : freeCount}
          </span>
          <span className={styles.summLbl}>Free Books</span>
        </div>
        <div className={styles.summCard}>
          <span className={styles.summVal} style={{ color: "#4f8ef7" }}>
            {isLoading ? "—" : paidCount}
          </span>
          <span className={styles.summLbl}>Purchased</span>
        </div>
      </div>

      {/* ── Books panel ─────────────────────────────────────────────────── */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Your Library</span>
          <div className={styles.filterRow}>
            {FILTERS.map((f) => (
              <FilterTab
                key={f.id}
                label={f.label}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.panelBody}>
          {error && (
            <p className={styles.errorMsg}>{error}</p>
          )}

          {isLoading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className={styles.grid}>
              {displayed.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
