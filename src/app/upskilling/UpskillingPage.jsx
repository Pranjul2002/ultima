"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import styles from "./upskilling.module.css"

// ─────────────────────────────────────────────────────────────
//  TEMPORARY: calling Groq directly until backend is integrated
//  TODO: replace with backend proxy once Spring Boot is ready
// ─────────────────────────────────────────────────────────────
const GROQ_KEY = "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"  // replace with your key

const MODES = [
  { id: "qa",         label: "Ask Freely",        emoji: "💬", desc: "Ask any question about your material" },
  { id: "summary",    label: "Summarise & Quiz",   emoji: "📋", desc: "Get a summary, then take a quiz" },
  { id: "mcq",        label: "MCQ Quiz",           emoji: "🧠", desc: "AI generates 5 MCQs from your content" },
  { id: "subjective", label: "Subjective Quiz",    emoji: "✍️",  desc: "AI asks open-ended questions one by one" },
  { id: "evaluate",   label: "Evaluate My Answer", emoji: "🎯", desc: "Write an answer and AI grades it" },
]

// ─────────────────────────────────────────────────────────────
//  callAI — calls Groq directly (temporary until backend ready)
//  Set NEXT_PUBLIC_GROQ_API_KEY in your .env.local
// ─────────────────────────────────────────────────────────────
async function callAI(systemPrompt, userMessage) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? "No response."
}
// ─────────────────────────────────────────────────────────────
//  PDF text extractor — pdf.js loaded lazily from CDN
// ─────────────────────────────────────────────────────────────
async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
  }

  const buffer = await file.arrayBuffer()
  const pdf    = await window.pdfjsLib.getDocument({ data: buffer }).promise
  let text = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(" ") + "\n"
  }

  return text.trim()
}

// ─────────────────────────────────────────────────────────────
//  MCQ parser — turns Groq's numbered list into objects
// ─────────────────────────────────────────────────────────────
function parseMCQs(text) {
  const questions = []
  const blocks    = text.split(/\n(?=\d+[\.\)])/g)

  for (const block of blocks) {
    const lines        = block.split("\n").map(l => l.trim()).filter(Boolean)
    if (lines.length < 5) continue

    const questionText = lines[0].replace(/^\d+[\.\)]\s*/, "").trim()
    const options      = []
    let   answer       = ""

    for (const line of lines.slice(1)) {
      if (/^[A-D][\.\)]/i.test(line)) {
        options.push(line.replace(/^[A-D][\.\)]\s*/i, "").trim())
      } else if (/^answer\s*:/i.test(line)) {
        const letter = line.replace(/^answer\s*:\s*/i, "").trim().charAt(0).toUpperCase()
        const idx    = letter.charCodeAt(0) - 65
        answer       = options[idx] ?? letter
      }
    }

    if (questionText && options.length >= 2) {
      questions.push({ question: questionText, options, answer })
    }
  }

  return questions
}

