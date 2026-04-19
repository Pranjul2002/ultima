"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ChapterActions.module.css";

// ─── SVG Icons (unchanged from original) ──────────────────────────────────────

const ReadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2.5h4.5a2 2 0 0 1 2 2V13A1.5 1.5 0 0 0 7 11.5H2V2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M13 2.5H8.5a2 2 0 0 0-2 2V13a1.5 1.5 0 0 1 1.5-1.5H13V2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

const PracticeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7.5 4.5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const TestIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="2.5" y="1.5" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 5.5h5M5 8h5M5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M3 2.5h6.5l3 3V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M9.5 2.5v3H12.5M5 8h5M5 10.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── Action Config ─────────────────────────────────────────────────────────────

const STATIC_ACTIONS = [
  {
    id: "read",
    label: "Read",
    icon: <ReadIcon />,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    hrefKey: "read",
  },
  {
    id: "practice",
    label: "Practice",
    icon: <PracticeIcon />,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    hrefKey: "practice",
  },
  {
    id: "test",
    label: "Take Test",
    icon: <TestIcon />,
    color: "#dc2626",
    bg: "#fff5f5",
    border: "#fecaca",
    hrefKey: "test",
  },
  {
    id: "notes",
    label: "Notes",
    icon: <NotesIcon />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    hrefKey: "notes",
  },
];

