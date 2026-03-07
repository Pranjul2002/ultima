"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import styles from "./header.module.css"

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/upskilling", label: "Upskilling" },
  { href: "/test",       label: "Tests" },
  { href: "/products",   label: "Products" },
  { href: "/about",      label: "About" },
  { href: "/contact",    label: "Contact" },
]

const EXPLORE_LINKS = [
  { href: "/products/competetive/jee",  label: "JEE Preparation" },
  { href: "/products/competetive/neet", label: "NEET Preparation" },
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
     Core auth check — reads token from
     localStorage and updates state
  ──────────────────────────────────────────── */
  const checkAuth = () => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    if (token) {
      try {
        // JWT = header.payload.signature
        // atob() decodes base64 → gives us JSON string
        // JSON.parse() converts to object
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
  }

  /* ────────────────────────────────────────────
     Re-check auth on EVERY route change

     Why needed:
     Header lives in layout.jsx → never unmounts
     When user logs in → router.push("/dashboard")
     pathname changes → this useEffect fires
     checkAuth runs → reads new token → updates UI ✅

     Without this: header only checks on first load
     and never again until manual refresh ❌
  ──────────────────────────────────────────── */
  useEffect(() => {
    checkAuth()
  }, [pathname])

  /* ────────────────────────────────────────────
     Listen for manual auth events

     "authChange" → fired by login/logout in same tab
     "storage"    → fired when OTHER tab changes localStorage
  ──────────────────────────────────────────── */
  useEffect(() => {
    window.addEventListener("authChange", checkAuth)
    window.addEventListener("storage",    checkAuth)

    // Cleanup — remove listeners when header unmounts
    // prevents memory leaks
    return () => {
      window.removeEventListener("authChange", checkAuth)
      window.removeEventListener("storage",    checkAuth)
    }
  }, [])

  /* ────────────────────────────────────────────
     Logout handler
  ──────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("token")
    // Notify header (same tab) immediately
    window.dispatchEvent(new Event("authChange"))
    closeMenu()
    router.push("/")
  }

  /* ────────────────────────────────────────────
     Render
  ──────────────────────────────────────────── */
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

          <Link href="/" className={styles.logo} onClick={closeMenu}>
            EduTech
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
        <nav className={styles.navContainer}>
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

                {/* Arrow tip */}
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