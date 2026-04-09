"use client";

import React, { useState } from "react";
import SignInForm from "./components/signInForm/SignInForm";
import RegisterForm from "./components/registerForm/RegisterForm";
import styles from "./auth.module.css";

const SignInRegisterPage = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Welcome to Ultima</p>
          <h1 className={styles.title}>
            {activeTab === "signin" ? "Sign in to continue" : "Create your account"}
          </h1>
          <p className={styles.subtitle}>
            {activeTab === "signin"
              ? "Access your dashboard, tests, and progress in one place."
              : "Start your learning journey with a clean and focused experience."}
          </p>
        </div>

        <div className={styles.toggleWrap}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${activeTab === "signin" ? styles.active : ""}`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`${styles.toggleBtn} ${activeTab === "register" ? styles.active : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className={styles.formArea}>
          {activeTab === "signin" ? <SignInForm /> : <RegisterForm />}
        </div>
      </section>
    </main>
  );
};

export default SignInRegisterPage;