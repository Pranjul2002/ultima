import { Plus, Share2, Settings, Grip, Zap } from "lucide-react";
import styles from "./WorkspaceHeader.module.css";

export default function WorkspaceHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Zap size={15} />
        </div>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Untitled notebook</h1>
          <span className={styles.editableHint}>click to rename</span>
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.primaryButton}>
          <Plus size={14} />
          <span>New notebook</span>
        </button>

        <button className={styles.ghostButton}>
          <Share2 size={14} />
          <span>Share</span>
        </button>

        <button className={styles.ghostButton}>
          <Settings size={14} />
          <span>Settings</span>
        </button>

        <div className={styles.divider} />

        <button className={styles.iconButton} aria-label="Apps">
          <Grip size={16} />
        </button>

        <button className={styles.avatar} aria-label="Profile" />
      </div>
    </header>
  );
}