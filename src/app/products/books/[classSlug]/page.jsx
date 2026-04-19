import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "./components/BookCard/BookCard";
import { CLASS_CATALOG } from "../../dataa/catalogData";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return Object.keys(CLASS_CATALOG).map((slug) => ({ classSlug: slug }));
}

export async function generateMetadata({ params }) {
  const { classSlug } = await params;
  const classData = CLASS_CATALOG[classSlug];
  if (!classData) return {};
  return {
    title: `${classData.label} Books – Ultima`,
    description: classData.description,
  };
}

export default async function ClassBooksPage({ params }) {
  const { classSlug } = await params;
  const classData = CLASS_CATALOG[classSlug];
  if (!classData) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        {/* ── Back link at TOP ── */}
        <Link href="/products" className={styles.backLink}>
          ← Back to all products
        </Link>

        {/* ── Breadcrumb ── */}
        <nav className={styles.breadcrumb}>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span className={styles.sep}>›</span>
          <span className={styles.breadcrumbCurrent}>{classData.label}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroIcon}>{classData.icon}</span>
          <div>
            <p className={styles.heroEyebrow}>NCERT · {classData.label}</p>
            <h1 className={styles.heroTitle}>{classData.title} Books</h1>
            <p className={styles.heroSubtitle}>{classData.description}</p>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{classData.books.length}</span>
            <span className={styles.heroStatLabel}>Subjects</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>
              {classData.books.reduce((a, b) => a + b.questions, 0)}+
            </span>
            <span className={styles.heroStatLabel}>Questions</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>
              {classData.books.reduce((a, b) => a + b.chapters, 0)}
            </span>
            <span className={styles.heroStatLabel}>Chapters</span>
          </div>
        </div>
      </section>

      {/* ── Books shelf ── */}
      <section className={styles.booksSection}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Choose a Subject</h2>
          <div className={styles.shelf}>
            {classData.books.map((book) => (
              <BookCard key={book.slug} book={book} classSlug={classSlug} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
