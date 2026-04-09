"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftOpen } from "lucide-react";
import WorkspaceHeader from "./components/WorkspaceHeader";
import SourcesPanel from "./components/SourcesPanel";
import ChatPanel from "./components/ChatPanel";
import StudioPanel from "./components/StudioPanel";
import styles from "./workspace.module.css";
import { useFiles } from "../context/FileContext";

export default function UpskillingWorkspacePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [activePanel, setActivePanel] = useState("sources");
  const { files, addFiles } = useFiles();

  useEffect(() => {
    if (files.length === 0) {
      router.replace("/upskilling");
    }
  }, [files, router]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    addFiles(selectedFiles);
    event.target.value = "";
  };

  const layoutClassName = [
    styles.layout,
    !activePanel ? styles.panelClosed : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (files.length === 0) return null;

  return (
    <main className={styles.page}>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <div className={styles.gridOverlay} />

      <WorkspaceHeader />

      <motion.section
        className={layoutClassName}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {activePanel ? (
          <motion.aside
            className={styles.mergedPanel}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className={styles.panelTabs}>
              <button
                type="button"
                className={`${styles.tabButton} ${
                  activePanel === "sources" ? styles.tabActive : ""
                }`}
                onClick={() => setActivePanel("sources")}
              >
                Sources
              </button>

              <button
                type="button"
                className={`${styles.tabButton} ${
                  activePanel === "studio" ? styles.tabActive : ""
                }`}
                onClick={() => setActivePanel("studio")}
              >
                Studio
              </button>
            </div>

            <div className={styles.panelBody}>
              {activePanel === "sources" && (
                <SourcesPanel
                  onUploadClick={openFilePicker}
                  onClose={() => setActivePanel(null)}
                />
              )}

              {activePanel === "studio" && (
                <StudioPanel onClose={() => setActivePanel(null)} />
              )}
            </div>
          </motion.aside>
        ) : (
          <button
            type="button"
            className={styles.sideRail}
            onClick={() => setActivePanel("sources")}
            aria-label="Open side panel"
          >
            <PanelLeftOpen size={18} />
            <span>Open panel</span>
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <ChatPanel onUploadClick={openFilePicker} />
        </motion.div>
      </motion.section>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={handleFileChange}
      />
    </main>
  );
}