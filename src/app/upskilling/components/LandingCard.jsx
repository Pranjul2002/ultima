"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowRight, FileUp, Sparkles } from "lucide-react";
import styles from "./LandingCard.module.css";

function MagneticButton({ children, className, onClick, type = "button", icon }) {
  const [style, setStyle] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.1;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.1;
    setStyle({ x, y });
  };

  const handleMouseLeave = () => {
    setStyle({ x: 0, y: 0 });
  };

  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: style.x, y: style.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
    >
      <span className={styles.buttonInner}>
        {children}
        {icon}
      </span>
    </motion.button>
  );
}

function GlowPanel({ children, className }) {
  const [glow, setGlow] = useState({ x: "50%", y: "50%", visible: false });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
      visible: true,
    });
  };

  const handleLeave = () => {
    setGlow((prev) => ({ ...prev, visible: false }));
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        "--glow-x": glow.x,
        "--glow-y": glow.y,
        "--glow-opacity": glow.visible ? 1 : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingCard({ onUploadClick }) {
  return (
    <GlowPanel className={styles.card}>
      <motion.div
        className={styles.badge}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
      >
        <Sparkles size={14} />
        <span>AI Research Workspace</span>
      </motion.div>

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        <h1 className={styles.title}>
          Upload your <span className={styles.gradientText}>documents</span>
        </h1>
        <p className={styles.subtitle}>
          Start with a file and move directly into your workspace for source-based
          research, notes, and structured exploration.
        </p>
      </motion.div>

      <motion.div
        className={styles.uploadShell}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.42 }}
      >
        <GlowPanel className={styles.dropzone}>
          <div className={styles.dropzoneIcon}>
            <FileUp size={26} />
          </div>

          <h2 className={styles.dropTitle}>Drop your file here</h2>
          <p className={styles.dropSubtitle}>
            Supports PDF, DOC, DOCX, TXT, images, audio, and more
          </p>

          <MagneticButton
            className={styles.uploadButton}
            onClick={onUploadClick}
            icon={<Upload size={16} />}
          >
            Upload file
          </MagneticButton>

          <div className={styles.helperRow}>
            <span className={styles.helperText}>One file is enough to get started</span>
            <span className={styles.helperDot} />
            <span className={styles.helperText}>You can add more later</span>
          </div>
        </GlowPanel>
      </motion.div>

      <motion.div
        className={styles.footerNote}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.45 }}
      >
        <span>Upload a source and continue to workspace</span>
        <ArrowRight size={16} />
      </motion.div>
    </GlowPanel>
  );
}