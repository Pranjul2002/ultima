"use client"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import styles from "./reset.module.css"
import { FiEye, FiEyeOff } from "react-icons/fi"

// ✅ Inner component that uses useSearchParams
function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Reset failed")

      setMessage("✅ Password reset successful! Redirecting...")
      setTimeout(() => router.push("/signIn-Register"), 2000)
    } catch (err) {
      setError(err.message || "Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>Enter your new password below</p>

        <form onSubmit={handleReset} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(p => !p)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowConfirm(p => !p)}>
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <a href="/signIn-Register" className={styles.backLink}>← Back to Login</a>
      </div>
    </div>
  )
}

// ✅ Default export wraps with Suspense
export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}