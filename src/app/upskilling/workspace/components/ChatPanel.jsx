"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Upload, ArrowRight, FileText, Sparkles } from "lucide-react";
import styles from "./ChatPanel.module.css";
import { useFiles } from "../../context/FileContext";

export default function ChatPanel({ onUploadClick }) {
  const { sources, activeSource, askQuestion } = useFiles();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sourceCount = sources.length;
  const messages = activeSource?.messages || [];
  const isReady = activeSource?.status === "ready";
  const hasMessages = messages.length > 0;

  useEffect(() => {
  const container = messagesEndRef.current?.parentElement;
  if (!container) return;

  container.scrollTop = container.scrollHeight;
}, [messages, isSubmitting]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [question]);

  const helperText = useMemo(() => {
    if (!activeSource) return "Upload a source to get started";
    if (activeSource.status === "uploading") return "Uploading source...";
    if (activeSource.status === "processing") return "Analyzing your document...";
    if (activeSource.status === "failed") return activeSource.error || "Source processing failed";
    return `Ask anything about ${activeSource.name}`;
  }, [activeSource]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || !activeSource || !isReady || isSubmitting) return;
    setIsSubmitting(true);
    setQuestion("");
    try {
      await askQuestion(activeSource.localId, trimmedQuestion);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Sparkles size={15} className={styles.sparkIcon} />
          <h2 className={styles.title}>AI Chat</h2>
        </div>
        {activeSource ? (
          <div className={styles.scopeBadge}>
            <FileText size={12} />
            <span>{activeSource.name}</span>
          </div>
        ) : null}
      </div>

      <div className={styles.body}>
        {!activeSource ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><Upload size={20} /></div>
            <h3 className={styles.emptyTitle}>No source selected</h3>
            <p className={styles.emptyDesc}>Upload a PDF or text file to start chatting with your document.</p>
            <button className={styles.uploadButton} onClick={onUploadClick}>Upload a source</button>
          </div>
        ) : !hasMessages ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><FileText size={20} /></div>
            <h3 className={styles.emptyTitle}>{isReady ? "Ready to answer" : "Preparing…"}</h3>
            <p className={styles.emptyDesc}>{activeSource.summary || helperText}</p>
          </div>
        ) : (
          <div className={styles.messages}>
            <div className={styles.messagesInner}>
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.message} ${
                    message.role === "user" ? styles.userMessage : styles.assistantMessage
                  } ${message.isError ? styles.errorMessage : ""}`}
                >
                  <div className={styles.messageRole}>
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <p className={styles.messageText}>{message.content}</p>
                  {Array.isArray(message.citations) && message.citations.length > 0 ? (
                    <div className={styles.citations}>
                      {message.citations.map((citation, index) => (
                        <div key={`${message.id}_${index}`} className={styles.citationItem}>
                          <div className={styles.citationLabel}>
                            {citation.page ? `Page ${citation.page}` : "Source excerpt"}
                          </div>
                          <p className={styles.citationText}>{citation.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}

              {isSubmitting && (
                <article className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={styles.messageRole}>AI</div>
                  <div className={styles.typingDots}>
                    <span /><span /><span />
                  </div>
                </article>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className={styles.inputBar} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={helperText}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isReady || isSubmitting}
          rows={1}
        />
        <div className={styles.inputFooter}>
          <span className={styles.sourcesCount}>{sourceCount} source{sourceCount !== 1 ? "s" : ""}</span>
          <button
            className={styles.sendButton}
            aria-label="Send"
            type="submit"
            disabled={!isReady || isSubmitting || !question.trim()}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      <p className={styles.footerText}>
        Answers are grounded in your uploaded document. Always verify important information.
      </p>
    </section>
  );
}