"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import styles from "./SignInForm.module.css";

const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field) => (e) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.email.trim()) return "Email is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.password) return "Password is required.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(data?.message || "Login successful.");
      await login();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google OAuth not wired yet");
  };

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="signin-email" className={styles.label}>
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="signin-password" className={styles.label}>
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or continue with Google</span>
      </div>

      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleSignIn}
      >
        <span className={styles.googleIcon}>G</span>
        Continue with Google
      </button>
    </div>
  );
};

export default SignInForm;
