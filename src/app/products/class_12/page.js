import Link from "next/link";
import styles from "./class12.module.css";
import BookShelf from "../../../components/books/BookShelf";

const CLASS12_BOOKS = [
  {
    title: "Concepts of Physics (Vol. 2)",
    author: "H.C. Verma",
    label: "Physics · Class 12",
    spineText: "H.C. Verma · Physics",
    qCount: 8,
    theme: "themeCrimson",
    emoji: "⚛️",
    practiceHref: "/test?class=12&subject=physics&book=hc-verma-physics-12",
    fullTestHref: "/test?class=12&subject=physics",
  },
  {
    title: "Organic Chemistry",
    author: "O.P. Tandon",
    label: "Chemistry · Class 12",
    spineText: "O.P. Tandon · Organic Chem",
    qCount: 6,
    theme: "themeAmber",
    emoji: "🧪",
    practiceHref: "/test?class=12&subject=chemistry&book=op-tandon-chemistry-12",
    fullTestHref: "/test?class=12&subject=chemistry",
  },
  {
    title: "Mathematics (Vol. I & II)",
    author: "R.D. Sharma",
    label: "Mathematics · Class 12",
    spineText: "R.D. Sharma · Mathematics",
    qCount: 6,
    theme: "themeIndigo",
    emoji: "∫",
    practiceHref: "/test?class=12&subject=maths&book=rd-sharma-maths-12",
    fullTestHref: "/test?class=12&subject=maths",
  },
]

export default function Class12Page() {
  return (
    <div className={styles.container}>

      {/* Floating Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Class 12 Test Series 🚀</h1>
        <p>
          Prepare for boards & competitive exams with advanced level practice.
        </p>

        <div className={styles.heroStats}>
          <span>✔ 6,000+ Students</span>
          <span>✔ CBSE + Competitive Level</span>
          <span>✔ Real Exam Simulations</span>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className={styles.cardGrid}>

        {/* Physics */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Physics</h3>
            <span className={styles.students}>👨‍🎓 3,800+ students</span>
          </div>

          <p className={styles.subtitle}>
            Master numericals & concepts for boards + JEE/NEET
          </p>

          <div className={styles.topics}>
            Electrostatics • Current Electricity • Optics • Modern Physics
          </div>

          <div className={styles.tags}>
            <span>📘 Topic-wise</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 Mock Exams</span>
          </div>

          <div className={styles.resultBox}>
            Boost problem-solving & accuracy ⚡
          </div>

          <div className={styles.cta}>
            <Link href="/buy/physics-12" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?class=12&subject=physics"
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
            <span className={styles.students}>👨‍🎓 3,200+ students</span>
          </div>

          <p className={styles.subtitle}>
            Strengthen organic, inorganic & physical chemistry
          </p>

          <div className={styles.topics}>
            Organic • Electrochemistry • Coordination Compounds • Polymers
          </div>

          <div className={styles.tags}>
            <span>📘 Topic-wise</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 Mock Exams</span>
          </div>

          <div className={styles.resultBox}>
            Improve conceptual clarity & retention 📈
          </div>

          <div className={styles.cta}>
            <Link href="/buy/chemistry-12" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?class=12&subject=chemistry"
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
            <span className={styles.students}>👨‍🎓 4,500+ students</span>
          </div>

          <p className={styles.subtitle}>
            Practice advanced maths for boards & competitive exams
          </p>

          <div className={styles.topics}>
            Calculus • Algebra • Vectors • Probability
          </div>

          <div className={styles.tags}>
            <span>📘 Topic-wise</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 Mock Exams</span>
          </div>

          <div className={styles.resultBox}>
            Maximize speed & accuracy in problem solving ⚡
          </div>

          <div className={styles.cta}>
            <Link href="/buy/maths-12" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?class=12&subject=maths"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>

        {/* Biology */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Biology</h3>
            <span className={styles.students}>👨‍🎓 3,600+ students</span>
          </div>

          <p className={styles.subtitle}>
            Perfect for NEET aspirants & board preparation
          </p>

          <div className={styles.topics}>
            Genetics • Ecology • Human Physiology • Biotechnology
          </div>

          <div className={styles.tags}>
            <span>📘 Topic-wise</span>
            <span>📂 Chapter Tests</span>
            <span>🧠 Full Tests</span>
            <span>📝 Mock Exams</span>
          </div>

          <div className={styles.resultBox}>
            Boost retention & scoring ability 🧬
          </div>

          <div className={styles.cta}>
            <Link href="/buy/biology-12" className={styles.buyBtn}>
              Buy Now →
            </Link>

            <Link
              href="/test?class=12&subject=biology"
              className={styles.sampleBtn}
            >
              Take Sample Test
            </Link>
          </div>
        </div>

      </section>

      <BookShelf books={CLASS12_BOOKS} />

    </div>
  );
}