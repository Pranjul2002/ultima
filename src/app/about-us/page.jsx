"use client";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <h1 className={styles.fadeUp}>About Us</h1>
          <p className={styles.fadeUpDelay}>
            Smart learning. Real tests. Better results.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.statsSection}>
        <div className={styles.inner}>

          <div className={styles.statsWrapper}>

            <div className={styles.statBox}>
              <div className={styles.statIcon}>👨‍🎓</div>
              <h2>10K+</h2>
              <p>Active Students</p>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statIcon}>📝</div>
              <h2>500+</h2>
              <p>Tests Conducted</p>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statIcon}>📈</div>
              <h2>95%</h2>
              <p>Success Rate</p>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statIcon}>⚡</div>
              <h2>24/7</h2>
              <p>Practice Access</p>
            </div>

          </div>

        </div>
      </section>

      {/* WHO WE ARE */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.whoWrapper}>
            
            {/* LEFT */}
            <div className={styles.whoText}>
              <h2 className={styles.heading}>Who We Are</h2>

              <p className={styles.lead}>
                We are a modern EdTech platform built to transform the way students prepare for exams.
              </p>

              <p className={styles.description}>
                Instead of passive learning, we focus on 
                <span className={styles.highlight}> active practice, real-time testing,</span> 
                and <span className={styles.highlight}> performance analysis</span> to help
                students improve faster and smarter.
              </p>

              <div className={styles.points}>
                <div>Real exam-like experience</div>
                <div>Data-driven performance insights</div>
                <div>Focus on practice, not just theory</div>
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.whoCards}>
              <div className={styles.whoCard}>
                <h4>🎯 Smart Learning</h4>
                <p>Learn by practicing questions, not just watching lectures.</p>
              </div>

              <div className={styles.whoCard}>
                <h4>📊 Deep Analysis</h4>
                <p>Track performance with detailed insights and accuracy reports.</p>
              </div>

              <div className={styles.whoCard}>
                <h4>⚡ Exam Ready</h4>
                <p>Build speed, accuracy, and confidence with real test simulations.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTS */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2>Tests We Provide</h2>

          <div className={styles.testGrid}>
            <div className={styles.testCard}>
              <div className={styles.icon}>📘</div>
              <h4>Subject-wise Tests</h4>
              <p>Practice Physics, Chemistry, Maths with focused questions.</p>
              <span className={styles.tag}>Class 10 • 12</span>
            </div>

            <div className={styles.testCard}>
              <div className={styles.icon}>🧠</div>
              <h4>Topic-wise Tests</h4>
              <p>Master individual topics and strengthen weak concepts.</p>
              <span className={styles.tag}>Concept Focus</span>
            </div>

            <div className={styles.testCard}>
              <div className={styles.icon}>📝</div>
              <h4>Full-Length Mock Tests</h4>
              <p>Complete syllabus tests with real exam pattern.</p>
              <span className={styles.tag}>JEE • NEET • Boards</span>
            </div>

            <div className={styles.testCard}>
              <div className={styles.icon}>⚡</div>
              <h4>Timed Practice Tests</h4>
              <p>Improve speed and accuracy under time pressure.</p>
              <span className={styles.tag}>Speed Training</span>
            </div>

            <div className={styles.testCard}>
              <div className={styles.icon}>📊</div>
              <h4>Performance-Based Tests</h4>
              <p>Personalized tests based on your weak areas.</p>
              <span className={styles.tag}>Adaptive</span>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className={styles.section}>
        <div className={styles.inner}>

          <div className={styles.mvWrapper}>

            {/* MISSION */}
            <div className={styles.mvBlock}>
              <h3 className={styles.mvTitle}>Our Mission</h3>

              <p className={styles.mvMain}>
                To transform exam preparation into a structured, practice-driven journey.
              </p>

              <p className={styles.mvSub}>
                We focus on helping students learn actively through testing, gain insights 
                from performance analysis, and continuously improve with clarity and confidence.
              </p>
            </div>

            {/* DIVIDER */}
            <div className={styles.mvDivider}></div>

            {/* VISION */}
            <div className={styles.mvBlock}>
              <h3 className={styles.mvTitle}>Our Vision</h3>

              <p className={styles.mvMain}>
                To build a future where every student has access to intelligent, personalized learning.
              </p>

              <p className={styles.mvSub}>
                We envision a platform that adapts to every learner, making preparation smarter,
                more efficient, and accessible to all.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <div className={styles.inner}>

          <h2>Features</h2>

          <p className={styles.featuresIntro}>
            Designed to help you practice smarter and perform better.
          </p>

          <div className={styles.timeline}>

            <div className={`${styles.timelineItem} ${styles.left}`}>
              <div className={styles.content}>
                <h4>🧠 Smart Test System</h4>
                <p>Adaptive tests that match your preparation level.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.right}`}>
              <div className={styles.content}>
                <h4>⏱️ Advanced Timer</h4>
                <p>Simulates real exam pressure with precision timing.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.left}`}>
              <div className={styles.content}>
                <h4>📊 Performance Analysis</h4>
                <p>Detailed insights to track strengths and weaknesses.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.right}`}>
              <div className={styles.content}>
                <h4>🔁 Review & Mark</h4>
                <p>Mark questions and revisit them anytime.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.left}`}>
              <div className={styles.content}>
                <h4>📚 Question Bank</h4>
                <p>Large collection of curated exam-level questions.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.right}`}>
              <div className={styles.content}>
                <h4>⚡ Real Exam Simulation</h4>
                <p>Experience actual exam environment before the real test.</p>
              </div>
            </div>

          </div>

        </div>
      </section>
      {/* APPROACH */}
      <section className={styles.highlightSection}>
        <div className={styles.inner}>

          <h2>Our Approach</h2>

          <div className={styles.approachFlow}>

            <div className={styles.step}>
              <div className={styles.stepIcon}>📝</div>
              <p>Practice</p>
            </div>

            <div className={styles.line}></div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>📊</div>
              <p>Analyze</p>
            </div>

            <div className={styles.line}></div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>📈</div>
              <p>Improve</p>
            </div>

            <div className={styles.line}></div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>🏆</div>
              <p>Succeed</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}