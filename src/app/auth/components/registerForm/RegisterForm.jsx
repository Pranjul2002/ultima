"use client";

import React, { useState } from "react";
import { registerUser } from "@/services/authService";
import styles from "./RegisterForm.module.css";

const initialForm = {
  username: "",
  email: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  role: "STUDENT",
};

const RegisterForm = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field) => (e) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.dateOfBirth) return "Date of birth is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (!form.confirmPassword) return "Please confirm your password.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";

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
      const data = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        password: form.password,
        role: form.role,
      });

      setSuccess(data?.message || "User registered successfully");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    console.log("Google OAuth not wired yet");
  };

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="register-username" className={styles.label}>
            Username
          </label>
          <input
            id="register-username"
            type="text"
            className={styles.input}
            value={form.username}
            onChange={handleChange("username")}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="register-email" className={styles.label}>
            Email
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-dob" className={styles.label}>
            Date of Birth
          </label>
          <input
            id="register-dob"
            type="date"
            className={styles.input}
            value={form.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>I am a...</label>
          <div className={styles.roleGroup}>
            {["STUDENT", "MENTOR"].map((role) => (
              <button
                key={role}
                type="button"
                aria-pressed={form.role === role}
                className={`${styles.roleBtn} ${form.role === role ? styles.roleActive : ""}`}
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setForm((prev) => ({ ...prev, role }));
                }}
              >
                {role === "STUDENT" ? "🎓 Student" : "🧑‍🏫 Mentor"}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="register-password" className={styles.label}>
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange("password")}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="register-confirm-password" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            className={styles.input}
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or continue with Google</span>
      </div>

      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleRegister}
      >
        <span className={styles.googleIcon}>G</span>
        Continue with Google
      </button>
    </div>
  );
};

export default RegisterForm;