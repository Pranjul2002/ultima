import React from 'react'
import Link from 'next/link'
import style from './footer.module.css'

const Footer = () => {
  return (
    <footer className={style.footer}>

      {/* ── Top section ── */}
      <div className={style.footerTop}>
        <div className={style.footerInner}>

          {/* Brand + About */}
          <div className={style.footerAboutUs}>
            {/* FIX 1: Removed <h2> inside <Link> — invalid HTML */}
            {/* FIX 5: Logo styled as text directly on the <Link> */}
            <Link href="/" className={style.logo}>
              Ultima — Reach the Peak
            </Link>
            <p className={style.footerAboutUsPara}>
              Practice is the only force that
              <br />
              transforms potential into identity.
            </p>
          </div>

          {/* Social Links */}
          {/* FIX 6: Added aria-label for screen reader context */}
          <div className={style.socialMediaBlock}>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              Twitter
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              Instagram
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on LinkedIn"
            >
              LinkedIn
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className={style.copyrightContent}>
        <p className={style.copyrightText}>
          Copyright © {new Date().getFullYear()} Ultima Edu Ltd. | All rights reserved.
        </p>
        {/* FIX 8: &amp; → plain & (JSX handles it fine) */}
        <nav className={style.copyrightMenu}>
          <ul>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy & Policy</Link></li>
          </ul>
        </nav>
      </div>

    </footer>
  )
}

export default Footer