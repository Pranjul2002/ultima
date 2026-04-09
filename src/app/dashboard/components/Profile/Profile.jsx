"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.css";

const SkillTag = ({ label, level }) => {
  const colors = {
    beginner: "#e8884a",
    intermediate: "#9b7efc",
    advanced: "#3dba74",
  };

  const tone = colors[level] || "#94a3b8";

  return (
    <span
      className={styles.skillTag}
      style={{
        background: `${tone}15`,
        color: tone,
        borderColor: `${tone}30`,
      }}
    >
      {label}
    </span>
  );
};

const ProfileSkeleton = () => (
  <div className={styles.root}>
    <div className={styles.topRow}>
      <div className={`${styles.avatarCard} ${styles.skeletonBlock}`} />
      <div className={`${styles.formCard} ${styles.skeletonBlock} ${styles.skeletonForm}`} />
    </div>
    <div className={styles.bottomRow}>
      <div className={`${styles.formCard} ${styles.skeletonBlock} ${styles.skeletonMedium}`} />
      <div className={`${styles.formCard} ${styles.skeletonBlock} ${styles.skeletonMedium}`} />
    </div>
  </div>
);

export default function Profile({ user, isLoading = false, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    role: "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      role: user?.role || "",
    });
  }, [user]);

  const initials = useMemo(() => {
    if (!form.name) return "U";
    return form.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onSave?.(form);
    setEditing(false);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.topRow}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarCircle}>{initials}</div>
          <div className={styles.avatarName}>{form.name || "User"}</div>
          <div className={styles.avatarRole}>{form.role || "Role"}</div>

          <div className={styles.avatarStats}>
            <div className={styles.astatItem}>
              <span className={styles.astatVal}>{user?.metrics?.courses ?? 0}</span>
              <span className={styles.astatLbl}>Courses</span>
            </div>
            <div className={styles.astatDivider} />
            <div className={styles.astatItem}>
              <span className={styles.astatVal}>{user?.metrics?.tests ?? 0}</span>
              <span className={styles.astatLbl}>Tests</span>
            </div>
            <div className={styles.astatDivider} />
            <div className={styles.astatItem}>
              <span className={styles.astatVal}>{user?.metrics?.badges ?? 0}</span>
              <span className={styles.astatLbl}>Badges</span>
            </div>
          </div>

          <button type="button" className={styles.uploadBtn}>
            Change Photo
          </button>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.cardTitle}>Personal Information</span>
            <button
              type="button"
              className={styles.editToggle}
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                name="name"
                className={styles.fieldInput}
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                name="email"
                className={styles.fieldInput}
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="profile-location">
                Location
              </label>
              <input
                id="profile-location"
                name="location"
                className={styles.fieldInput}
                value={form.location}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="profile-website">
                Website
              </label>
              <input
                id="profile-website"
                name="website"
                className={styles.fieldInput}
                value={form.website}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="profile-bio">
              Bio
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              className={styles.fieldTextarea}
              value={form.bio}
              onChange={handleChange}
              disabled={!editing}
              rows={5}
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.cardTitle}>Skills</span>
          </div>

          <div className={styles.skillsWrap}>
            {user?.skills?.map((skill) => (
              <SkillTag
                key={`${skill.label}-${skill.level}`}
                label={skill.label}
                level={skill.level}
              />
            ))}
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.cardTitle}>Certificates</span>
          </div>

          {user?.certificates?.length ? (
            <div className={styles.certList}>
              {user.certificates.map((cert, index) => (
                <div className={styles.certCard} key={`${cert.title}-${index}`}>
                  <div className={styles.certIcon}>{cert.icon || "🏅"}</div>
                  <div className={styles.certBody}>
                    <span className={styles.certTitle}>{cert.title}</span>
                    <span className={styles.certIssuer}>
                      {cert.issuer} {cert.date ? `· ${cert.date}` : ""}
                    </span>
                  </div>
                  <button type="button" className={styles.certBtn}>
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.inlineEmpty}>No certificates available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}