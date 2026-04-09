"use client";

import styles from "./Overview.module.css";

const StatCard = ({ label, value, sub, accent }) => (
  <div className={styles.statCard}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue} style={accent ? { color: accent } : undefined}>
      {value}
    </span>
    {sub ? <span className={styles.statSub}>{sub}</span> : null}
  </div>
);

const ProgressBar = ({ label, value, max, color }) => {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.round((value / safeMax) * 100);

  return (
    <div className={styles.progressRow}>
      <div className={styles.progressMeta}>
        <span className={styles.progressLabel}>{label}</span>
        <span className={styles.progressPct}>{percent}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%`, background: color || "#9b7efc" }}
        />
      </div>
    </div>
  );
};

const ActivityItem = ({ title, time, type }) => {
  const colors = {
    completed: "#3dba74",
    started: "#e8ff5a",
    badge: "#9b7efc",
    default: "#94a3b8",
  };

  const labels = {
    completed: "Completed",
    started: "In Progress",
    badge: "Badge Earned",
    default: "Update",
  };

  const tone = colors[type] || colors.default;
  const tag = labels[type] || labels.default;

  return (
    <div className={styles.activityItem}>
      <div className={styles.activityDot} style={{ background: tone }} />
      <div className={styles.activityBody}>
        <span className={styles.activityTitle}>{title}</span>
        <span className={styles.activityTime}>{time}</span>
      </div>
      <span className={styles.activityTag} style={{ color: tone, background: `${tone}18` }}>
        {tag}
      </span>
    </div>
  );
};

const OverviewSkeleton = () => (
  <div className={styles.root}>
    <div className={`${styles.welcome} ${styles.skeletonBlock}`} />
    <div className={styles.statsGrid}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={`${styles.statCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
      ))}
    </div>
    <div className={styles.lowerGrid}>
      <div className={`${styles.card} ${styles.skeletonBlock} ${styles.skeletonTall}`} />
      <div className={`${styles.card} ${styles.skeletonBlock} ${styles.skeletonTall}`} />
    </div>
  </div>
);

export default function Overview({
  user,
  stats = [],
  progress = [],
  activity = [],
  isLoading = false,
}) {
  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.welcome}>
        <div>
          <h2 className={styles.welcomeTitle}>
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h2>
          <p className={styles.welcomeSub}>
            Keep pushing forward with your learning goals.
          </p>
        </div>

        <button type="button" className={styles.resumeBtn}>
          Resume Learning
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            sub={item.sub}
            accent={item.accent}
          />
        ))}
      </div>

      <div className={styles.lowerGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Course Progress</span>
          </div>

          <div className={styles.progressList}>
            {progress.map((item) => (
              <ProgressBar
                key={item.label}
                label={item.label}
                value={item.value}
                max={item.max}
                color={item.color}
              />
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Activity</span>
          </div>

          <div className={styles.activityList}>
            {activity.map((item, index) => (
              <ActivityItem
                key={`${item.title}-${index}`}
                title={item.title}
                time={item.time}
                type={item.type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}