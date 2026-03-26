/* ================= CORE ANALYSIS ENGINE ================= */

export function analyzeTest({
  questions = [],
  answers = {},
  markedForReview = {},
  questionTimers = {},
  config = {},
}) {
  let correct = 0
  let wrong = 0
  let skipped = 0

  const topicMap = {}
  const difficultyMap = { easy: 0, medium: 0, hard: 0 }

  let totalTimeSpent = 0
  let attempted = 0

  /* ================= LOOP THROUGH QUESTIONS ================= */
  questions.forEach((q) => {
    const userAnswer = answers[q.id]
    const isSkipped = !userAnswer
    const isCorrect = userAnswer === q.answer

    const topic = q.topic || "General"
    const difficulty = q.difficulty || "medium"

    // Topic init
    if (!topicMap[topic]) {
      topicMap[topic] = {
        topic,
        total: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      }
    }

    topicMap[topic].total++

    if (isSkipped) {
      skipped++
      topicMap[topic].skipped++
    } else {
      attempted++
      if (isCorrect) {
        correct++
        topicMap[topic].correct++
      } else {
        wrong++
        topicMap[topic].wrong++
      }
    }

    // Difficulty tracking
    if (difficultyMap[difficulty] !== undefined) {
      if (isCorrect) difficultyMap[difficulty]++
    }

    // Time tracking
    const timeSpent = questionTimers[q.id]
      ? (config?.duration || 30) - questionTimers[q.id]
      : 0

    totalTimeSpent += timeSpent
  })

  /* ================= BASIC METRICS ================= */
  const total = questions.length
  const accuracy = attempted ? (correct / attempted) * 100 : 0
  const attemptRate = total ? (attempted / total) * 100 : 0
  const avgTime = attempted ? totalTimeSpent / attempted : 0

  /* ================= SCORE ================= */
  let score = correct
  if (config?.negativeMarking) {
    score = correct - wrong * 0.25
  }

  /* ================= TOPIC ANALYSIS ================= */
  const topicData = Object.values(topicMap).map((t) => ({
    ...t,
    accuracy: t.total ? ((t.correct / t.total) * 100).toFixed(1) : "0",
  }))

  const weakTopics = topicData
    .filter((t) => t.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy)

  const strongTopics = topicData
    .filter((t) => t.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy)

  /* ================= PERFORMANCE PERSONA ================= */
  let persona = "Balanced Performer"

  if (accuracy < 40) persona = "Needs Strategic Improvement"
  else if (accuracy < 60) persona = "Learning Phase"
  else if (accuracy < 80) persona = "Good Performer"
  else persona = "Top Performer"

  /* ================= AI INSIGHTS ================= */
  const insights = generateInsights({
    accuracy,
    attemptRate,
    avgTime,
    weakTopics,
    strongTopics,
    correct,
    wrong,
    skipped,
  })

  /* ================= RETURN ================= */
  return {
    score,
    correct,
    wrong,
    skipped,
    total,
    accuracy: accuracy.toFixed(1),
    attemptRate: attemptRate.toFixed(1),
    avgTime: avgTime.toFixed(1),
    topicData,
    weakTopics,
    strongTopics,
    persona,
    insights,
  }
}

/* ================= AI INSIGHT ENGINE ================= */

function generateInsights({
  accuracy,
  attemptRate,
  avgTime,
  weakTopics,
  strongTopics,
  correct,
  wrong,
  skipped,
}) {
  const insights = {
    strengths: [],
    weaknesses: [],
    behavior: [],
    actions: [],
  }

  /* ===== STRENGTHS ===== */
  if (accuracy > 70) {
    insights.strengths.push("Strong conceptual clarity across most questions")
  }

  if (strongTopics.length > 0) {
    insights.strengths.push(
      `High accuracy in ${strongTopics
        .slice(0, 2)
        .map((t) => t.topic)
        .join(", ")}`
    )
  }

  if (correct > wrong) {
    insights.strengths.push("Good answer selection with fewer mistakes")
  }

  /* ===== WEAKNESSES ===== */
  if (accuracy < 50) {
    insights.weaknesses.push("Conceptual understanding needs improvement")
  }

  if (weakTopics.length > 0) {
    insights.weaknesses.push(
      `Weak performance in ${weakTopics
        .slice(0, 3)
        .map((t) => t.topic)
        .join(", ")}`
    )
  }

  if (wrong > correct) {
    insights.weaknesses.push("High error rate indicates guessing or confusion")
  }

  /* ===== BEHAVIOR ===== */
  if (attemptRate < 60) {
    insights.behavior.push("Low attempt rate – lack of confidence or time issues")
  }

  if (avgTime < 10) {
    insights.behavior.push("Very fast answering – possible guessing")
  }

  if (avgTime > 40) {
    insights.behavior.push("Spending too much time per question")
  }

  if (skipped > correct) {
    insights.behavior.push("High skipped questions – needs practice")
  }

  /* ===== ACTION PLAN ===== */
  if (weakTopics.length > 0) {
    insights.actions.push(
      `Focus on weak topics: ${weakTopics
        .slice(0, 3)
        .map((t) => t.topic)
        .join(", ")}`
    )
  }

  if (accuracy < 60) {
    insights.actions.push("Revise fundamentals before next test")
  }

  if (attemptRate < 70) {
    insights.actions.push("Increase attempts with timed practice")
  }

  if (avgTime > 40) {
    insights.actions.push("Improve speed with mock tests")
  }

  return insights
}