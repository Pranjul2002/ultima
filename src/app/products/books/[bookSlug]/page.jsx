import { BOOK_DETAILS } from "../../data/bookDetailsData";
import BookDetailHero from "../components/BookDetailHero/BookDetailHero";
import ChapterList from "../components/ChapterList/ChapterList";
import styles from "./page.module.css";

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default async function BookDetailPage({ params }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.bookSlug || "";
  const decodedSlug = decodeURIComponent(rawSlug);
  const normalizedSlug = normalizeSlug(decodedSlug);

  const matchedEntry = Object.entries(BOOK_DETAILS).find(
    ([key, value]) =>
      normalizeSlug(key) === normalizedSlug ||
      normalizeSlug(value?.slug) === normalizedSlug
  );

  const book = matchedEntry?.[1] || null;

  if (!book) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.fallbackCard}>
            <span className={styles.fallbackEyebrow}>BOOK NOT FOUND</span>
            <h1 className={styles.fallbackTitle}>We couldn’t find this book page</h1>
            <p className={styles.fallbackText}>
              Requested slug: <strong>{decodedSlug || "(empty)"}</strong>
            </p>

            <div className={styles.availableWrap}>
              <h2 className={styles.availableTitle}>Available book slugs</h2>
              <div className={styles.slugList}>
                {Object.keys(BOOK_DETAILS).map((slug) => (
                  <a
                    key={slug}
                    href={`/products/books/${slug}`}
                    className={styles.slugItem}
                  >
                    {slug}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <BookDetailHero book={book} />
        <ChapterList chapters={book.chapters} />
      </div>
    </main>
  );
}