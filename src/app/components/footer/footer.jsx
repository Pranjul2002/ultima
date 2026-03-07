import React from 'react'
import Link from 'next/link'
import style from './footer.module.css'

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerArea}>
        <div className={style.footerAreaWrapper}>

          {/* Top section */}
          <div className={style.container}>
            <div className={style.footerColumn}>

              {/* Brand + About */}
              <div className={style.footerAboutUs}>
                <Link href="/" className={style.logo}>
                  <h2>EduTech</h2>
                </Link>
                <p className={style.footerAboutUsPara}>
                  Build your network, share skills, and open up on the
                  learning platform where education blooms.
                </p>
              </div>

              {/* Social Links */}
              <div className={style.socialMediaBlock}>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </Link>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </Link>
              </div>

            </div>
          </div>

          {/* Bottom copyright bar */}
          <div className={style.copyrightContent}>
            <p className={style.copyrightText}>
              Copyright © {new Date().getFullYear()} EduTech | All rights reserved.
            </p>
            <nav className={style.copyrightMenu}>
              <ul>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy &amp; Policy</Link></li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer