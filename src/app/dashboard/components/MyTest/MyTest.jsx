"use client";

import { useMemo, useState } from "react";
import styles from "./MyTest.module.css";

const statusConfig = {
  passed: { label: "Passed", color: "#3dba74", bg: "#3dba7415" },
  failed: { label: "Failed", color: "#e8504a", bg: "#e8504a15" },
  pending: { label: "Pending", color: "#e8884a", bg: "#e8884a15" },
};

const TestRow = ({ test, onView }) => {
  const config = statusConfig[test.status] || statusConfig.pending;

  return (
    <div className={styles.testRow}>
      <div className={styles.testInfo}>
        <span className={styles.testTitle}>{test.title}</span>
        <span className={styles.testMeta}>
          {test.subject || "Subject"} {test.date ? `· ${test.date}` : ""}
        </span>
      </div>

      <div className={styles.testScore}>
        {test.status !== "pending" ? (
          <span className={styles.scoreNum}>
            {test.score}
            <span className={styles.scoreMax}>/{test.total}</span>
          </span>
        ) : (
          <span className={styles.pendingLabel}>—</span>
        )}
      </div>

      <div className={styles.testDuration}>
        <span>{test.duration || "—"}</span>
      </div>

      <div>
        <span
          className={styles.statusBadge}
          style={{ color: config.color, background: config.bg }}
        >
          {config.label}
        </span>
      </div>

      <button type="button" className={styles.viewBtn} onClick={() => onView(test)}>
        {test.status === "pending" ? "Start" : "Review"}
      </button>
    </div>
  );
};

const FilterTab = ({ label, active, onClick }) => (
  <button
    type="button"
    className={`${styles.filterTab} ${active ? styles.activeTab : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const SummaryCard = ({ label, value, color }) => (
  <div className={styles.summCard}>
    <span className={styles.summVal} style={color ? { color } : undefined}>
      {value}
    </span>
    <span className={styles.summLbl}>{label}</span>
  </div>
);

const TestsSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.summRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={`${styles.summCard} ${styles.skeletonBlock} ${styles.skeletonSummary}`} />
      ))}
    </div>

    <div className={styles.tableCard}>
      <div className={`${styles.tableHeader} ${styles.skeletonBlock} ${styles.skeletonHeader}`} />
      <div className={styles.testList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`${styles.testRow} ${styles.skeletonBlock} ${styles.skeletonRow}`} />
        ))}
      </div>
    </div>
  </div>
);

export default function MyTest({ tests = [], isLoading = false }) {
  const [filter, setFilter] = useState("all");
  const [selectedTest, setSelectedTest] = useState(null);

  const filtered = useMemo(() => {
    return filter === "all" ? tests : tests.filter((item) => item.status === filter);
  }, [filter, tests]);

  const completedTests = tests.filter((item) => item.status !== "pending");
  const passedCount = tests.filter((item) => item.status === "passed").length;
  const failedCount = tests.filter((item) => item.status === "failed").length;

  const passRate = completedTests.length
    ? Math.round((passedCount / completedTests.length) * 100)
    : 0;

  const avgScore = completedTests.length
    ? Math.round(
        completedTests.reduce((sum, item) => sum + (Number(item.score) || 0), 0) /
          completedTests.length
      )
    : 0;

  if (isLoading) {
    return <TestsSkeleton />;
  }

  if (selectedTest) {
    return (
      <div className={styles.root}>
        <button type="button" className={styles.backBtn} onClick={() => setSelectedTest(null)}>
          ← Back to Tests
        </button>

        <div className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div>
              <h3 className={styles.reviewTitle}>{selectedTest.title}</h3>
              <span className={styles.reviewMeta}>
                {selectedTest.subject || "Subject"}
                {selectedTest.date ? ` · ${selectedTest.date}` : ""}
                {selectedTest.duration ? ` · ${selectedTest.duration}` : ""}
              </span>
            </div>

            {selectedTest.status !== "pending" ? (
              <div className={styles.reviewScore}>
                <span className={styles.reviewScoreNum}>{selectedTest.score}</span>
                <span className={styles.reviewScoreMax}>/{selectedTest.total}</span>
              </div>
            ) : null}
          </div>

          <div className={styles.reviewBody}>
            <p className={styles.reviewNote}>
              {selectedTest.status === "pending"
                ? "This test is available and ready to start."
                : "Detailed answers and review analysis will be shown here after backend integration."}
            </p>

            <button type="button" className={styles.retakeBtn}>
              {selectedTest.status === "pending" ? "Start Test" : "Review Answers"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.summRow}>
        <SummaryCard label="Total Tests" value={tests.length} />
        <SummaryCard label="Passed" value={passedCount} color="#3dba74" />
        <SummaryCard label="Failed" value={failedCount} color="#e8504a" />
        <SummaryCard label="Pass Rate" value={`${passRate}%`} color="#9b7efc" />
        <SummaryCard label="Avg Score" value={avgScore} color="#e8884a" />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.cardTitle}>All Tests</span>

          <div className={styles.filterRow}>
            {["all", "passed", "failed", "pending"].map((value) => (
              <FilterTab
                key={value}
                label={value.charAt(0).toUpperCase() + value.slice(1)}
                active={filter === value}
                onClick={() => setFilter(value)}
              />
            ))}
          </div>
        </div>

        {!tests.length ? (
          <div className={styles.inlineEmpty}>No tests assigned yet.</div>
        ) : !filtered.length ? (
          <div className={styles.inlineEmpty}>No tests found for this filter.</div>
        ) : (
          <>
            <div className={styles.tableHead}>
              <span>Test</span>
              <span>Score</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className={styles.testList}>
              {filtered.map((test) => (
                <TestRow key={test.id} test={test} onView={setSelectedTest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}