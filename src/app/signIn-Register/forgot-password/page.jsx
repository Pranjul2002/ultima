"use client"
import { useState } from "react"
import Link from "next/link"
import styles from "./forgot.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error,   setError]   = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")
      setMessage("📩 Reset link sent! Check your email.")
      setEmail("")
    } catch (err) {
      setError(err.message)
    } finally {
      // FIX 2: moved into finally so loading always resets
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2 className={styles.title}>Forgot Password?</h2>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.icon} aria-hidden="true">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // FIX 4: autoComplete for password managers / browsers
              autoComplete="email"
              required
            />
          </div>

          {/* FIX 5: explicit type="submit" */}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* FIX 3: aria-live for screen reader announcements */}
        {message && (
          <p className={styles.success} role="status" aria-live="polite">
            {message}
          </p>
        )}
        {error && (
          <p className={styles.error} role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {/* FIX 1: Link instead of <a> for client-side navigation */}
        <Link href="/signIn-Register" className={styles.backLink}>
          ← Back to Login
        </Link>

      </div>
    </div>
  )
}