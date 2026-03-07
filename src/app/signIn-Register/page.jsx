"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import style from "./siginRegister.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const defaultLogin    = { email: "", password: "" }
const defaultRegister = { name: "", email: "", password: "", gender: "", dateOfBirth: "" }

const Page = () => {
  const router = useRouter()

  const [isLoginToggle,    setIsLoginToggle]    = useState(true)
  const [loading,          setLoading]          = useState(false)
  const [error,            setError]            = useState("")
  const [success,          setSuccess]          = useState("")
  const [loginCredentials, setLoginCredentials] = useState(defaultLogin)
  const [signupCredentials, setSignupCredentials] = useState(defaultRegister)

  const clearMessages = () => { setError(""); setSuccess("") }

  /* ── Input handlers ── */
  const handleLoginChange = (field) => (e) =>
    setLoginCredentials(prev => ({ ...prev, [field]: e.target.value }))

  const handleRegisterChange = (field) => (e) =>
    setSignupCredentials(prev => ({ ...prev, [field]: e.target.value }))

  /* ────────────────────────────────────────────
     LOGIN
  ──────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCredentials),
      })

      // Read body ONCE as text
      const rawText = await res.text()

      // Debug logs — remove after confirming it works
      console.log("Login status:", res.status)
      console.log("Login raw response:", rawText)

      // Guard against empty response
      if (!rawText) {
        throw new Error("Server returned empty response. Is the backend running?")
      }

      // Parse text → JSON manually (never call res.json() after res.text())
      let data
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error(`Server returned invalid JSON: ${rawText.slice(0, 100)}`)
      }

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials")
      }

      // Store token
      localStorage.setItem("token", data.token)

      // Notify header to update avatar instantly
      window.dispatchEvent(new Event("authChange"))

      router.push("/dashboard")

    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  /* ────────────────────────────────────────────
     REGISTER
  ──────────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupCredentials),
      })

      // Read body ONCE as text
      const rawText = await res.text()

      // Debug logs — remove after confirming it works
      console.log("Register status:", res.status)
      console.log("Register raw response:", rawText)

      // Guard against empty response
      if (!rawText) {
        throw new Error("Server returned empty response. Is the backend running?")
      }

      // Parse text → JSON manually
      let data
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error(`Server returned invalid JSON: ${rawText.slice(0, 100)}`)
      }

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Reset form + show success
      setSignupCredentials(defaultRegister)
      setSuccess("Account created! You can now sign in.")
      setIsLoginToggle(true)

    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  /* ────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────── */
  return (
    <div className={style.signInRegister}>

      {/* Hero Panel */}
      <div className={style.signInRegisterHero}>
        <h1>WELCOME</h1>
        <h6>Start a new journey by joining in.</h6>
      </div>

      {/* Form Container */}
      <div className={style.signInRegisterContainer}>
        <div className={style.signInRegisterWrapper}>

          {/* Toggle buttons */}
          <div className={style.switchButtons}>
            <button
              className={isLoginToggle ? style.activeToggle : ""}
              onClick={() => { setIsLoginToggle(true); clearMessages() }}
            >
              Sign In
            </button>
            <button
              className={!isLoginToggle ? style.activeToggle : ""}
              onClick={() => { setIsLoginToggle(false); clearMessages() }}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {error   && <div className={style.errorMessage}>{error}</div>}
          {success && <div className={style.successMessage}>{success}</div>}

          {/* ── Login Form ── */}
          {isLoginToggle ? (
            <form
              onSubmit={handleLogin}
              className={`${style.form} ${style.loginForm}`}
            >
              <h2>Sign In</h2>

              <input
                type="email"
                placeholder="Email"
                value={loginCredentials.email}
                onChange={handleLoginChange("email")}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginCredentials.password}
                onChange={handleLoginChange("password")}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

          ) : (

            /* ── Register Form ── */
            <form
              onSubmit={handleRegister}
              className={`${style.form} ${style.registerForm}`}
            >
              <h2>Sign Up</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={signupCredentials.name}
                onChange={handleRegisterChange("name")}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={signupCredentials.email}
                onChange={handleRegisterChange("email")}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={signupCredentials.password}
                onChange={handleRegisterChange("password")}
                required
              />

              <select
                value={signupCredentials.gender}
                onChange={handleRegisterChange("gender")}
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label className={style.fieldLabel}>Date of Birth</label>
              <input
                type="date"
                value={signupCredentials.dateOfBirth}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleRegisterChange("dateOfBirth")}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default Page
