"use client";

import Link from "next/link";
import styles from "./ExamSection.module.css";

function ExamCard({ item }) {
  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.categoryBadge}>Competitive</span>
      </div>

      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.description}>{item.description}</p>

      <div className={styles.tags}>
        {item.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <Link href={item.href} className={styles.cta}>
        Explore →
      </Link>
    </article>
  );
}

export default function ExamSection({ title, subtitle, items }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.titleMain}>{title}</h2>
        <p className={styles.subtitleMain}>{subtitle}</p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <ExamCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}