// ─── API helper (inline — avoids import issues if productService doesn't exist yet) ──

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchLinkedTestId(bookSlug, chapterId) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/catalog/chapters/${bookSlug}/${chapterId}`,
      { credentials: "include" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.linkedTestId ?? null;
  } catch {
    return null;
  }
}

// ─── TestModal — inline MCQ test runner ───────────────────────────────────────

function TestModal({ testId, chapterTitle, onClose }) {
  const [phase, setPhase]       = useState("loading"); // loading | questions | result | error
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]   = useState({});         // { questionId: "A"|"B"|"C"|"D" }
  const [result, setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]  = useState("");

  // Load questions on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/tests/${testId}/questions`,
          { credentials: "include" }
        );
        if (res.status === 401) {
          setErrorMsg("Please log in to take this test.");
          setPhase("error");
          return;
        }
        if (!res.ok) throw new Error("Failed to load questions.");
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setErrorMsg("This test has no questions yet. Check back soon.");
          setPhase("error");
          return;
        }
        setQuestions(data);
        setPhase("questions");
      } catch (e) {
        setErrorMsg(e.message || "Something went wrong.");
        setPhase("error");
      }
    }
    load();
  }, [testId]);

  const handleSelect = useCallback((questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }, []);

  const handleSubmit = async () => {
    const answered = Object.keys(answers).length;
    if (answered < questions.length) {
      const unanswered = questions.length - answered;
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }

    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: Number(questionId),
          selectedAnswer,
        })),
      };
      const res = await fetch(`${API_BASE_URL}/api/tests/${testId}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Submission failed.");
      }
      const data = await res.json();
      setResult(data);
      setPhase("result");
    } catch (e) {
      setErrorMsg(e.message || "Submission error.");
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Result helpers ──
  const pct = result
    ? Math.round((result.score / (result.totalMarks || 1)) * 100)
    : 0;
  const passed = pct >= 40;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.modalEyebrow}>Chapter Test</span>
            <h2 className={styles.modalTitle}>{chapterTitle}</h2>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Loading */}
          {phase === "loading" && (
            <div className={styles.modalCenter}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Loading questions…</p>
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div className={styles.modalCenter}>
              <span className={styles.errorIcon}>⚠️</span>
              <p className={styles.errorText}>{errorMsg}</p>
              <button className={styles.retryBtn} onClick={onClose}>Close</button>
            </div>
          )}

          {/* Questions */}
          {phase === "questions" && (
            <>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
              </div>
              <p className={styles.progressLabel}>
                {Object.keys(answers).length} / {questions.length} answered
              </p>

              <div className={styles.questionsList}>
                {questions.map((q, idx) => (
                  <div key={q.id} className={styles.questionCard}>
                    <p className={styles.questionText}>
                      <span className={styles.questionNum}>Q{idx + 1}.</span>{" "}
                      {q.questionText}
                    </p>
                    <p className={styles.questionMarks}>{q.marks} mark{q.marks !== 1 ? "s" : ""}</p>

                    <div className={styles.optionsGrid}>
                      {["A", "B", "C", "D"].map((opt) => {
                        const text = q[`option${opt}`];
                        const selected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.optionBtn} ${selected ? styles.optionSelected : ""}`}
                            onClick={() => handleSelect(q.id, opt)}
                          >
                            <span className={styles.optionLetter}>{opt}</span>
                            <span className={styles.optionText}>{text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.submitRow}>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Test"}
                </button>
              </div>
            </>
          )}

          {/* Result */}
          {phase === "result" && result && (
            <div className={styles.resultPanel}>
              <div className={`${styles.resultBadge} ${passed ? styles.resultPass : styles.resultFail}`}>
                {passed ? "✅ Passed" : "❌ Failed"}
              </div>

              <div className={styles.scoreCircle}>
                <span className={styles.scoreMain}>{result.score}</span>
                <span className={styles.scoreMax}>/{result.totalMarks}</span>
              </div>
              <p className={styles.scorePct}>{pct}%</p>

              <div className={styles.resultStats}>
                <div className={styles.rStat}>
                  <span className={styles.rVal}>{result.totalQuestions}</span>
                  <span className={styles.rLbl}>Total</span>
                </div>
                <div className={styles.rStat}>
                  <span className={styles.rVal} style={{ color: "#059669" }}>{result.correctAnswers}</span>
                  <span className={styles.rLbl}>Correct</span>
                </div>
                <div className={styles.rStat}>
                  <span className={styles.rVal} style={{ color: "#dc2626" }}>{result.wrongAnswers}</span>
                  <span className={styles.rLbl}>Wrong</span>
                </div>
                <div className={styles.rStat}>
                  <span className={styles.rVal} style={{ color: "#6b7280" }}>
                    {result.totalQuestions - result.attemptedQuestions}
                  </span>
                  <span className={styles.rLbl}>Skipped</span>
                </div>
              </div>

              <div className={styles.resultActions}>
                <button className={styles.retakeBtn} onClick={() => {
                  setAnswers({});
                  setResult(null);
                  setPhase("questions");
                }}>
                  Retake Test
                </button>
                <button className={styles.doneBtn} onClick={onClose}>Done</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ChapterActions component ────────────────────────────────────────────

export default function ChapterActions({ chapterId, bookSlug, classSlug, chapterTitle = "Chapter Test" }) {
  const [testId, setTestId]     = useState(undefined); // undefined=loading, null=none, number=found
  const [showModal, setShowModal] = useState(false);

  // Fetch the linked backend testId for this chapter
  useEffect(() => {
    let cancelled = false;
    fetchLinkedTestId(bookSlug, chapterId).then((id) => {
      if (!cancelled) setTestId(id); // null if not found
    });
    return () => { cancelled = true; };
  }, [bookSlug, chapterId]);

  // Static href for non-test actions
  const staticHref = (type) => `/${type}/${classSlug}/${bookSlug}/${chapterId}`;

  return (
    <>
      <div className={styles.row}>
        {STATIC_ACTIONS.map((action) => {
          // ── "Take Test" button — special handling ──────────────────────────
          if (action.id === "test") {
            const isLoading = testId === undefined;
            const hasTest   = testId !== null && testId !== undefined;

            return (
              <button
                key={action.id}
                type="button"
                className={`${styles.btn} ${isLoading ? styles.btnLoading : ""} ${!hasTest && !isLoading ? styles.btnDisabled : ""}`}
                style={{
                  "--c":  hasTest ? action.color : "#9ca3af",
                  "--bg": hasTest ? action.bg    : "#f9fafb",
                  "--bd": hasTest ? action.border : "#e5e7eb",
                }}
                onClick={() => hasTest && setShowModal(true)}
                title={
                  isLoading  ? "Checking test availability…"
                  : !hasTest ? "No test linked to this chapter yet"
                  : "Take the chapter test"
                }
                disabled={isLoading || !hasTest}
              >
                <span className={styles.btnIcon}>
                  {isLoading ? (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={styles.spinnerIcon}>
                      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="20" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                  ) : action.icon}
                </span>
                <span className={styles.btnLabel}>
                  {isLoading ? "Loading…" : action.label}
                </span>
                {!isLoading && !hasTest && (
                  <span className={styles.soonBadge}>Soon</span>
                )}
              </button>
            );
          }

          // ── All other actions — standard Link ──────────────────────────────
          return (
            <Link
              key={action.id}
              href={staticHref(action.hrefKey)}
              className={styles.btn}
              style={{
                "--c":  action.color,
                "--bg": action.bg,
                "--bd": action.border,
              }}
            >
              <span className={styles.btnIcon}>{action.icon}</span>
              <span className={styles.btnLabel}>{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Live test modal */}
      {showModal && testId && (
        <TestModal
          testId={testId}
          chapterTitle={chapterTitle}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}