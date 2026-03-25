"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FiUser, FiFileText, FiBarChart2, FiSettings,
  FiLogOut, FiHome, FiAward, FiCalendar,
  FiMail, FiTrendingUp, FiClock, FiChevronRight
} from "react-icons/fi"
import styles from "./dashboard.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TABS = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "tests", label: "My Tests", icon: FiFileText },
  { id: "results", label: "Results", icon: FiBarChart2 },
  { id: "settings", label: "Settings", icon: FiSettings },
]

const Dashboard = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Settings state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [pwError, setPwError] = useState("")
  const [pwSuccess, setPwSuccess] = useState("")

  // Animated counters
  const [counters, setCounters] = useState({ tests: 0, score: 0 })
  const animated = useRef(false)

  // Test history
  const [testHistory, setTestHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  /* ── Fetch profile ── */
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    // not logged in → go to login
    if (!token) { router.push("/signIn-Register"); return }

    // admin trying to access student dashboard → redirect
    if (role === "ADMIN") { router.push("/dashboard/admin"); return }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/students/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          localStorage.removeItem("name")
          router.push("/signIn-Register")
          return
        }
        const data = await res.json()
        setProfile(data)
      } catch {
        setError("Failed to load profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  /* ── Fetch test history when tests tab is opened ── */
  useEffect(() => {
    if (activeTab !== "tests" && activeTab !== "results") return
    const token = localStorage.getItem("token")
    if (!token || testHistory.length > 0) return

    const fetchHistory = async () => {
      setHistoryLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/tests/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setTestHistory(data)
      } catch {
        // silently fail — profile data still shows
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [activeTab])

  /* ── Counter animation ── */
  useEffect(() => {
    if (!profile || animated.current) return
    animated.current = true
    const target = {
      tests: profile.totalTestsTaken || 0,
      score: Math.round(profile.averageScore || 0)
    }
    const duration = 1200
    const steps = 40
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounters({
        tests: Math.round(target.tests * progress),
        score: Math.round(target.score * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [profile])

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")    // ✅ fixed
    localStorage.removeItem("name")    // ✅ fixed
    window.dispatchEvent(new Event("authChange"))  // ✅ consistent event
    router.push("/")
  }

  /* ── Password change ── */
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError(""); setPwSuccess("")
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords do not match.")
      return
    }
    if (pwForm.next.length < 8) {
      setPwError("Password must be at least 8 characters.")
      return
    }
    setPwSuccess("Password change coming soon — backend endpoint not yet built.")
    setPwForm({ current: "", next: "", confirm: "" })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    })
  }

  const getGrade = (score) => {
    if (score >= 90) return { label: "Outstanding", color: "#22c55e" }
    if (score >= 75) return { label: "Excellent", color: "#3b82f6" }
    if (score >= 60) return { label: "Good", color: "#f59e0b" }
    if (score >= 40) return { label: "Average", color: "#f97316" }
    return { label: "Needs Work", color: "#ef4444" }
  }

  /* ── Loading ── */
  if (loading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading your dashboard…</p>
    </div>
  )

  /* ── Error ── */
  if (error) return (
    <div className={styles.loadingScreen}>
      <p className={styles.errorText}>{error}</p>
      <button onClick={() => router.push("/signIn-Register")} className={styles.retryBtn}>
        Back to Login
      </button>
    </div>
  )

  const grade = getGrade(profile?.averageScore || 0)

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.sidebarLogo}>EduTech</Link>
          <div className={styles.sidebarUserMini}>
            <div className={styles.avatarCircle}>
              {profile?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className={styles.sidebarUserName}>{profile?.name || "Student"}</p>
              <p className={styles.sidebarUserEmail}>{profile?.email || ""}</p>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.navItem} ${activeTab === id ? styles.navActive : ""}`}
              onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
            >
              <Icon className={styles.navIcon} />
              <span>{label}</span>
              {activeTab === id && <FiChevronRight className={styles.navArrow} />}
            </button>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

      {/* ── Overlay for mobile ── */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* Mobile topbar */}
        <div className={styles.mobileTopbar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
          <span className={styles.mobileTitle}>
            {TABS.find(t => t.id === activeTab)?.label}
          </span>
          <button className={styles.mobileLogout} onClick={handleLogout} aria-label="Logout">
            <FiLogOut />
          </button>
        </div>

        {/* Mobile bottom nav */}
        <nav className={styles.mobileNav}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.mobileNavItem} ${activeTab === id ? styles.mobileNavActive : ""}`}
              onClick={() => setActiveTab(id)}
              aria-label={label}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className={styles.tabContent}>
            <div className={styles.welcomeBanner}>
              <div>
                <p className={styles.welcomeSmall}>Good to see you back 👋</p>
                <h1 className={styles.welcomeName}>{profile?.name || "Student"}</h1>
                <p className={styles.welcomeSub}>Keep pushing — every test brings you closer.</p>
              </div>
              <div className={styles.welcomeBadge}>
                <FiAward />
                <span>{grade.label}</span>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
                  <FiFileText />
                </div>
                <div>
                  <h2 className={styles.statNumber}>{counters.tests}</h2>
                  <p className={styles.statLabel}>Tests Taken</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  <FiTrendingUp />
                </div>
                <div>
                  <h2 className={styles.statNumber}>{counters.score}%</h2>
                  <p className={styles.statLabel}>Average Score</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c" }}>
                  <FiAward />
                </div>
                <div>
                  <h2 className={styles.statNumber} style={{ color: grade.color }}>
                    {grade.label}
                  </h2>
                  <p className={styles.statLabel}>Current Grade</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(14,165,233,0.12)", color: "#0ea5e9" }}>
                  <FiClock />
                </div>
                <div>
                  <h2 className={styles.statNumber}>
                    {profile?.age || "—"}
                    {profile?.age && <span className={styles.statUnit}> yrs</span>}
                  </h2>
                  <p className={styles.statLabel}>Age</p>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h3 className={styles.sectionTitle}>Quick Actions</h3>
              <div className={styles.actionGrid}>
                <button
                  className={styles.actionCard}
                  onClick={() => router.push("/test")}  // ✅ fixed
                >
                  <FiFileText className={styles.actionIcon} />
                  <span>Start a Test</span>
                  <FiChevronRight className={styles.actionArrow} />
                </button>
                <button
                  className={styles.actionCard}
                  onClick={() => setActiveTab("profile")}
                >
                  <FiUser className={styles.actionIcon} />
                  <span>View Profile</span>
                  <FiChevronRight className={styles.actionArrow} />
                </button>
                <button
                  className={styles.actionCard}
                  onClick={() => setActiveTab("results")}
                >
                  <FiBarChart2 className={styles.actionIcon} />
                  <span>See Results</span>
                  <FiChevronRight className={styles.actionArrow} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>My Profile</h2>

            <div className={styles.profileCard}>
              <div className={styles.profileAvatarLarge}>
                {profile?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className={styles.profileMeta}>
                <h2 className={styles.profileName}>{profile?.name}</h2>
                <p className={styles.profileEmail}>{profile?.email}</p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <FiUser className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Full Name</p>
                  <p className={styles.infoValue}>{profile?.name || "—"}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiMail className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Email Address</p>
                  <p className={styles.infoValue}>{profile?.email || "—"}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiUser className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Gender</p>
                  <p className={styles.infoValue}>
                    {profile?.gender
                      ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiCalendar className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Date of Birth</p>
                  <p className={styles.infoValue}>{formatDate(profile?.dateOfBirth)}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiClock className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Age</p>
                  <p className={styles.infoValue}>{profile?.age ? `${profile.age} years` : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY TESTS TAB ── */}
        {activeTab === "tests" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>My Tests</h2>

            {historyLoading ? (
              <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner}></div>
              </div>
            ) : testHistory.length === 0 ? (
              <div className={styles.emptyState}>
                <FiFileText className={styles.emptyIcon} />
                <h3>No tests taken yet</h3>
                <p>Start your first test to see your history here.</p>
                <button className={styles.ctaBtn} onClick={() => router.push("/test")}>
                  Take a Test
                </button>
              </div>
            ) : (
              <div className={styles.testList}>
                {testHistory.map((session) => (
                  <div key={session.sessionId} className={styles.testHistoryCard}>
                    <div className={styles.testHistoryLeft}>
                      <p className={styles.testHistoryTitle}>{session.testTitle}</p>
                      <p className={styles.testHistorySubject}>{session.subjectName}</p>
                      <p className={styles.testHistoryDate}>{formatDate(session.takenAt)}</p>
                    </div>
                    <div className={styles.testHistoryRight}>
                      <p className={styles.testHistoryScore}
                        style={{ color: getGrade(session.percentage).color }}>
                        {session.score}/{session.totalQuestions}
                      </p>
                      <p className={styles.testHistoryPercent}
                        style={{ color: getGrade(session.percentage).color }}>
                        {session.percentage.toFixed(1)}%
                      </p>
                      <p className={styles.testHistoryGrade}>
                        {getGrade(session.percentage).label}
                      </p>
                    </div>
                  </div>
                ))}
                <button className={styles.ctaBtn} onClick={() => router.push("/test")}>
                  Take Another Test
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS TAB ── */}
        {activeTab === "results" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>Results</h2>

            <div className={styles.resultsOverview}>
              <div className={styles.scoreRing}>
                <svg viewBox="0 0 120 120" className={styles.ringsvg}>
                  <circle cx="60" cy="60" r="50" className={styles.ringBg} />
                  <circle
                    cx="60" cy="60" r="50"
                    className={styles.ringFill}
                    style={{
                      strokeDasharray: `${(profile?.averageScore || 0) * 3.14} 314`
                    }}
                  />
                </svg>
                <div className={styles.ringLabel}>
                  <span className={styles.ringNumber}>
                    {(profile?.averageScore || 0).toFixed(0)}%
                  </span>
                  <span className={styles.ringText}>avg score</span>
                </div>
              </div>

              <div className={styles.resultsMeta}>
                <div className={styles.resultMetaItem}>
                  <p className={styles.resultMetaLabel}>Tests Completed</p>
                  <p className={styles.resultMetaValue}>{profile?.totalTestsTaken || 0}</p>
                </div>
                <div className={styles.resultMetaItem}>
                  <p className={styles.resultMetaLabel}>Performance Grade</p>
                  <p className={styles.resultMetaValue} style={{ color: grade.color }}>
                    {grade.label}
                  </p>
                </div>
                <div className={styles.resultMetaItem}>
                  <p className={styles.resultMetaLabel}>Status</p>
                  <p className={styles.resultMetaValue}>
                    {profile?.totalTestsTaken > 0 ? "Active Learner" : "Just Started"}
                  </p>
                </div>
              </div>
            </div>

            {testHistory.length === 0 && (
              <div className={styles.emptyState}>
                <FiBarChart2 className={styles.emptyIcon} />
                <h3>No results yet</h3>
                <p>Complete a test to see your results and analytics here.</p>
                <button className={styles.ctaBtn} onClick={() => router.push("/test")}>
                  Take Your First Test
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>Settings</h2>

            <div className={styles.settingsCard}>
              <h3 className={styles.settingsSection}>Change Password</h3>

              {pwError && <div className={styles.formError}>{pwError}</div>}
              {pwSuccess && <div className={styles.formSuccess}>{pwSuccess}</div>}

              <form onSubmit={handlePasswordChange} className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={styles.ctaBtn}>
                  Update Password
                </button>
              </form>
            </div>

            <div className={styles.settingsCard} style={{ marginTop: "24px" }}>
              <h3 className={styles.settingsSection}>Account</h3>
              <button className={styles.logoutBtnFull} onClick={handleLogout}>
                <FiLogOut /> Sign Out
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard