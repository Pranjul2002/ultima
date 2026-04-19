import Link from "next/link";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  return (
    <Link href={product.href} className={styles.cardLink}>
      <article
        className={styles.card}
        style={{
          "--card-accent": product.accentColor,
          "--card-bg": product.bgColor,
          "--card-border": product.borderColor,
        }}
      >
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{product.icon}</span>
        </div>

        <div className={styles.body}>
          <p className={styles.subtitle}>{product.subtitle}</p>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.tags}>
            {product.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <strong>{product.stats.questions}</strong> Questions
            </span>
            <span className={styles.statDivider}>·</span>
            <span className={styles.stat}>
              <strong>{product.stats.tests}</strong> Tests
            </span>
          </div>

          <span className={styles.cta}>
            Explore
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
