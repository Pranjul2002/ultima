"use client"

import styles from "./Startconfig.module.css"
import questionsData from "../../../data/questions" // ✅ adjust path if needed

export default function StartConfig({
  autoStartConfig,
  numQuestions,
  setNumQuestions,
  negativeMarking,
  setNegativeMarking,
  perQuestionTimeEnabled,
  setPerQuestionTimeEnabled,
  timePerQuestion,
  setTimePerQuestion,
  overallTime,
  setOverallTime,
  enterFullscreen,
  setConfig,
  setQuestionTimers,
}) {
  return (
    <div className={styles.pageBackground}>

      {/* ================= RULES ================= */}
      <div className={styles.rulesBox}>
        <h3 className={styles.rulesTitle}>Test Rules</h3>
        <ul className={styles.rulesList}>
          <li>Each question has a fixed time limit if enabled.</li>
          <li>Once time is up, the question will be locked automatically.</li>
          <li>Once you select an answer and move to the next question, you cannot change it.</li>
          <li>Questions marked for review can be revisited before time expires.</li>
          <li>The overall test timer runs continuously.</li>
          <li>Do not exit fullscreen during the test.</li>
          <li>Exiting fullscreen will auto-submit the test.</li>
        </ul>
      </div>

      {/* ================= CONFIG CARD ================= */}
      <div className={styles.startTestCard}>
        <h2 className={styles.startTitle}>Configure Your Test</h2>

        {/* ===== Number of Questions ===== */}
        <div className={styles.configItem}>
          <label>Number of Questions</label>
          <input
            type="number"
            min="1"
            max="100"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>

        {/* ===== Negative Marking ===== */}
        <div className={styles.configItem}>
          <label>Negative Marking</label>
          <select
            value={negativeMarking}
            onChange={(e) => setNegativeMarking(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* ===== Toggle Timer Mode ===== */}
        <div className={styles.configItem}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={perQuestionTimeEnabled}
              onChange={() => setPerQuestionTimeEnabled(!perQuestionTimeEnabled)}
            />
            Enable Time Limit Per Question
          </label>

          <span className={styles.toggleInstruction}>
            {perQuestionTimeEnabled ? (
              <>
                Each question has its own timer. If time ends, the question locks.
              </>
            ) : (
              "A single timer runs for the entire test."
            )}
          </span>
        </div>

        {/* ===== Time Per Question ===== */}
        <div className={styles.configItem}>
          <label>Time per Question (seconds)</label>
          <input
            type="number"
            value={timePerQuestion}
            onChange={(e) => setTimePerQuestion(Number(e.target.value))}
            disabled={!perQuestionTimeEnabled}
          />
        </div>

        {/* ===== Total Time ===== */}
        <div className={styles.configItem}>
          <label>Total Test Time (seconds)</label>
          <input
            type="number"
            value={overallTime}
            onChange={(e) => setOverallTime(Number(e.target.value))}
            disabled={perQuestionTimeEnabled}
          />
        </div>

        {/* ===== TOTAL DISPLAY ===== */}
        <div className={styles.totalTime}>
          Total Time:{" "}
          <strong>
            {perQuestionTimeEnabled
              ? `${numQuestions * timePerQuestion} sec`
              : `${overallTime} sec`}
          </strong>
        </div>

        {/* ================= START BUTTON ================= */}
        <button
          className={styles.buttonPrimary}
          type="button"
          onClick={() => {
            enterFullscreen()

            // ✅ STEP 1: Filter questions BEFORE config
            const selectedQuestions = questionsData
              .filter((q) => {
                return (
                  (!autoStartConfig.class || q.class?.toString() === autoStartConfig.class) &&
                  (!autoStartConfig.subject || q.subject?.toLowerCase() === autoStartConfig.subject?.toLowerCase()) &&
                  (!autoStartConfig.topic || q.topic?.toLowerCase() === autoStartConfig.topic?.toLowerCase())
                )
              })
              .slice(0, numQuestions)

            // ✅ STEP 2: Create timers safely
            const initialQuestionTimers = perQuestionTimeEnabled
              ? Object.fromEntries(
                  selectedQuestions.map((q) => [q.id, timePerQuestion])
                )
              : {}

            // ✅ STEP 3: Final total time
            const finalOverallTime = perQuestionTimeEnabled
              ? numQuestions * timePerQuestion
              : overallTime

            // ✅ STEP 4: Apply states
            setQuestionTimers(initialQuestionTimers)
            setOverallTime(finalOverallTime)

            // ✅ STEP 5: Set config → triggers test start
            setConfig({
              ...autoStartConfig,
              perQuestionTimeEnabled,
              duration: timePerQuestion,
              questionsPerPage: 1,
              numQuestions,
              negativeMarking,
              totalTime: finalOverallTime,
            })
          }}
        >
          Start Test
        </button>
      </div>
    </div>
  )
}