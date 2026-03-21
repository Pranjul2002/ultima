"use client";
import Link from "next/link";
import styles from "./Products.module.css";

export default function ProductsPage() {
  return (
    <div className={styles.container}>

      {/* HERO */}
      <section className={styles.hero}>
        <h1>Choose Your Preparation Plan</h1>
        <p>Practice smarter with structured tests & real exam simulations</p>
      </section>

      {/* BOARD SECTION */}
      <section className={styles.section}>
        <h2>Board Exam Preparation</h2>

        {/* BOOSTER TEXT */}
        <p className={styles.sectionSub}>
          Join thousands of students improving their scores 🚀
        </p>

        <div className={styles.grid}>

          {/* CLASS 10 */}
          <div className={`${styles.productCard} ${styles.popular}`}>
            <div className={styles.badge}>🔥 Most Popular</div>

            <div className={styles.top}>
              <h3>📘 Class 10 Complete Prep</h3>
              <div className={styles.priceBox}>
                <span className={styles.oldPrice}>₹999</span>
                <span className={styles.price}>₹499</span>
              </div>
            </div>

            <p className={styles.trust}>👨‍🎓 5,000+ students practicing</p>

            <p className={styles.tagline}>
              🚀 Score higher with structured practice & real exam simulations
            </p>

            <div className={styles.features}>
              <div>✔ 500+ Practice Questions</div>
              <div>✔ Chapter-wise + Mock Tests</div>
              <div>✔ Real Exam Pattern</div>
              <div>✔ Instant Performance Analysis</div>
            </div>

            <div className={styles.resultBox}>
              Improve accuracy, speed & confidence before exams
            </div>

            <p className={styles.urgency}>⏳ Limited time price</p>

            <div className={styles.ctaWrapper}>
              <Link href="/checkout/class_10" className={styles.buyBtn}>
                Buy Full Pack →
              </Link>

              <Link href="/products/class_10" className={styles.exploreBtn}>
                Explore Subjects
              </Link>
            </div>
          </div>

          {/* CLASS 12 */}
          <div className={styles.productCard}>
            <div className={styles.top}>
              <h3>📗 Class 12 Master Prep</h3>
              <div className={styles.priceBox}>
                <span className={styles.oldPrice}>₹1299</span>
                <span className={styles.price}>₹699</span>
              </div>
            </div>

            <p className={styles.trust}>👨‍🎓 4,000+ students practicing</p>

            <p className={styles.tagline}>
              🎯 Ace boards with full syllabus tests & advanced practice
            </p>

            <div className={styles.features}>
              <div>✔ Full PCM Coverage</div>
              <div>✔ Chapter-wise + Mock Tests</div>
              <div>✔ Board Pattern Questions</div>
              <div>✔ Accuracy Tracking</div>
            </div>

            <div className={styles.resultBox}>
              Build strong concepts & maximize your score
            </div>

            <p className={styles.urgency}>⏳ Limited time price</p>

            <div className={styles.ctaWrapper}>
              <Link href="/checkout/class_12" className={styles.buyBtn}>
                Buy Full Pack →
              </Link>

              <Link href="/products/class_12" className={styles.exploreBtn}>
                Explore Subjects
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* COMPETITIVE SECTION */}
      <section className={styles.section}>
        <h2>Competitive Exams</h2>

        <p className={styles.sectionSub}>
          Practice like real exam & boost your rank 📈
        </p>

        <div className={styles.grid}>

          {/* JEE */}
          <div className={`${styles.productCard} ${styles.popular}`}>
            <div className={styles.badge}>🔥 Most Popular</div>

            <div className={styles.top}>
              <h3>⚙️ JEE Advanced Practice</h3>
              <div className={styles.priceBox}>
                <span className={styles.oldPrice}>₹1999</span>
                <span className={styles.price}>₹999</span>
              </div>
            </div>

            <p className={styles.trust}>👨‍🎓 12,000+ students practicing</p>

            <p className={styles.tagline}>
              🚀 Crack JEE with exam-level questions & rank tracking
            </p>

            <div className={styles.features}>
              <div>✔ Advanced Level Questions</div>
              <div>✔ Full JEE Mock Tests</div>
              <div>✔ Rank & Percentile Analysis</div>
              <div>✔ Real Exam Simulation</div>
            </div>

            <div className={styles.resultBox}>
              Improve rank, speed & accuracy before exam
            </div>

            <p className={styles.urgency}>⏳ Limited time price</p>

            <div className={styles.ctaWrapper}>
              <Link href="/checkout/competetive/jee" className={styles.buyBtn}>
                Buy Full Pack →
              </Link>

              <Link href="/products/competetive/jee" className={styles.exploreBtn}>
                Explore Subjects
              </Link>
            </div>
          </div>

          {/* NEET */}
          <div className={styles.productCard}>
            <div className={styles.top}>
              <h3>🧬 NEET Complete Prep</h3>
              <div className={styles.priceBox}>
                <span className={styles.oldPrice}>₹1999</span>
                <span className={styles.price}>₹999</span>
              </div>
            </div>

            <p className={styles.trust}>👨‍🎓 10,000+ students practicing</p>

            <p className={styles.tagline}>
              🏥 Master NEET with NCERT-based tests & real simulations
            </p>

            <div className={styles.features}>
              <div>✔ Physics • Chemistry • Biology</div>
              <div>✔ NCERT Focused Questions</div>
              <div>✔ Full NEET Mock Tests</div>
              <div>✔ Weak Area Analysis</div>
            </div>

            <div className={styles.resultBox}>
              Boost score with targeted practice & smart insights
            </div>

            <p className={styles.urgency}>⏳ Limited time price</p>

            <div className={styles.ctaWrapper}>
              <Link href="/checkout/neet" className={styles.buyBtn}>
                Buy Full Pack →
              </Link>

              <Link href="/products/competetive/neet" className={styles.exploreBtn}>
                Explore Subjects
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}