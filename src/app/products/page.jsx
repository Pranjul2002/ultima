import ProductCategorySection from "./components/ProductCategorySection/ProductCategorySection";
import { PREP_PRODUCTS } from "./dataa/catalogData";
import styles from "./page.module.css";

export const metadata = {
  title: "Products – Ultima",
  description: "Explore preparation products for Class 10, 11, 12, JEE, NEET, GATE and reference books.",
};

const ncertProducts = PREP_PRODUCTS.filter((p) => p.category === "ncert");
const competitiveProducts = PREP_PRODUCTS.filter((p) => p.category === "competitive");

export default function ProductsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>ULTIMA PRODUCTS</span>
          <h1 className={styles.heroTitle}>Everything you need to prepare.</h1>
          <p className={styles.heroSubtitle}>
            NCERT chapter-wise practice, reference books, and competitive exam prep —
            all in one organised hub.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <ProductCategorySection
          icon="📘"
          title="NCERT Preparation"
          subtitle="Chapter-wise practice and tests for Class 10, 11 and 12."
          products={ncertProducts}
        />

        <div className={styles.divider} />

        <ProductCategorySection
          icon="🏆"
          title="Competitive Exams"
          subtitle="Structured prep packs for JEE, NEET and GATE with mock tests and analytics."
          products={competitiveProducts}
        />
      </div>
    </main>
  );
}