// ─────────────────────────────────────────────────────────────
//  Chat message bubble
// ─────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAI}`}>
      {!isUser && <span className={styles.aiAvatar}>✦</span>}
      <div className={styles.bubbleContent}>
        {msg.text.split("\n").map((line, i) => (
          <p key={i} className={styles.bubbleLine}>{line}</p>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Inline MCQ widget
// ─────────────────────────────────────────────────────────────
function MCQWidget({ questions, onDone }) {
  const [current,  setCurrent]  = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score,    setScore]    = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[current]

  const handleSelect = (opt) => { if (!revealed) setSelected(opt) }

  const handleCheck = () => {
    if (!selected) return
    if (selected === q.answer) setScore(s => s + 1)
    setRevealed(true)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setSelected(null)
    setRevealed(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className={styles.mcqDone}>
        <p className={styles.mcqDoneTitle}>Quiz Complete</p>
        <p className={styles.mcqDoneScore}>{score} / {questions.length} — {pct}%</p>
        <p className={styles.mcqDoneMsg}>
          {pct >= 80 ? "🎉 Excellent work!" : pct >= 50 ? "👍 Good effort, keep practising!" : "💪 Review the material and try again!"}
        </p>
        <button className={styles.mcqDoneBtn} onClick={onDone}>Continue →</button>
      </div>
    )
  }

  return (
    <div className={styles.mcqWidget}>
      <div className={styles.mcqHeader}>
        <span className={styles.mcqCount}>Q{current + 1} / {questions.length}</span>
        <div className={styles.mcqBar}>
          <div className={styles.mcqBarFill} style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
      </div>

      <p className={styles.mcqQuestion}>{q.question}</p>

      <div className={styles.mcqOptions}>
        {q.options.map((opt, i) => {
          let cls = styles.mcqOption
          if (revealed) {
            if (opt === q.answer)    cls = `${styles.mcqOption} ${styles.mcqCorrect}`
            else if (opt === selected) cls = `${styles.mcqOption} ${styles.mcqWrong}`
          } else if (opt === selected) {
            cls = `${styles.mcqOption} ${styles.mcqSelected}`
          }
          return <button key={i} className={cls} onClick={() => handleSelect(opt)}>{opt}</button>
        })}
      </div>

      <div className={styles.mcqActions}>
        {!revealed
          ? <button className={styles.mcqCheckBtn} onClick={handleCheck} disabled={!selected}>Check Answer</button>
          : <button className={styles.mcqNextBtn}  onClick={handleNext}>{current + 1 >= questions.length ? "See Results" : "Next →"}</button>
        }
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────────
export default function UpskillingPage() {

  const [material,            setMaterial]            = useState("")
  const [materialLabel,       setMaterialLabel]       = useState("")
  const [mode,                setMode]                = useState(null)
  const [messages,            setMessages]            = useState([])
  const [input,               setInput]               = useState("")
  const [loading,             setLoading]             = useState(false)
  const [mcqQuestions,        setMcqQuestions]        = useState(null)
  const [isListening,         setIsListening]         = useState(false)
  const [isMaterialListening, setIsMaterialListening] = useState(false)
  const [voiceSupported,      setVoiceSupported]      = useState(false)
  const [uploadLoading,       setUploadLoading]       = useState(false)
  const [error,               setError]               = useState("")
  const [step,                setStep]                = useState("material")

  const chatEndRef          = useRef(null)
  const fileInputRef        = useRef(null)
  const recognitionRef      = useRef(null)   // chat voice
  const materialRecognition = useRef(null)   // material voice

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, mcqQuestions, loading])

  // Voice recognition — Chrome/Edge only
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setVoiceSupported(false); return }
    setVoiceSupported(true)
    const r          = new SR()
    r.continuous     = false
    r.interimResults = false
    r.lang           = "en-IN"
    r.onresult = (e) => {
      const t = e.results[0][0].transcript
      setInput(prev => prev ? prev + " " + t : t)
      setIsListening(false)
    }
    r.onerror = (e) => {
      if (e.error === "not-allowed") setError("Microphone access denied. Please allow mic permission in browser settings.")
      setIsListening(false)
    }
    r.onend = () => setIsListening(false)
    recognitionRef.current = r
  }, [])

  // Toggle voice input for the material textarea
  const toggleMaterialVoice = async () => {
    if (!voiceSupported) {
      setError("Voice input works on Chrome or Edge only.")
      return
    }
    try { await navigator.mediaDevices.getUserMedia({ audio: true }) }
    catch { setError("Microphone access denied. Allow mic permission and try again."); return }

    if (isMaterialListening) {
      materialRecognition.current?.stop()
      setIsMaterialListening(false)
      return
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r  = new SR()
    r.continuous     = true    // keep listening until manually stopped
    r.interimResults = false
    r.lang           = "en-IN"
    r.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join(" ")
      setMaterial(prev => (prev ? prev + " " + transcript : transcript).trim())
      setMaterialLabel("🎙️ Voice + text")
    }
    r.onerror = (e) => {
      if (e.error === "not-allowed") setError("Microphone access denied.")
      setIsMaterialListening(false)
    }
    r.onend = () => setIsMaterialListening(false)
    materialRecognition.current = r
    r.start()
    setError("")
    setIsMaterialListening(true)
  }

  const toggleVoice = async () => {
    if (!voiceSupported) {
      setError("Voice input works on Chrome or Edge only. Please type your message instead.")
      return
    }
    try { await navigator.mediaDevices.getUserMedia({ audio: true }) }
    catch { setError("Microphone access denied. Allow mic permission in browser settings and try again."); return }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false) }
    else             { setError(""); recognitionRef.current.start(); setIsListening(true) }
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setUploadLoading(true)
    try {
      if (file.type === "application/pdf") {
        const text = await extractPdfText(file)
        if (!text) throw new Error("Could not extract text. Make sure this is a text-based PDF, not a scanned image.")
        setMaterial(text)
        setMaterialLabel(`📄 ${file.name}`)
      } else if (file.type.startsWith("image/")) {
        setError("⚠️ Image input isn't supported on Groq. Please paste the text from your notes in the box below, or upload a text-based PDF.")
      } else {
        throw new Error("Unsupported file type. Upload a PDF or paste your text.")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadLoading(false)
      e.target.value = ""
    }
  }

  const handleMaterialReady = () => {
    if (!material.trim()) { setError("Please add study material first."); return }
    setError("")
    setStep("mode")
  }

  const buildSystem = useCallback(() =>
    `You are a smart, encouraging study assistant for Indian students (Class 10, Class 12, JEE, NEET).
The student has provided this study material:

---
${material.slice(0, 14000)}
---

Always base every response strictly on this material. Be concise, clear, and encouraging.`,
  [material])

  const handleStartMode = async (selectedMode) => {
    setMode(selectedMode)
    setMessages([])
    setMcqQuestions(null)
    setError("")
    setStep("chat")

    const sys = buildSystem()

    if (selectedMode === "summary") {
      setLoading(true)
      try {
        const reply = await callAI(
          sys,
          `Give a clear, well-structured summary of the study material using bullet points. Cover all key concepts. After the summary, ask: "Ready for a quiz on this? Type yes to start."`
        )
        setMessages([{ role: "ai", text: reply }])
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }

    } else if (selectedMode === "mcq") {
      setLoading(true)
      try {
        const reply = await callAI(
          sys,
          `Generate exactly 5 multiple choice questions from this material. Use EXACTLY this format for every question:

1. [Question]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Answer: [Letter only]

Make questions progressively harder and cover different topics.`
        )
        const parsed = parseMCQs(reply)
        if (parsed.length === 0) {
          setMessages([{ role: "ai", text: reply }])
        } else {
          setMcqQuestions(parsed)
          setMessages([{ role: "ai", text: "Here are your 5 MCQs — work through them below 👇" }])
        }
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }

    } else if (selectedMode === "subjective") {
      setLoading(true)
      try {
        const reply = await callAI(
          sys,
          `You will quiz the student with 4-5 open-ended questions, one at a time. Ask your first question now. Make it thought-provoking but fair for the level of this material. After each answer, give 1-2 sentences of feedback, then ask the next question. After the final question, give an overall assessment.`
        )
        setMessages([{ role: "ai", text: reply }])
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }

    } else if (selectedMode === "evaluate") {
      setMessages([{ role: "ai", text: "Ready to evaluate! Write your answer below and I'll check it against the study material for accuracy, completeness and clarity. 📝" }])

    } else if (selectedMode === "qa") {
      setMessages([{ role: "ai", text: "I've read through the material carefully. Ask me anything — concepts, examples, explanations, or anything you're confused about! 💬" }])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userText }])
    setLoading(true)
    setError("")

    try {
      const sys     = buildSystem()
      const history = messages.map(m => `${m.role === "user" ? "Student" : "Assistant"}: ${m.text}`).join("\n")
      let userMsg   = ""

      if (mode === "qa") {
        userMsg = `Conversation so far:\n${history}\n\nStudent: ${userText}\n\nAnswer helpfully based only on the material.`

      } else if (mode === "summary") {
        if (/^\s*yes\s*$/i.test(userText)) {
          const reply = await callAI(
            sys,
            `Generate exactly 5 multiple choice questions from this material. Use EXACTLY this format:

1. [Question]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Answer: [Letter only]`
        )
          const parsed = parseMCQs(reply)
          if (parsed.length > 0) {
            setMcqQuestions(parsed)
            setMessages(prev => [...prev, { role: "ai", text: "Here are your MCQs — work through them below 👇" }])
            setLoading(false)
            return
          }
        }
        userMsg = `Conversation:\n${history}\n\nStudent: ${userText}\n\nRespond helpfully.`

      } else if (mode === "subjective") {
        userMsg = `You are conducting a subjective quiz. Conversation so far:\n${history}\n\nStudent answered: ${userText}\n\nGive 1-2 sentences of encouraging feedback, then ask the next question. If 4-5 questions are done, give a final overall assessment.`

      } else if (mode === "evaluate") {
        userMsg = `The student wrote this answer:\n\n"${userText}"\n\nEvaluate it against the study material. Structure your response exactly like this:

✅ What's correct:
⚠️ What's missing or could be improved:
💡 Key points to add:
⭐ Score: X / 10

Be honest but encouraging.`
      }

      const reply = await callAI(sys, userMsg)
      setMessages(prev => [...prev, { role: "ai", text: reply }])

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const currentMode = MODES.find(m => m.id === mode)

  return (
    <div className={styles.page}>

      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>AI Study Assistant ✦</h1>
        <p className={styles.heroSub}>
          Upload any chapter or notes — let AI quiz you, summarise it, or evaluate your answers.
        </p>
      </section>

      {/* Study Material */}
      {step === "material" && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📂 Add Your Study Material</h2>
          <p className={styles.cardDesc}>
            Upload a text-based PDF, or paste your notes directly. Voice input is available in the chat.
          </p>
          <div className={styles.uploadRow}>
            <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={uploadLoading}>
              {uploadLoading ? "Reading PDF…" : "📁 Upload PDF"}
            </button>
            <button
              className={`${styles.uploadVoiceBtn} ${isMaterialListening ? styles.uploadVoiceBtnActive : ""} ${!voiceSupported ? styles.voiceBtnDisabled : ""}`}
              onClick={toggleMaterialVoice}
              title={!voiceSupported ? "Voice requires Chrome/Edge" : isMaterialListening ? "Stop recording" : "Dictate your notes"}
            >
              {isMaterialListening ? "⏹ Stop" : "🎙️ Dictate"}
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf" className={styles.hidden} onChange={handleFile} />
            {materialLabel && <span className={styles.fileLabel}>{materialLabel}</span>}
          </div>
          {isMaterialListening && (
            <div className={styles.listeningBanner}>
              <span className={styles.listeningDot} /> Listening… speak your notes clearly
            </div>
          )}
          <textarea
            className={styles.textArea}
            placeholder="Paste notes here, or use 🎙️ Dictate above to speak them…"
            rows={9}
            value={material}
            onChange={e => { setMaterial(e.target.value); setMaterialLabel(e.target.value.trim() ? "✏️ Pasted text" : "") }}
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.rowRight}>
            <button className={styles.primaryBtn} onClick={handleMaterialReady}>Choose Study Mode →</button>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      {step === "mode" && (
        <div className={styles.card}>
          <div className={styles.materialBadge}>{materialLabel}</div>
          <h2 className={styles.cardTitle}>🎯 Choose a Study Mode</h2>
          <p className={styles.cardDesc}>How do you want to work through this material?</p>
          <div className={styles.modeGrid}>
            {MODES.map(m => (
              <button key={m.id} className={styles.modeCard} onClick={() => handleStartMode(m.id)}>
                <span className={styles.modeEmoji}>{m.emoji}</span>
                <span className={styles.modeLabel}>{m.label}</span>
                <span className={styles.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>
          <button className={styles.ghostBtn} onClick={() => setStep("material")}>← Change Material</button>
        </div>
      )}

      {/* Full-screen Chat */}
      {step === "chat" && (
        <div className={styles.fullscreenChat}>

          {/* ── Top bar ── */}
          <div className={styles.chatTopbar}>
            <div className={styles.chatTopLeft}>
              <span className={styles.chatModeTag}>{currentMode?.emoji} {currentMode?.label}</span>
              <span className={styles.chatMaterialTag}>{materialLabel}</span>
            </div>
            <div className={styles.chatTopRight}>
              <button className={styles.ghostBtn} onClick={() => { setStep("material"); setMessages([]); setMcqQuestions(null); setMaterial(""); setMaterialLabel("") }}>
                New Material
              </button>
            </div>
          </div>

          {/* ── Body: chat 80% | sidebar 20% ── */}
          <div className={styles.chatBody}>

            {/* LEFT — messages + input */}
            <div className={styles.chatMain}>
              <div className={styles.chatArea}>
                {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
                {mcqQuestions && (
                  <MCQWidget
                    questions={mcqQuestions}
                    onDone={() => {
                      setMcqQuestions(null)
                      setMessages(prev => [...prev, { role: "ai", text: "Well done! Feel free to ask more questions or switch to another mode." }])
                    }}
                  />
                )}
                {loading && (
                  <div className={styles.typingIndicator}><span /><span /><span /></div>
                )}
                <div ref={chatEndRef} />
              </div>

              {!mcqQuestions && (
                <div className={styles.inputBar}>
                  <button
                    className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ""} ${!voiceSupported ? styles.voiceBtnDisabled : ""}`}
                    onClick={toggleVoice}
                    title={!voiceSupported ? "Voice input requires Chrome or Edge" : isListening ? "Stop recording" : "Start voice input"}
                  >
                    {isListening ? "⏹" : "🎙️"}
                  </button>
                  <textarea
                    className={styles.chatInput}
                    placeholder={
                      mode === "evaluate"   ? "Write your answer here for AI evaluation…" :
                      mode === "subjective" ? "Type your answer to the question above…"    :
                                             "Ask anything about the material…"
                    }
                    rows={2}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || loading}>➤</button>
                </div>
              )}

              {error && <p className={styles.errorChat}>{error}</p>}
            </div>

            {/* RIGHT — mode sidebar 20% */}
            <div className={styles.modeSidebar}>
              <p className={styles.sidebarTitle}>Study Modes</p>
              <div className={styles.sidebarModes}>
                {MODES.map(m => (
                  <button
                    key={m.id}
                    className={`${styles.sidebarModeBtn} ${mode === m.id ? styles.sidebarModeBtnActive : ""}`}
                    onClick={() => handleStartMode(m.id)}
                    title={m.desc}
                  >
                    <span className={styles.sidebarModeEmoji}>{m.emoji}</span>
                    <span className={styles.sidebarModeLabel}>{m.label}</span>
                    <span className={styles.sidebarModeDesc}>{m.desc}</span>
                  </button>
                ))}
              </div>
              <div className={styles.sidebarDivider} />
              <p className={styles.sidebarTitle}>Material</p>
              <p className={styles.sidebarMaterialName}>{materialLabel}</p>
              <button className={styles.sidebarChangeBtn} onClick={() => { setStep("material"); setMessages([]); setMcqQuestions(null); setMaterial(""); setMaterialLabel("") }}>
                Change material
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}