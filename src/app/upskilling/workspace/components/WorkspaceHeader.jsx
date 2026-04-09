import {
  Plus,
  Share2,
  Settings,
  Grip,
  Circle,
} from "lucide-react";
import styles from "./WorkspaceHeader.module.css";

export default function WorkspaceHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Circle size={14} fill="currentColor" />
        </div>
        <h1 className={styles.title}>Untitled notebook</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.primaryButton}>
          <Plus size={16} />
          <span>Create notebook</span>
        </button>

        <button className={styles.ghostButton}>
          <Share2 size={16} />
          <span>Share</span>
        </button>

        <button className={styles.ghostButton}>
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <button className={styles.iconButton} aria-label="Apps">
          <Grip size={18} />
        </button>

        <button className={styles.avatar} aria-label="Profile" />
      </div>
    </header>
  );
}