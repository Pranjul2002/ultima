import Link from "next/link";
import styles from "./neet.module.css";

export default function NeetPage() {
  return (
    <div className={styles.container}>

      {/* Floating Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>
      {/* ================= 600+ STRATEGY ================= */}
        <section className={styles.strategySection}>

          <h2 className={styles.strategyTitle}>
            How to Score 600+ in NEET 🎯
          </h2>

          <p className={styles.strategySubtitle}>
            Follow a proven strategy used by top NEET rankers to maximize your score.
          </p>

          <div className={styles.strategyFlow}>

            {/* STEP 1 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>01</div>
              <h4>Master NCERT First</h4>
              <p>
                Focus on NCERT line-by-line, especially Biology. Most NEET questions are directly based on it.
              </p>
            </div>

            {/* STEP 2 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>02</div>
              <h4>Practice Chapter-wise Tests</h4>
              <p>
                Strengthen each topic with targeted tests to eliminate weak areas early.
              </p>
            </div>

            {/* STEP 3 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>03</div>
              <h4>Revise with Full Syllabus Tests</h4>
              <p>
                Build retention and exam stamina with complete mock tests.
              </p>
            </div>

            {/* STEP 4 */}
            <div className={styles.strategyStep}>
              <div className={styles.stepNumber}>04</div>
              <h4>Analyze & Improve</h4>
              <p>
                Track mistakes, improve accuracy, and focus on weak areas using performance insights.
              </p>
            </div>

          </div>

        </section>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>NEET Test Series 🧬</h1>
        <p>
          Score high in NEET with NCERT-based practice, full syllabus tests & smart analysis.
        </p>

        <div className={styles.heroStats}>
          <span>✔ 9,000+ Aspirants</span>
          <span>✔ 100% NCERT Focus</span>
          <span>✔ Real Exam Pattern</span>
        </div>
      </section>
      
      {/* GRID */}
      <section className={styles.cardGrid}>

        {/* Biology */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Biology</h3>
            <span className={styles.students}>👨‍🎓 6,500+ students</span>
          </div>

          <p className={styles.subtitle}>
            Master NCERT line-by-line with high-yield practice questions
          </p>

          <div className={styles.topics}>
            Genetics • Human Physiology • Ecology • Biotechnology
          </div>

          <div className={styles.tags}>
            <span>🧬 NCERT Based</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Syllabus</span>
            <span>📝 PYQs</span>
          </div>

          <div className={styles.resultBox}>
            Boost retention & accuracy for maximum marks 🧠
          </div>

          <div className={styles.cta}>
            <Link href="/buy/neet-biology" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=neet&subject=biology"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>

        {/* Physics */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Physics</h3>
            <span className={styles.students}>👨‍🎓 4,200+ students</span>
          </div>

          <p className={styles.subtitle}>
            Improve numerical solving with NEET-level concept clarity
          </p>

          <div className={styles.topics}>
            Mechanics • Thermodynamics • Optics • Modern Physics
          </div>

          <div className={styles.tags}>
            <span>⚙️ Concept-Based</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 PYQs</span>
          </div>

          <div className={styles.resultBox}>
            Strengthen weak areas & improve accuracy ⚡
          </div>

          <div className={styles.cta}>
            <Link href="/buy/neet-physics" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=neet&subject=physics"
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
            <span className={styles.students}>👨‍🎓 4,800+ students</span>
          </div>

          <p className={styles.subtitle}>
            Focus on NCERT + conceptual clarity for high scoring
          </p>

          <div className={styles.topics}>
            Organic • Physical • Inorganic • Biomolecules
          </div>

          <div className={styles.tags}>
            <span>📘 NCERT Focus</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 PYQs</span>
          </div>

          <div className={styles.resultBox}>
            Improve score with better concept retention 📈
          </div>

          <div className={styles.cta}>
            <Link href="/buy/neet-chemistry" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?exam=neet&subject=chemistry"
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
              <span className={styles.students}>👨‍🎓 7,000+ attempts</span>
            </div>

            <p className={styles.subtitle}>
              Experience real NEET exam with full syllabus timed tests
            </p>

            <div className={styles.topics}>
              Complete Syllabus • 3 Hour Tests • Real Exam Pattern
            </div>

            <div className={styles.tags}>
              <span>⏱ 3 Hour Duration</span>
              <span>📊 Performance Analysis</span>
              <span>📈 Rank Prediction</span>
              <span>📝 Previous Year Level</span>
            </div>

            <div className={styles.resultBox}>
              Simulate real exam & boost confidence before NEET 🚀
            </div>

            <div className={styles.cta}>
              <Link href="/buy/neet-mock" className={styles.buyBtn}>
                Buy Now →
              </Link>

              <Link
                href="/test?exam=neet&type=mock"
                className={styles.sampleBtn}
              >
                Take Sample Test
              </Link>
            </div>
          </div>
      </section>
      
    </div>
  );
}