"use client";

import { useEffect, useState } from "react";
import styles from "./Settings.module.css";

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <span className={styles.toggleThumb} />
  </button>
);

const SettingRow = ({ label, description, children }) => (
  <div className={styles.settingRow}>
    <div className={styles.settingInfo}>
      <span className={styles.settingLabel}>{label}</span>
      {description ? <span className={styles.settingDesc}>{description}</span> : null}
    </div>
    <div className={styles.settingControl}>{children}</div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className={styles.sectionCard}>
    <div className={styles.sectionTitle}>{title}</div>
    {children}
  </div>
);

const defaultSettings = {
  notifications: {
    emailReminders: false,
    testAlerts: false,
    progressReports: false,
    newCourses: false,
    badges: false,
  },
  privacy: {
    publicProfile: false,
    showProgress: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: false,
  },
  preferences: {
    language: "en",
    timezone: "Asia/Kolkata",
    dailyGoal: 30,
    recoveryEmail: "",
  },
};

const SettingsSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.grid}>
      <div className={styles.col}>
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
      </div>
      <div className={styles.col}>
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
        <div className={`${styles.sectionCard} ${styles.skeletonBlock} ${styles.skeletonCard}`} />
      </div>
    </div>
  </div>
);

export default function Settings({ data = defaultSettings, isLoading = false, onSave }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [dangerConfirm, setDangerConfirm] = useState("");

  useEffect(() => {
    setSettings({
      notifications: { ...defaultSettings.notifications, ...data.notifications },
      privacy: { ...defaultSettings.privacy, ...data.privacy },
      security: { ...defaultSettings.security, ...data.security },
      preferences: { ...defaultSettings.preferences, ...data.preferences },
    });
  }, [data]);

  const updateNested = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <SectionCard title="Notifications">
            <SettingRow label="Email reminders" description="Daily learning reminders via email">
              <Toggle
                checked={settings.notifications.emailReminders}
                onChange={(value) => updateNested("notifications", "emailReminders", value)}
              />
            </SettingRow>

            <SettingRow label="Test alerts" description="Notify before test deadlines">
              <Toggle
                checked={settings.notifications.testAlerts}
                onChange={(value) => updateNested("notifications", "testAlerts", value)}
              />
            </SettingRow>

            <SettingRow label="Weekly progress reports" description="Summary of your learning each week">
              <Toggle
                checked={settings.notifications.progressReports}
                onChange={(value) => updateNested("notifications", "progressReports", value)}
              />
            </SettingRow>

            <SettingRow label="New course announcements">
              <Toggle
                checked={settings.notifications.newCourses}
                onChange={(value) => updateNested("notifications", "newCourses", value)}
              />
            </SettingRow>

            <SettingRow label="Badge & achievement alerts">
              <Toggle
                checked={settings.notifications.badges}
                onChange={(value) => updateNested("notifications", "badges", value)}
              />
            </SettingRow>
          </SectionCard>

          <SectionCard title="Privacy">
            <SettingRow label="Public profile" description="Allow others to see your profile">
              <Toggle
                checked={settings.privacy.publicProfile}
                onChange={(value) => updateNested("privacy", "publicProfile", value)}
              />
            </SettingRow>

            <SettingRow label="Show learning progress" description="Display progress on public profile">
              <Toggle
                checked={settings.privacy.showProgress}
                onChange={(value) => updateNested("privacy", "showProgress", value)}
              />
            </SettingRow>
          </SectionCard>

          <SectionCard title="Security">
            <SettingRow label="Two-factor authentication" description="Add an extra layer of security">
              <Toggle
                checked={settings.security.twoFactor}
                onChange={(value) => updateNested("security", "twoFactor", value)}
              />
            </SettingRow>

            <SettingRow label="Login alerts" description="Get notified on new sign-ins">
              <Toggle
                checked={settings.security.loginAlerts}
                onChange={(value) => updateNested("security", "loginAlerts", value)}
              />
            </SettingRow>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Password</span>
                <span className={styles.settingDesc}>Change password flow will be connected later.</span>
              </div>
              <button type="button" className={styles.actionBtn}>
                Change
              </button>
            </div>
          </SectionCard>
        </div>

        <div className={styles.col}>
          <SectionCard title="Learning Preferences">
            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Language</label>
              <select
                className={styles.prefSelect}
                value={settings.preferences.language}
                onChange={(e) => updateNested("preferences", "language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Timezone</label>
              <select
                className={styles.prefSelect}
                value={settings.preferences.timezone}
                onChange={(e) => updateNested("preferences", "timezone", e.target.value)}
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>

            <div className={styles.prefGroup}>
              <div className={styles.prefLabelRow}>
                <label className={styles.prefLabel}>Daily learning goal</label>
                <span className={styles.prefValue}>{settings.preferences.dailyGoal} min</span>
              </div>

              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={settings.preferences.dailyGoal}
                className={styles.goalSlider}
                onChange={(e) => updateNested("preferences", "dailyGoal", Number(e.target.value))}
              />

              <div className={styles.sliderLabels}>
                <span>10 min</span>
                <span>120 min</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Account">
            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Recovery Email</label>
              <div className={styles.inlineField}>
                <input
                  type="email"
                  className={styles.prefInput}
                  value={settings.preferences.recoveryEmail}
                  onChange={(e) => updateNested("preferences", "recoveryEmail", e.target.value)}
                  placeholder="Add recovery email"
                />
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={() => onSave?.(settings)}
                >
                  Save
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Danger Zone">
            <p className={styles.dangerDesc}>
              Account deletion should only be connected after backend confirmation.
            </p>

            <div className={styles.prefGroup}>
              <label className={styles.prefLabel}>Type DELETE to confirm</label>
              <div className={styles.inlineField}>
                <input
                  type="text"
                  className={styles.prefInput}
                  value={dangerConfirm}
                  onChange={(e) => setDangerConfirm(e.target.value)}
                  placeholder="DELETE"
                />
                <button
                  type="button"
                  className={styles.actionBtn}
                  disabled={dangerConfirm !== "DELETE"}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}