import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterCard from "./components/ChapterCard/ChapterCard";
import { BOOK_CHAPTERS, CLASS_CATALOG } from "../../../dataa/catalogData";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return Object.keys(BOOK_CHAPTERS).map((slug) => {
    const book = BOOK_CHAPTERS[slug];
    return { classSlug: book.classSlug, bookSlug: slug };
  });
}

export async function generateMetadata({ params }) {
  const { bookSlug } = await params;
  const book = BOOK_CHAPTERS[bookSlug];
  if (!book) return {};
  return {
    title: `${book.title} – ${book.classLabel} – Ultima`,
    description: book.description,
  };
}

const THEME_ACCENT = {
  themeNavy:    "#1d4ed8",
  themeAmber:   "#b45309",
  themeForest:  "#15803d",
  themeIndigo:  "#3730a3",
  themeCrimson: "#991b1b",
  themeEmerald: "#059669",
};

export default async function BookDetailPage({ params }) {
  const { classSlug, bookSlug } = await params;
  const book = BOOK_CHAPTERS[bookSlug];
  if (!book) notFound();

  const classData = CLASS_CATALOG[classSlug];
  const accentColor = THEME_ACCENT[book.theme] || "#2563eb";
  const availableChapters = book.chapters.filter((c) => !c.comingSoon);

  return (
    <main className={styles.page}>

      {/* ── Top bar: back + breadcrumb ── */}
      <div className={styles.topBar}>
        <Link href={`/products/books/${classSlug}`} className={styles.backLink}>
          ← Back to {classData?.label || book.classLabel} Books
        </Link>
        <nav className={styles.breadcrumb}>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span className={styles.sep}>›</span>
          <Link href={`/products/books/${classSlug}`} className={styles.breadcrumbLink}>
            {classData?.label || book.classLabel}
          </Link>
          <span className={styles.sep}>›</span>
          <span className={styles.breadcrumbCurrent}>{book.subject}</span>
        </nav>
      </div>

      {/* ── Book hero ── */}
      <section className={styles.hero} style={{ "--accent": accentColor }}>
        <div className={styles.heroInner}>

          {/* Mini book visual */}
          <div className={styles.bookVisual}>
            <div className={styles.bookSpine} />
            <div className={styles.bookCover}>
              <span className={styles.bookEmoji}>{book.emoji}</span>
            </div>
          </div>

          {/* Info */}
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>{book.classLabel} · NCERT</p>
            <h1 className={styles.heroTitle}>{book.title}</h1>
            <p className={styles.heroDescription}>{book.description}</p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <strong>{book.stats.chapters}</strong>
                <span>Chapters</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <strong>{book.stats.questions}+</strong>
                <span>Questions</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <strong>{availableChapters.length}</strong>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Actions legend ── */}
      <div className={styles.legendBar}>
        <div className={styles.legendInner}>
          <span className={styles.legendLabel}>Each chapter includes:</span>
          <div className={styles.legendPills}>
            <span className={styles.pill} style={{ "--c": "#2563eb", "--b": "#eff6ff" }}>📖 Read</span>
            <span className={styles.pill} style={{ "--c": "#059669", "--b": "#ecfdf5" }}>⏱ Practice</span>
            <span className={styles.pill} style={{ "--c": "#dc2626", "--b": "#fff5f5" }}>📝 Take Test</span>
            <span className={styles.pill} style={{ "--c": "#d97706", "--b": "#fffbeb" }}>🗒 Notes</span>
          </div>
        </div>
      </div>

      {/* ── Chapters list ── */}
      <section className={styles.chaptersSection}>
        <div className={styles.inner}>
          <h2 className={styles.chaptersTitle}>
            All Chapters
            <span className={styles.chapterCount}>{book.chapters.length}</span>
          </h2>

          <div className={styles.chaptersList}>
            {book.chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                bookSlug={bookSlug}
                classSlug={classSlug}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
