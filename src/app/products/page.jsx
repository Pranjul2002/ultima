"use client";

import { useMemo, useState } from "react";
import ProductsHero from "./components/ProductsHero/ProductsHero";
import ProductsFilters from "./components/ProductsFilters/ProductsFilters";
import BookShelf from "./components/BookShelf/BookShelf";
import ExamSection from "./components/ExamSection/ExamSection";
import { PRODUCT_FILTERS, PRODUCT_SECTIONS } from "./data/productsData";
import styles from "./page.module.css";

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredSections = useMemo(() => {
    if (activeFilter === "all") return PRODUCT_SECTIONS;
    return PRODUCT_SECTIONS.filter((section) => section.category === activeFilter);
  }, [activeFilter]);

  return (
    <main className={styles.page}>
      <ProductsHero
        eyebrow="ULTIMA PRODUCTS"
        title="A modern product hub for every stage of preparation"
        subtitle="Explore NCERT practice by class, reference books, and competitive exam prep in a cleaner and more organised experience."
      />

      <section className={styles.content}>
        <ProductsFilters
          filters={PRODUCT_FILTERS}
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        <div className={styles.sections}>
          {filteredSections.map((section) => {
            if (section.type === "bookshelf-group") {
              return (
                <div key={section.id} className={styles.groupSection}>
                  <div className={styles.groupHeader}>
                    <h2 className={styles.groupTitle}>{section.title}</h2>
                    <p className={styles.groupSubtitle}>{section.subtitle}</p>
                  </div>

                  <div className={styles.groupStacks}>
                    {section.groups.map((group) => (
                      <div key={group.id} className={styles.groupBlock}>
                        <BookShelf
                          title={group.title}
                          subtitle=""
                          books={group.books}
                          compactHeader
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (section.type === "bookshelf") {
              return (
                <BookShelf
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  books={section.items}
                />
              );
            }

            if (section.type === "exam") {
              return (
                <ExamSection
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  items={section.items}
                />
              );
            }

            return null;
          })}
        </div>
      </section>
    </main>
  );
}