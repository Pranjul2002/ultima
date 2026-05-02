"use client";

import { useState } from "react";
import { Sparkles, BrainCircuit } from "lucide-react";
import ChatPanel from "./ChatPanel";
import AssessmentPanel from "./AssessmentPanel";
import styles from "./MainPanel.module.css";

const TABS = [
  { id: "chat",       label: "AI Chat",    Icon: Sparkles      },
  { id: "assessment", label: "Assessment", Icon: BrainCircuit  },
];

export default function MainPanel({ onUploadClick }) {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className={styles.wrapper}>
      {/* ── Tab strip ───────────────────────────────────────── */}
      <div className={styles.tabStrip}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={13} />
            {label}
            {activeTab === id && <span className={styles.tabIndicator} />}
          </button>
        ))}
      </div>

      {/* ── Panel body ───────────────────────────────────────── */}
      <div className={styles.body}>
        {/* Keep ChatPanel mounted always so message history is preserved */}
        <div className={activeTab === "chat" ? styles.visible : styles.hidden}>
          <ChatPanel onUploadClick={onUploadClick} />
        </div>

        {activeTab === "assessment" && (
          <div className={styles.visible}>
            <AssessmentPanel />
          </div>
        )}
      </div>
    </div>
  );
}