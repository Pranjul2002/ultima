import Link from "next/link";
import styles from "./jee.module.css";

import BookShelf from "@/components/books/BookShelf";
const JEE_BOOKS = [
  {
    title: "Concepts of Physics (Vol. 1 & 2)",
    author: "H.C. Verma",
    label: "Physics · JEE",
    spineText: "H.C. Verma · Physics",
    qCount: 8,
    theme: "themeCrimson",
    emoji: "⚛️",
    practiceHref: "/test?class=12&subject=physics&book=hc-verma-jee",
    fullTestHref: "/test?exam=jee&subject=physics",
  },
  {
    title: "Problems in Physical Chemistry",
    author: "N. Avasthi",
    label: "Chemistry · JEE",
    spineText: "N. Avasthi · Physical Chem",
    qCount: 6,
    theme: "themeNavy",
    emoji: "🧬",
    practiceHref: "/test?class=12&subject=chemistry&book=avasthi-chemistry-jee",
    fullTestHref: "/test?exam=jee&subject=chemistry",
  },
  {
    title: "Plane Trigonometry",
    author: "S.L. Loney",
    label: "Mathematics · JEE",
    spineText: "S.L. Loney · Trigonometry",
    qCount: 6,
    theme: "themeSlate",
    emoji: "📐",
    practiceHref: "/test?class=12&subject=maths&book=sl-loney-maths-jee",
    fullTestHref: "/test?exam=jee&subject=maths",
  },
]

export default function JeePage() {
  return (
    <div className={styles.container}>

      {/* Floating Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      {/* ================= JEE STRATEGY ================= */}
        <section className={styles.strategySection}>

          <h2 className={styles.strategyTitle}>
            How to Improve Rank in JEE 🎯
          </h2>

          <p className={styles.strategySubtitle}>
            Follow a smart strategy used by top JEE aspirants to maximize rank & accuracy.
          </p>

          <div className={styles.strategyFlow}>

            {/* STEP 1 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>01</div>
              <h4>Build Strong Concepts</h4>
              <p>
                Focus on understanding fundamentals deeply, especially in Physics and Mathematics.
              </p>
            </div>

            {/* STEP 2 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>02</div>
              <h4>Practice Advanced Problems</h4>
              <p>
                Solve high-level questions to develop problem-solving skills and speed.
              </p>
            </div>

            {/* STEP 3 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>03</div>
              <h4>Focus on Weak Areas</h4>
              <p>
                Identify weak topics through tests and improve them with targeted practice.
              </p>
            </div>

            {/* STEP 4 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>04</div>
              <h4>Revise Regularly</h4>
              <p>
                Consistent revision is key to retaining concepts and improving accuracy.
              </p>
            </div>
          </div>

        </section>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>JEE Test Series 🎯</h1>
        <p>
          Crack JEE with advanced practice, real exam simulations & deep analysis.
        </p>

        <div className={styles.heroStats}>
          <span>✔ 8,000+ Aspirants</span>
          <span>✔ JEE Main + Advanced Level</span>
          <span>✔ Real Exam Pattern</span>
        </div>
      </section>
      {/* GRID */}
      <section className={styles.cardGrid}>
        
        {/* Physics */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Physics</h3>
            <span className={styles.students}>👨‍🎓 4,500+ students</span>
          </div>

          <p className={styles.subtitle}>
            Build strong concepts & master numerical problem solving
          </p>

          <div className={styles.topics}>
            Mechanics • Electrodynamics • Optics • Modern Physics
          </div>

          <div className={styles.tags}>
            <span>⚙️ Advanced Problems</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Length Tests</span>
            <span>📝 Previous Year Questions</span>
          </div>

          <div className={styles.resultBox}>
            Improve accuracy & rank with deep practice ⚡
          </div>

          <div className={styles.cta}>
            <Link href="/buy/jee-physics" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=jee&subject=physics"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>

        {/* Chemistry */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Chemistry</h3>
            <span className={styles.students}>👨‍🎓 4,000+ students</span>
          </div>

          <p className={styles.subtitle}>
            Master Organic, Physical & Inorganic with smart testing
          </p>

          <div className={styles.topics}>
            Organic • Physical • Inorganic • Surface Chemistry
          </div>

          <div className={styles.tags}>
            <span>⚙️ Advanced Problems</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Length Tests</span>
            <span>📝 PYQs</span>
          </div>

          <div className={styles.resultBox}>
            Boost accuracy & concept clarity 📈
          </div>

          <div className={styles.cta}>
            <Link href="/buy/jee-chemistry" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=jee&subject=chemistry"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>

        {/* Mathematics */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Mathematics</h3>
            <span className={styles.students}>👨‍🎓 5,200+ students</span>
          </div>

          <p className={styles.subtitle}>
            Solve high-level problems & increase speed under pressure
          </p>

          <div className={styles.topics}>
            Calculus • Algebra • Coordinate Geometry • Vectors
          </div>

          <div className={styles.tags}>
            <span>⚙️ Advanced Problems</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Length Tests</span>
            <span>📝 PYQs</span>
          </div>

          <div className={styles.resultBox}>
            Maximize score with faster problem solving ⚡
          </div>

          <div className={styles.cta}>
            <Link href="/buy/jee-maths" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=jee&subject=maths"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>
        {/* Full-Length Mock Tests */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Full-Length Mock Tests</h3>
              <span className={styles.students}>👨‍🎓 8,500+ attempts</span>
            </div>

            <p className={styles.subtitle}>
              Simulate real JEE Main & Advanced exams with high-level mock tests
            </p>

            <div className={styles.topics}>
              Complete Syllabus • 3 Hour Tests • JEE Main + Advanced Pattern
            </div>

            <div className={styles.tags}>
              <span>⏱ 3 Hour Duration</span>
              <span>📊 Detailed Analysis</span>
              <span>🏆 Rank Prediction</span>
              <span>📝 PYQ Level Questions</span>
            </div>

            <div className={styles.resultBox}>
              Improve rank, accuracy & time management 🚀
            </div>

            <div className={styles.cta}>
              <Link href="/buy/jee-mock" className={styles.buyBtn}>
                Buy Now →
              </Link>

              <Link
                href="/test?exam=jee&type=mock"
                className={styles.sampleBtn}
              >
                Take Sample Test
              </Link>
            </div>
          </div>
      </section>

      <BookShelf books={JEE_BOOKS} />

    </div>
  );
}