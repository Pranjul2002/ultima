import {
  Headphones,
  Presentation,
  Video,
  GitBranch,
  FileText,
  SquareStack,
  BadgeHelp,
  ChartColumn,
  Table2,
  Sparkles,
  StickyNote,
  PanelRightClose,
} from "lucide-react";
import styles from "./StudioPanel.module.css";

const studioItems = [
  { label: "Audio Overview", icon: Headphones },
  { label: "Slide Deck", icon: Presentation },
  { label: "Video Overview", icon: Video },
  { label: "Mind Map", icon: GitBranch },
  { label: "Reports", icon: FileText },
  { label: "Flashcards", icon: SquareStack },
  { label: "Quiz", icon: BadgeHelp },
  { label: "Infographic", icon: ChartColumn },
  { label: "Data Table", icon: Table2 },
];

export default function StudioPanel({ onClose }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Studio</h2>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Hide studio panel"
        >
          <PanelRightClose size={18} />
        </button>
      </div>

      <div className={styles.banner}>
        Create an Audio Overview in: हिन्दी, বাংলা, ગુજરાતી, ಕನ್ನಡ, മലയാളം,
        मराठी, ਪੰਜਾਬੀ, தமிழ், తెలుగు
      </div>

      <div className={styles.grid}>
        {studioItems.map(({ label, icon: Icon }) => (
          <button key={label} className={styles.gridItem}>
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className={styles.emptyState}>
        <div className={styles.sparkle}>
          <Sparkles size={22} />
        </div>
        <h3 className={styles.emptyTitle}>Studio output will be saved here.</h3>
        <p className={styles.emptyText}>
          After adding sources, click to add Audio Overview, Study Guide, Mind
          Map, and more.
        </p>
      </div>

      <button className={styles.noteButton}>
        <StickyNote size={16} />
        <span>Add note</span>
      </button>
    </aside>
  );
}