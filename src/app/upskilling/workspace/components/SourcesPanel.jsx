import {
  Plus,
  Search,
  Globe,
  ChevronDown,
  ArrowRight,
  FileText,
  PanelLeftClose,
} from "lucide-react";
import styles from "./SourcesPanel.module.css";
import { useFiles } from "../../context/FileContext"; // ✅ added

export default function SourcesPanel({ onUploadClick, onClose }) {
  const { files } = useFiles(); // ✅ get files

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Sources</h2>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Hide sources panel"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <button className={styles.addButton} onClick={onUploadClick}>
        <Plus size={16} />
        <span>Add sources</span>
      </button>

      {/* ✅ FILE LIST */}
      {files.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileText size={22} />
          </div>
          <h3 className={styles.emptyTitle}>No sources yet</h3>
          <p className={styles.emptyText}>
            Upload a file to see it here.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: "10px" }}>
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              📄 {file.name}
            </div>
          ))}
        </div>
      )}

      {/* existing search UI */}
      <div className={styles.searchCard}>
        <div className={styles.inputRow}>
          <Search size={18} className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Search the web for new sources"
            className={styles.input}
          />
        </div>

        <div className={styles.searchFooter}>
          <div className={styles.chips}>
            <button className={styles.chip}>
              <Globe size={15} />
              <span>Web</span>
              <ChevronDown size={14} />
            </button>

            <button className={styles.chip}>
              <Search size={15} />
              <span>Fast Research</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <button className={styles.arrowButton} aria-label="Search">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}