"use client";

import styles from "./ProductsFilters.module.css";

export default function ProductsFilters({ filters, activeFilter, onChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.filterBtn} ${
              activeFilter === filter.id ? styles.active : ""
            }`}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}