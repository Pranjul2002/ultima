"use client"
import React, { useState } from "react"
import Link from "next/link"
import styles from "./header.module.css"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upskilling", label: "Upskilling" },
  { href: "/test", label: "Tests" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const EXPLORE_LINKS = [
  { href: "/products/competetive/jee", label: "JEE Preparation" },
  { href: "/products/competetive/neet", label: "NEET Preparation" },
  { href: "/products/class_10", label: "School 10th Boards" },
  { href: "/products/class_12", label: "School 12th Boards" },
  { href: "/products", label: "All" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={styles.header}>

      <button
        className={styles.menuToggleButton}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`${styles.container} ${menuOpen ? styles.menuOpen : ""}`}>

        {/* Column 1 — Logo + Explore Dropdown */}
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

        {/* Column 2 — Nav Links */}
        <nav className={styles.navContainer}>
          <ul className={styles.menuItem}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.item} onClick={closeMenu}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3 — Auth Button */}
        <div className={styles.headerCol3}>
          <Link
            href="/signIn-Register"
            className={styles.loginRegisterButton}
            onClick={closeMenu}
          >
            Sign in / Register
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Header