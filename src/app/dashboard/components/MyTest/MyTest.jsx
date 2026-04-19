"use client";

import { useMemo, useState, useCallback } from "react";
import styles from "./MyTest.module.css";
import { getTestQuestions, submitTest, getMyTests } from "@/services/dashboardService";

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig = {
  passed:  { label: "Passed",  color: "#3dba74", bg: "#3dba7415" },
  failed:  { label: "Failed",  color: "#e8504a", bg: "#e8504a15" },
  pending: { label: "Pending", color: "#e8884a", bg: "#e8884a15" },
};

// ── Small reusable bits ───────────────────────────────────────────────────────
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

// ── Skeleton ──────────────────────────────────────────────────────────────────
const TestsSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.summRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`${styles.summCard} ${styles.skeletonBlock} ${styles.skeletonSummary}`} />
      ))}
    </div>
    <div className={styles.tableCard}>
      <div className={`${styles.tableHeader} ${styles.skeletonBlock} ${styles.skeletonHeader}`} />
      <div className={styles.testList}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${styles.testRow} ${styles.skeletonBlock} ${styles.skeletonRow}`} />
        ))}
      </div>
    </div>
  </div>
);

// ── Test row ──────────────────────────────────────────────────────────────────
const TestRow = ({ test, onStart, onReview }) => {
  const config = statusConfig[test.status] || statusConfig.pending;
  const isPending = test.status === "pending";

  return (
    <div className={styles.testRow}>
      <div className={styles.testInfo}>
        <span className={styles.testTitle}>{test.title}</span>
        <span className={styles.testMeta}>
          {test.subject || "General"} {test.date ? `· ${test.date}` : ""}
        </span>
      </div>

      <div className={styles.testScore}>
        {!isPending ? (
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

      <button
        type="button"
        className={styles.viewBtn}
        onClick={() => (isPending ? onStart(test) : onReview(test))}
      >
        {isPending ? "Start" : "Review"}
      </button>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════════════
export default function MyTest({ tests: initialTests = [], isLoading = false }) {
  const [tests,        setTests]        = useState(initialTests);
  const [filter,       setFilter]       = useState("all");
  const [view,         setView]         = useState("list");   // "list" | "taking" | "result" | "review"
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions,    setQuestions]    = useState([]);
  const [answers,      setAnswers]      = useState({});       // questionId → selected option letter
  const [currentQ,     setCurrentQ]     = useState(0);
  const [result,       setResult]       = useState(null);
  const [loadingQ,     setLoadingQ]     = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");

  // Keep in sync when parent refreshes
  useMemo(() => { setTests(initialTests); }, [initialTests]);

  // ── Filtered list ───────────────────────────────────────────────────────
  const filtered = useMemo(
    () => filter === "all" ? tests : tests.filter((t) => t.status === filter),
    [filter, tests]
  );

  // ── Stats ───────────────────────────────────────────────────────────────
  const completedTests = tests.filter((t) => t.status !== "pending");
  const passedCount    = tests.filter((t) => t.status === "passed").length;
  const failedCount    = tests.filter((t) => t.status === "failed").length;
  const passRate       = completedTests.length
    ? Math.round((passedCount / completedTests.length) * 100) : 0;
  const avgScore       = completedTests.length
    ? Math.round(completedTests.reduce((s, t) => s + (Number(t.score) || 0), 0) / completedTests.length)
    : 0;

  // ── Start test ──────────────────────────────────────────────────────────
  const handleStart = useCallback(async (test) => {
    setError("");
    setLoadingQ(true);
    setSelectedTest(test);
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    try {
      const qs = await getTestQuestions(test.id);
      setQuestions(qs);
      setView("taking");
    } catch (e) {
      setError(e.message || "Could not load questions. Please try again.");
      setView("list");
    } finally {
      setLoadingQ(false);
    }
  }, []);

  // ── Review past test ────────────────────────────────────────────────────
  const handleReview = useCallback((test) => {
    setSelectedTest(test);
    setView("review");
  }, []);

  // ── Answer selection ────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionId, letter) => {
    setAnswers((prev) => ({ ...prev, [questionId]: letter }));
  }, []);

  // ── Submit test ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedTest) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: Number(questionId),
          selectedAnswer,
        })),
      };
      const res = await submitTest(selectedTest.id, payload);
      setResult(res);
      setView("result");

      // Refresh test list so the status badge updates
      try {
        const refreshed = await getMyTests("FREE");
        setTests(refreshed);
      } catch (_) { /* non-critical */ }
    } catch (e) {
      setError(e.message || "Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [selectedTest, answers]);

  // ── Back to list ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setView("list");
    setSelectedTest(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setError("");
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Loading skeleton
  // ════════════════════════════════════════════════════════════════════════
  if (isLoading) return <TestsSkeleton />;

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Question-loading spinner
  // ════════════════════════════════════════════════════════════════════════
  if (loadingQ) {
    return (
      <div className={styles.root}>
        <div className={styles.centreBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingMsg}>Loading questions…</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Test-taking view
  // ════════════════════════════════════════════════════════════════════════
  if (view === "taking" && selectedTest && questions.length > 0) {
    const q       = questions[currentQ];
    const total   = questions.length;
    const answered = Object.keys(answers).length;
    const progress = Math.round((answered / total) * 100);

    const options = [
      { letter: "A", text: q.optionA },
      { letter: "B", text: q.optionB },
      { letter: "C", text: q.optionC },
      { letter: "D", text: q.optionD },
    ];

    return (
      <div className={styles.root}>
        {/* Header */}
        <div className={styles.takingHeader}>
          <div>
            <h3 className={styles.takingTitle}>{selectedTest.title}</h3>
            <span className={styles.takingMeta}>
              {selectedTest.subject} · Question {currentQ + 1} of {total}
            </span>
          </div>
          <div className={styles.takingProgress}>
            <span className={styles.progressLabel}>{answered}/{total} answered</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className={styles.questionCard}>
          <div className={styles.qNumber}>Q{currentQ + 1}</div>
          <p className={styles.qText}>{q.questionText}</p>

          <div className={styles.optionsGrid}>
            {options.map(({ letter, text }) => {
              const selected = answers[q.id] === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  className={`${styles.optionBtn} ${selected ? styles.optionSelected : ""}`}
                  onClick={() => handleAnswer(q.id, letter)}
                >
                  <span className={styles.optionLetter}>{letter}</span>
                  <span className={styles.optionText}>{text}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.qMarks}>Marks: {q.marks}</div>
        </div>

        {/* Nav buttons */}
        <div className={styles.takingNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
          >
            ← Previous
          </button>

          {/* Question palette */}
          <div className={styles.palette}>
            {questions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.paletteDot} ${idx === currentQ ? styles.paletteCurrent : ""} ${answers[questions[idx].id] ? styles.paletteAnswered : ""}`}
                onClick={() => setCurrentQ(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQ < total - 1 ? (
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setCurrentQ((p) => Math.min(total - 1, p + 1))}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.navBtn} ${styles.submitBtn}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Test"}
            </button>
          )}
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Result view
  // ════════════════════════════════════════════════════════════════════════
  if (view === "result" && result) {
    const pct = result.totalMarks > 0
      ? Math.round((result.score / result.totalMarks) * 100) : 0;
    const passed = pct >= 40;

    return (
      <div className={styles.root}>
        <button type="button" className={styles.backBtn} onClick={handleBack}>
          ← Back to Tests
        </button>

        <div className={styles.reviewCard}>
          <div className={styles.reviewHeader} style={{ background: passed ? "#0f1117" : "#2d0a0a" }}>
            <div>
              <h3 className={styles.reviewTitle}>{selectedTest?.title}</h3>
              <span className={styles.reviewMeta}>{selectedTest?.subject}</span>
            </div>
            <div className={styles.reviewScore}>
              <span className={styles.reviewScoreNum} style={{ color: passed ? "#e8ff5a" : "#f87171" }}>
                {result.score}
              </span>
              <span className={styles.reviewScoreMax}>/{result.totalMarks}</span>
            </div>
          </div>

          <div className={styles.reviewBody}>
            <div className={styles.resultBadge} style={{
              background: passed ? "#3dba7415" : "#e8504a15",
              color: passed ? "#3dba74" : "#e8504a",
            }}>
              {passed ? "🎉 You Passed!" : "❌ Better luck next time"}
            </div>

            <div className={styles.resultGrid}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatVal}>{result.totalQuestions}</span>
                <span className={styles.resultStatLbl}>Total Questions</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatVal}>{result.attemptedQuestions}</span>
                <span className={styles.resultStatLbl}>Attempted</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatVal} style={{ color: "#3dba74" }}>
                  {result.correctAnswers}
                </span>
                <span className={styles.resultStatLbl}>Correct</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatVal} style={{ color: "#e8504a" }}>
                  {result.wrongAnswers}
                </span>
                <span className={styles.resultStatLbl}>Wrong</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatVal} style={{ color: "#9b7efc" }}>{pct}%</span>
                <span className={styles.resultStatLbl}>Score %</span>
              </div>
            </div>

            <button type="button" className={styles.retakeBtn} onClick={handleBack}>
              Back to My Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Review view (for already-completed tests)
  // ════════════════════════════════════════════════════════════════════════
  if (view === "review" && selectedTest) {
    return (
      <div className={styles.root}>
        <button type="button" className={styles.backBtn} onClick={handleBack}>
          ← Back to Tests
        </button>

        <div className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div>
              <h3 className={styles.reviewTitle}>{selectedTest.title}</h3>
              <span className={styles.reviewMeta}>
                {selectedTest.subject}
                {selectedTest.date ? ` · ${selectedTest.date}` : ""}
              </span>
            </div>
            <div className={styles.reviewScore}>
              <span className={styles.reviewScoreNum}>{selectedTest.score}</span>
              <span className={styles.reviewScoreMax}>/{selectedTest.total}</span>
            </div>
          </div>

          <div className={styles.reviewBody}>
            <p className={styles.reviewNote}>
              You scored <strong>{selectedTest.score}/{selectedTest.total}</strong> on this test.
              Detailed answer-by-answer breakdown will be available in a future update.
            </p>
            <button type="button" className={styles.retakeBtn} onClick={() => handleStart(selectedTest)}>
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Main list view
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className={styles.root}>
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Summary cards */}
      <div className={styles.summRow}>
        <SummaryCard label="Total Tests"  value={tests.length} />
        <SummaryCard label="Passed"       value={passedCount}  color="#3dba74" />
        <SummaryCard label="Failed"       value={failedCount}  color="#e8504a" />
        <SummaryCard label="Pass Rate"    value={`${passRate}%`} color="#9b7efc" />
        <SummaryCard label="Avg Score"    value={avgScore}     color="#e8884a" />
      </div>

      {/* Table card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.cardTitle}>My Tests</span>
          <div className={styles.filterRow}>
            {["all", "passed", "failed", "pending"].map((val) => (
              <FilterTab
                key={val}
                label={val.charAt(0).toUpperCase() + val.slice(1)}
                active={filter === val}
                onClick={() => setFilter(val)}
              />
            ))}
          </div>
        </div>

        {tests.length === 0 ? (
          <div className={styles.inlineEmpty}>No tests available yet.</div>
        ) : filtered.length === 0 ? (
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
                <TestRow
                  key={test.id}
                  test={test}
                  onStart={handleStart}
                  onReview={handleReview}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}