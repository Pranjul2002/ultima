"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FiHome, FiFileText, FiPlusCircle, FiUser,
  FiSettings, FiLogOut, FiChevronRight,
  FiBook, FiList, FiTrash2, FiPlus
} from "react-icons/fi"
import styles from "./admin.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TABS = [
  { id: "overview",   label: "Overview",    icon: FiHome },
  { id: "profile",    label: "Profile",     icon: FiUser },
  { id: "mytests",    label: "My Tests",    icon: FiFileText },
  { id: "createtest", label: "Create Test", icon: FiPlusCircle },
  { id: "settings",   label: "Settings",    icon: FiSettings },
]

const AdminDashboard = () => {
  const router = useRouter()
  const [activeTab, setActiveTab]     = useState("overview")
  const [profile, setProfile]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // My Tests state
  const [myTests, setMyTests]           = useState([])
  const [testsLoading, setTestsLoading] = useState(false)

  // Subjects state
  const [subjects, setSubjects] = useState([])

  // Create Test form
  const [createForm, setCreateForm]       = useState({ title: "", subjectId: "" })
  const [createError, setCreateError]     = useState("")
  const [createSuccess, setCreateSuccess] = useState("")
  const [createLoading, setCreateLoading] = useState(false)

  // Inline subject creation
  const [showNewSubject, setShowNewSubject] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState("")
  const [subjectLoading, setSubjectLoading] = useState(false)
  const [subjectError, setSubjectError]     = useState("")

  // Add Questions state
  const [selectedTest, setSelectedTest]   = useState(null)
  const [bulkQuestions, setBulkQuestions] = useState([
    { questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "" }
  ])
  const [addQError, setAddQError]     = useState("")
  const [addQSuccess, setAddQSuccess] = useState("")
  const [addQLoading, setAddQLoading] = useState(false)

  // Settings
  const [pwForm, setPwForm]       = useState({ current: "", next: "", confirm: "" })
  const [pwError, setPwError]     = useState("")
  const [pwSuccess, setPwSuccess] = useState("")

  /* ── Auth check + fetch profile ── */
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role  = localStorage.getItem("role")

    if (!token) { router.push("/signIn-Register"); return }
    if (role !== "ADMIN") { router.push("/dashboard"); return }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/students/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          handleLogout()
          return
        }
        const data = await res.json()
        setProfile(data)
      } catch {
        setError("Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  /* ── Fetch subjects ── */
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tests/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setSubjects(Array.isArray(data) ? data : [])
      } catch {
        // silently fail
      }
    }
    fetchSubjects()
  }, [])

  /* ── Fetch my tests when tab opens ── */
  useEffect(() => {
    if (activeTab !== "mytests") return
    fetchMyTests()
  }, [activeTab])

  const fetchMyTests = async () => {
    const token = localStorage.getItem("token")
    setTestsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMyTests(Array.isArray(data) ? data : [])
    } catch {
      // silently fail
    } finally {
      setTestsLoading(false)
    }
  }

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    window.dispatchEvent(new Event("authChange"))
    router.push("/")
  }

  /* ── Create Subject inline ── */
  const handleCreateSubject = async () => {
    setSubjectError("")

    if (!newSubjectName.trim()) {
      setSubjectError("Subject name cannot be empty.")
      return
    }

    setSubjectLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/admin/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSubjectName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create subject")

      // add to dropdown instantly
      setSubjects(prev => [...prev, data])

      // auto-select the new subject
      setCreateForm(p => ({ ...p, subjectId: String(data.id) }))

      // reset inline form
      setNewSubjectName("")
      setShowNewSubject(false)
      setSubjectError("")

    } catch (err) {
      setSubjectError(err.message || "Something went wrong.")
    } finally {
      setSubjectLoading(false)
    }
  }

  /* ── Create Test ── */
  const handleCreateTest = async (e) => {
    e.preventDefault()
    setCreateError(""); setCreateSuccess("")

    if (!createForm.title.trim()) {
      setCreateError("Test title is required.")
      return
    }
    if (!createForm.subjectId) {
      setCreateError("Please select a subject.")
      return
    }

    setCreateLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/admin/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: createForm.title,
          subjectId: parseInt(createForm.subjectId),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create test")

      setCreateSuccess(`Test "${data.title}" created! Now add questions to it.`)
      setCreateForm({ title: "", subjectId: "" })
      setShowNewSubject(false)

      // go to my tests to see the new test
      setTimeout(() => {
        setCreateSuccess("")
        setActiveTab("mytests")
      }, 1500)

    } catch (err) {
      setCreateError(err.message || "Something went wrong.")
    } finally {
      setCreateLoading(false)
    }
  }

  /* ── Add/remove question rows ── */
  const addQuestionRow = () => {
    setBulkQuestions(prev => [
      ...prev,
      { questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "" }
    ])
  }

  const removeQuestionRow = (index) => {
    setBulkQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const updateQuestion = (index, field, value) => {
    setBulkQuestions(prev => prev.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    ))
  }

  /* ── Submit bulk questions ── */
  const handleAddQuestions = async (e) => {
    e.preventDefault()
    setAddQError(""); setAddQSuccess("")

    for (let i = 0; i < bulkQuestions.length; i++) {
      const q = bulkQuestions[i]
      if (!q.questionText || !q.optionA || !q.optionB ||
          !q.optionC || !q.optionD || !q.correctOption) {
        setAddQError(`Question ${i + 1} is incomplete. Fill all fields.`)
        return
      }
    }

    setAddQLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${API_URL}/api/admin/tests/${selectedTest.id}/questions/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bulkQuestions),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to add questions")

      setAddQSuccess(`${data.length} question(s) added successfully!`)
      setBulkQuestions([
        { questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "" }
      ])

      // refresh tests list to update question count
      fetchMyTests()

      // update selected test question count
      setSelectedTest(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + data.length
      }))

    } catch (err) {
      setAddQError(err.message || "Something went wrong.")
    } finally {
      setAddQLoading(false)
    }
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
    setPwSuccess("Password change coming soon.")
    setPwForm({ current: "", next: "", confirm: "" })
  }

  /* ── Loading ── */
  if (loading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading admin dashboard…</p>
    </div>
  )

  if (error) return (
    <div className={styles.loadingScreen}>
      <p className={styles.errorText}>{error}</p>
      <button onClick={() => router.push("/signIn-Register")} className={styles.retryBtn}>
        Back to Login
      </button>
    </div>
  )

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.sidebarLogo}>EduTech</Link>
          <div className={styles.sidebarUserMini}>
            <div className={styles.avatarCircle}>
              {profile?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className={styles.sidebarUserName}>{profile?.name || "Admin"}</p>
              <p className={styles.sidebarUserRole}>Administrator</p>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.navItem} ${activeTab === id ? styles.navActive : ""}`}
              onClick={() => {
                setActiveTab(id)
                setSelectedTest(null)
                setSidebarOpen(false)
              }}
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

      {/* ── Overlay ── */}
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
          <button className={styles.mobileLogout} onClick={handleLogout}>
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
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* ════════════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className={styles.tabContent}>
            <div className={styles.welcomeBanner}>
              <div>
                <p className={styles.welcomeSmall}>Admin Panel 👋</p>
                <h1 className={styles.welcomeName}>{profile?.name || "Admin"}</h1>
                <p className={styles.welcomeSub}>Manage your tests and questions from here.</p>
              </div>
              <div className={styles.adminBadge}>
                <FiBook />
                <span>Administrator</span>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}
                  style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
                  <FiFileText />
                </div>
                <div>
                  <h2 className={styles.statNumber}>{myTests.length}</h2>
                  <p className={styles.statLabel}>Tests Created</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  <FiList />
                </div>
                <div>
                  <h2 className={styles.statNumber}>
                    {myTests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0)}
                  </h2>
                  <p className={styles.statLabel}>Total Questions</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}
                  style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c" }}>
                  <FiBook />
                </div>
                <div>
                  <h2 className={styles.statNumber}>{subjects.length}</h2>
                  <p className={styles.statLabel}>Subjects Available</p>
                </div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h3 className={styles.sectionTitle}>Quick Actions</h3>
              <div className={styles.actionGrid}>
                <button
                  className={styles.actionCard}
                  onClick={() => setActiveTab("createtest")}
                >
                  <FiPlusCircle className={styles.actionIcon} />
                  <span>Create New Test</span>
                  <FiChevronRight className={styles.actionArrow} />
                </button>
                <button
                  className={styles.actionCard}
                  onClick={() => setActiveTab("mytests")}
                >
                  <FiFileText className={styles.actionIcon} />
                  <span>View My Tests</span>
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
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            PROFILE TAB
        ════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>My Profile</h2>

            <div className={styles.profileCard}>
              <div className={styles.profileAvatarLarge}>
                {profile?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <h2 className={styles.profileName}>{profile?.name}</h2>
                <p className={styles.profileEmail}>{profile?.email}</p>
                <span className={styles.adminRoleBadge}>Administrator</span>
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
                <FiUser className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>{profile?.email || "—"}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiUser className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Role</p>
                  <p className={styles.infoValue}>Administrator</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FiFileText className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>Tests Created</p>
                  <p className={styles.infoValue}>{myTests.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            MY TESTS TAB
        ════════════════════════════════════════ */}
        {activeTab === "mytests" && !selectedTest && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2 className={styles.pageTitle}>My Tests</h2>
              <button
                className={styles.ctaBtn}
                onClick={() => setActiveTab("createtest")}
              >
                <FiPlus /> New Test
              </button>
            </div>

            {testsLoading ? (
              <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner}></div>
              </div>
            ) : myTests.length === 0 ? (
              <div className={styles.emptyState}>
                <FiFileText className={styles.emptyIcon} />
                <h3>No tests created yet</h3>
                <p>Create your first test paper to get started.</p>
                <button
                  className={styles.ctaBtn}
                  onClick={() => setActiveTab("createtest")}
                >
                  Create Test
                </button>
              </div>
            ) : (
              <div className={styles.testGrid}>
                {myTests.map((test) => (
                  <div key={test.id} className={styles.testCard}>
                    <div className={styles.testCardTop}>
                      <span className={styles.testSubjectBadge}>
                        {test.subjectName}
                      </span>
                      <span className={styles.testQuestionCount}>
                        {test.totalQuestions} questions
                      </span>
                    </div>
                    <h3 className={styles.testCardTitle}>{test.title}</h3>
                    <p className={styles.testCardDate}>
                      Created: {new Date(test.createdAt).toLocaleDateString("en-IN")}
                    </p>
                    <button
                      className={styles.addQuestionsBtn}
                      onClick={() => {
                        setSelectedTest(test)
                        setAddQError("")
                        setAddQSuccess("")
                        setBulkQuestions([
                          { questionText: "", optionA: "", optionB: "",
                            optionC: "", optionD: "", correctOption: "" }
                        ])
                      }}
                    >
                      <FiPlus /> Add Questions
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            ADD QUESTIONS (sub-view of My Tests)
        ════════════════════════════════════════ */}
        {activeTab === "mytests" && selectedTest && (
          <div className={styles.tabContent}>

            <button
              className={styles.backBtn}
              onClick={() => setSelectedTest(null)}
            >
              ← Back to My Tests
            </button>

            <h2 className={styles.pageTitle}>
              Add Questions — {selectedTest.title}
            </h2>
            <p className={styles.subTitle}>
              Subject: {selectedTest.subjectName} &nbsp;|&nbsp;
              Current questions: {selectedTest.totalQuestions}
            </p>

            {addQError   && <div className={styles.formError}>{addQError}</div>}
            {addQSuccess && <div className={styles.formSuccess}>{addQSuccess}</div>}

            <form onSubmit={handleAddQuestions}>
              {bulkQuestions.map((q, index) => (
                <div key={index} className={styles.questionBlock}>
                  <div className={styles.questionBlockHeader}>
                    <span className={styles.questionNumber}>
                      Question {index + 1}
                    </span>
                    {bulkQuestions.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeQuestionRow(index)}
                      >
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Question Text</label>
                    <input
                      type="text"
                      placeholder="e.g. What is 2 + 2?"
                      value={q.questionText}
                      onChange={e => updateQuestion(index, "questionText", e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.optionsGrid}>
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt} className={styles.formGroup}>
                        <label>Option {opt}</label>
                        <input
                          type="text"
                          placeholder={`Option ${opt}`}
                          value={q[`option${opt}`]}
                          onChange={e => updateQuestion(index, `option${opt}`, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Correct Answer</label>
                    <select
                      value={q.correctOption}
                      onChange={e => updateQuestion(index, "correctOption", e.target.value)}
                      required
                    >
                      <option value="" disabled>Select correct option</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addMoreBtn}
                onClick={addQuestionRow}
              >
                <FiPlus /> Add Another Question
              </button>

              <button
                type="submit"
                className={styles.ctaBtn}
                disabled={addQLoading}
                style={{ marginTop: "16px" }}
              >
                {addQLoading
                  ? "Saving..."
                  : `Save ${bulkQuestions.length} Question(s)`}
              </button>
            </form>
          </div>
        )}

        {/* ════════════════════════════════════════
            CREATE TEST TAB
        ════════════════════════════════════════ */}
        {activeTab === "createtest" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>Create New Test</h2>

            {createError   && <div className={styles.formError}>{createError}</div>}
            {createSuccess && <div className={styles.formSuccess}>{createSuccess}</div>}

            <div className={styles.createCard}>
              <form onSubmit={handleCreateTest} className={styles.createForm}>

                {/* ── Test Title ── */}
                <div className={styles.formGroup}>
                  <label>Test Title</label>
                  <input
                    type="text"
                    placeholder='e.g. "Math Mid-Term 2026"'
                    value={createForm.title}
                    onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                {/* ── Subject Dropdown ── */}
                <div className={styles.formGroup}>
                  <label>Subject</label>
                  {subjects.length === 0 ? (
                    <p className={styles.noSubjects}>
                      No subjects yet. Create one below!
                    </p>
                  ) : (
                    <select
                      value={createForm.subjectId}
                      onChange={e => setCreateForm(p => ({ ...p, subjectId: e.target.value }))}
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* ── Inline Subject Creation ── */}
                {!showNewSubject ? (
                  <button
                    type="button"
                    className={styles.addSubjectToggle}
                    onClick={() => setShowNewSubject(true)}
                  >
                    + Can't find your subject? Create one
                  </button>
                ) : (
                  <div className={styles.newSubjectBox}>
                    <p className={styles.newSubjectLabel}>New Subject Name</p>
                    <div className={styles.newSubjectRow}>
                      <input
                        type="text"
                        placeholder='e.g. "Physics"'
                        value={newSubjectName}
                        onChange={e => setNewSubjectName(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.addSubjectBtn}
                        onClick={handleCreateSubject}
                        disabled={subjectLoading}
                      >
                        {subjectLoading ? "Adding..." : "Add"}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelSubjectBtn}
                        onClick={() => {
                          setShowNewSubject(false)
                          setNewSubjectName("")
                          setSubjectError("")
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    {subjectError && (
                      <p className={styles.subjectError}>{subjectError}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.ctaBtn}
                  disabled={createLoading || !createForm.subjectId}
                >
                  {createLoading ? "Creating..." : "Create Test"}
                </button>

              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SETTINGS TAB
        ════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <div className={styles.tabContent}>
            <h2 className={styles.pageTitle}>Settings</h2>

            <div className={styles.settingsCard}>
              <h3 className={styles.settingsSection}>Change Password</h3>

              {pwError   && <div className={styles.formError}>{pwError}</div>}
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

export default AdminDashboard