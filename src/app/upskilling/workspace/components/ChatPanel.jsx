import { Upload, ArrowRight } from "lucide-react";
import styles from "./ChatPanel.module.css";

export default function ChatPanel({ onUploadClick }) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Chat</h2>
      </div>

      <div className={styles.centerContent}>
        <div className={styles.uploadBadge}>
          <Upload size={18} />
        </div>
        <h3 className={styles.mainTitle}>Add a source to get started</h3>
        <button className={styles.uploadButton} onClick={onUploadClick}>
          Upload a source
        </button>
      </div>

      <div className={styles.inputBar}>
        <span className={styles.placeholder}>Upload a source to get started</span>
        <div className={styles.inputMeta}>
          <span className={styles.sourcesCount}>0 sources</span>
          <button className={styles.sendButton} aria-label="Send">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <p className={styles.footerText}>
        NotebookLM can be inaccurate; please double check its responses.
      </p>
    </section>
  );
}