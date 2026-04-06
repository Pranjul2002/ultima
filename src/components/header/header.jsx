"use client"
import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import styles from "./header.module.css"
import Image from "next/image"

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/upskilling", label: "ReviseAI ✨" },
  { href: "/products",   label: "Products" },
  { href: "/about-us",   label: "About" },
  { href: "/contact",    label: "Contact" },
]

const EXPLORE_LINKS = [
  // FIX 3: "competetive" → "competitive"
  { href: "/products/competitive/jee",  label: "JEE Preparation" },
  { href: "/products/competitive/neet", label: "NEET Preparation" },
  { href: "/products/class_10",         label: "School 10th Boards" },
  { href: "/products/class_12",         label: "School 12th Boards" },
  { href: "/products",                  label: "All" },
]

const Header = () => {
  const router   = useRouter()
  const pathname = usePathname()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)
  const [userInitial, setUserInitial] = useState("U")

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu  = () => setMenuOpen(false)

  /* ────────────────────────────────────────────
     FIX 1: Wrapped in useCallback so the same
     function reference is used across renders.
     This ensures addEventListener/removeEventListener
     correctly pair up and prevents memory leaks.
  ──────────────────────────────────────────── */
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    if (token) {
      try {
        // JWT = header.payload.signature
        // atob() decodes base64 → gives us JSON string
        const payload = JSON.parse(atob(token.split(".")[1]))

        // "sub" = subject = email (Spring Boot default)
        // "name" = name if backend puts it in token
        const initial = (payload.name || payload.sub || "U")
          .charAt(0)
          .toUpperCase()

        setUserInitial(initial)
      } catch {
        // Token is malformed → treat as logged out
        setUserInitial("U")
      }
    } else {
      setUserInitial("U")
    }
  }, [])

  /* ────────────────────────────────────────────
     Re-check auth on EVERY route change.
     FIX 2: Added checkAuth to dependency array.
  ──────────────────────────────────────────── */
  useEffect(() => {
    checkAuth()
  }, [pathname, checkAuth])

  /* ────────────────────────────────────────────
     Listen for manual auth events.
     "authChange" → fired by login/logout in same tab
     "storage"    → fired when OTHER tab changes localStorage
  ──────────────────────────────────────────── */
  useEffect(() => {
    window.addEventListener("authChange", checkAuth)
    window.addEventListener("storage",    checkAuth)

    return () => {
      window.removeEventListener("authChange", checkAuth)
      window.removeEventListener("storage",    checkAuth)
    }
  }, [checkAuth])

  /* ────────────────────────────────────────────
     Logout handler
  ──────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("authChange"))
    closeMenu()
    router.push("/")
  }

  return (
    <header className={styles.header}>

      {/* Hamburger — mobile only */}
      <button
        className={styles.menuToggleButton}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`${styles.container} ${menuOpen ? styles.menuOpen : ""}`}>

        {/* ── Column 1 — Logo + Explore dropdown ── */}
        <div className={styles.headerCol1}>
          <Link href="/" className={styles.logoContainer} onClick={closeMenu}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="EduTech Logo"
                fill
                className={styles.logoImage}
              />
            </div>
          </Link>

          <div className={styles.exploreTestButton}>
            Explore Test
            <div className={styles.exploreTestButtonDropdownMenu}>
              <div className={styles.testTypeList}>
                <ul>
                  {EXPLORE_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} onClick={closeMenu}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 2 — Nav links ── */}
        <nav>
          <ul className={styles.menuItem}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.item} ${pathname === href ? styles.activeItem : ""}`}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Column 3 — Auth section ── */}
        <div className={styles.headerCol3}>
          {isLoggedIn ? (

            /* Logged in → profile avatar + dropdown */
            <div className={styles.profileDropdownWrapper}>

              <div className={styles.profileAvatar}>
                <span>{userInitial}</span>
              </div>

              <div className={styles.profileDropdownMenu}>

                <div className={styles.dropdownArrow} />

                <Link
                  href="/dashboard"
                  className={styles.dropdownItem}
                  onClick={closeMenu}
                >
                  <span className={styles.dropdownItemIcon}>🏠</span>
                  Dashboard
                </Link>

                <Link
                  href="/dashboard?tab=settings"
                  className={styles.dropdownItem}
                  onClick={closeMenu}
                >
                  <span className={styles.dropdownItemIcon}>⚙️</span>
                  Settings
                </Link>

                <div className={styles.dropdownDivider} />

                <button
                  className={styles.dropdownLogout}
                  onClick={handleLogout}
                >
                  <span className={styles.dropdownItemIcon}>🚪</span>
                  Logout
                </button>

              </div>
            </div>

          ) : (

            /* Logged out → sign in / register button */
            <Link
              href="/signIn-Register"
              className={styles.loginRegisterButton}
              onClick={closeMenu}
            >
              Sign in / Register
            </Link>

          )}
        </div>

      </div>
    </header>
  )
}

export default Header