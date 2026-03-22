"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import style from "./siginRegister.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const defaultLogin    = { email: "", password: "" }
const defaultRegister = { name: "", email: "", password: "", gender: "", dateOfBirth: "", role: "" }

const TODAY = new Date().toISOString().split("T")[0]

const Page = () => {
  const router = useRouter()

  const [showLogin,         setShowLogin]         = useState(true)
  const [loading,           setLoading]           = useState(false)
  const [error,             setError]             = useState("")
  const [success,           setSuccess]           = useState("")
  const [loginCredentials,  setLoginCredentials]  = useState(defaultLogin)
  const [signupCredentials, setSignupCredentials] = useState(defaultRegister)

  const clearMessages = () => { setError(""); setSuccess("") }
  const switchView = (v) => { setShowLogin(v); clearMessages() }

  /* ── Input handlers ── */
  const handleLoginChange = (field) => (e) =>
    setLoginCredentials(prev => ({ ...prev, [field]: e.target.value }))

  const handleRegisterChange = (field) => (e) =>
    setSignupCredentials(prev => ({ ...prev, [field]: e.target.value }))

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages()

    if (!loginCredentials.email || !loginCredentials.password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCredentials),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Invalid credentials")
      localStorage.setItem("token", data.token)
      window.dispatchEvent(new Event("authChange"))
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault()
    clearMessages()

    if (signupCredentials.name.trim().length < 2) {
      setError("Name must be at least 2 characters.")
      return
    }
    if (signupCredentials.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (!signupCredentials.role) {
      setError("Please select a role.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupCredentials),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Registration failed")
      setSignupCredentials(defaultRegister)
      setSuccess("Account created! You can now sign in.")
      switchView(true)
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }



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

          {/* Tabs */}
          <div className={style.switchButtons}>
            <button
              type="button"
              className={showLogin ? style.activeToggle : ""}
              onClick={() => switchView(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={!showLogin ? style.activeToggle : ""}
              onClick={() => switchView(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className={style.errorMessage} role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          {success && (
            <div className={style.successMessage} role="status" aria-live="polite">
              {success}
            </div>
          )}

          {/* ── Login Form ── */}
          {showLogin ? (
            <form onSubmit={handleLogin} className={style.form}>
              <h2>Sign In</h2>

              <input
                type="email"
                placeholder="Email"
                value={loginCredentials.email}
                onChange={handleLoginChange("email")}
                autoComplete="email"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginCredentials.password}
                onChange={handleLoginChange("password")}
                autoComplete="current-password"
                required
              />

              {/* Navigates to your existing forgot password page */}
              <Link href="/signIn-Register/forgot-password" className={style.forgotLink}>
                Forgot password?
              </Link>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>


          ) : (
            <form onSubmit={handleRegister} className={style.form}>
              <h2>Sign Up</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={signupCredentials.name}
                onChange={handleRegisterChange("name")}
                autoComplete="name"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupCredentials.email}
                onChange={handleRegisterChange("email")}
                autoComplete="email"
                required
              />
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={signupCredentials.password}
                onChange={handleRegisterChange("password")}
                autoComplete="new-password"
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

              {/* Role field */}
              <select
                value={signupCredentials.role}
                onChange={handleRegisterChange("role")}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>

              <label className={style.fieldLabel}>Date of Birth</label>
              <input
                type="date"
                value={signupCredentials.dateOfBirth}
                max={TODAY}
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