"use client"

import { useState } from "react"
import styles from "./forgot.module.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setMessage("📩 Reset link sent! Check your email.")
      setEmail("")
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2 className={styles.title}>Forgot Password?</h2>
        <p className={styles.subtitle}>
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <span className={styles.icon}>📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <a href="/signIn-Register" className={styles.backLink}>
          ← Back to Login
        </a>

      </div>
    </div>
  )
}