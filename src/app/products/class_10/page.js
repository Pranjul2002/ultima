import Link from "next/link";
import styles from "./class10.module.css";

export default function Class10Page() {
  return (
    <div className={styles.container}>

      {/* Floating Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Class 10 Test Series 🚀</h1>
        <p>
          Practice smarter with topic-wise, chapter-wise and full syllabus tests.
        </p>

        {/* Small trust line */}
        <div className={styles.heroStats}>
          <span>✔ 5,000+ Students</span>
          <span>✔ CBSE Pattern</span>
          <span>✔ Real Exam Experience</span>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className={styles.cardGrid}>

            {/* Physics */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Physics</h3>
                <span className={styles.students}>👨‍🎓 3,200+ students</span>
              </div>

              <p className={styles.subtitle}>
                Master concepts with structured tests & real exam patterns
              </p>

              <div className={styles.topics}>
                Light • Electricity • Magnetism • Human Eye
              </div>

              <div className={styles.tags}>
                <span>📘 Topic-wise</span>
                <span>📂 Chapter Tests</span>
                <span>🧠 Full Tests</span>
                <span>📝 Mock Exams</span>
              </div>

              <div className={styles.resultBox}>
                Improve accuracy, speed & confidence 🚀
              </div>

              <div className={styles.cta}>
                <Link href="/buy/physics" className={styles.buyBtn}>
                  Buy Now →
                </Link>

                <Link
                  href="/test?class=10&subject=physics"
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
                <span className={styles.students}>👨‍🎓 2,800+ students</span>
              </div>

              <p className={styles.subtitle}>
                Understand reactions & concepts with smart practice
              </p>

              <div className={styles.topics}>
                Chemical Reactions • Acids & Bases • Carbon
              </div>

              <div className={styles.tags}>
                <span>📘 Topic-wise</span>
                <span>📂 Chapter Tests</span>
                <span>🧠 Full Tests</span>
                <span>📝 Mock Exams</span>
              </div>

              <div className={styles.resultBox}>
                Strengthen concepts & boost retention 📈
              </div>

              <div className={styles.cta}>
                <Link href="/buy/chemistry" className={styles.buyBtn}>
                  Buy Now →
                </Link>

                <Link
                  href="/test?class=10&subject=chemistry"
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
                <span className={styles.students}>👨‍🎓 4,100+ students</span>
              </div>

              <p className={styles.subtitle}>
                Practice problem-solving with step-based tests
              </p>

              <div className={styles.topics}>
                Trigonometry • Algebra • Geometry • Statistics
              </div>

              <div className={styles.tags}>
                <span>📘 Topic-wise</span>
                <span>📂 Chapter Tests</span>
                <span>🧠 Full Tests</span>
                <span>📝 Mock Exams</span>
              </div>

              <div className={styles.resultBox}>
                Improve speed & accuracy in calculations ⚡
              </div>

              <div className={styles.cta}>
                <Link href="/buy/maths" className={styles.buyBtn}>
                  Buy Now →
                </Link>

                <Link
                  href="/test?class=10&subject=maths"
                  className={styles.sampleBtn}
                >
                  Take Sample Test
                </Link>
              </div>
            </div>

            {/* Social Science */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Social Science</h3>
                <span className={styles.students}>👨‍🎓 2,500+ students</span>
              </div>

              <p className={styles.subtitle}>
                Learn theory smartly with structured revision tests
              </p>

              <div className={styles.topics}>
                History • Geography • Civics • Economics
              </div>

              <div className={styles.tags}>
                <span>📘 Topic-wise</span>
                <span>📂 Chapter Tests</span>
                <span>🧠 Full Tests</span>
                <span>📝 Mock Exams</span>
              </div>

              <div className={styles.resultBox}>
                Boost memory & writing confidence 🧠
              </div>

              <div className={styles.cta}>
                <Link href="/buy/social" className={styles.buyBtn}>
                  Buy Now →
                </Link>

                <Link
                  href="/test?class=10&subject=social"
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