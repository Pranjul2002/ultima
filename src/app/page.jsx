// Server Component — no "use client" needed
"use client"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Gideon_Roman } from "next/font/google"
import style from "./page.module.css"
import Link from "next/link"

const gideon = Gideon_Roman({
  weight: "400",
  subsets: ["latin"],
})
const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // smooth cubic-bezier
    },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
}
const images = Object.freeze([
  "/homePage/carousel1.png",
  "/homePage/carousel2.png",
  "/homePage/carousel3.png",
  "/homePage/carousel4.png",
  "/homePage/carousel5.png",
  "/homePage/carousel6.png",
  "/homePage/carousel7.png",
])

// FIX 4: Descriptive constant names instead of QUOTE / QUOTE2
const FRANKLIN_QUOTE = {
  line: "Starting is essential for progress.",
  text: '"An investment in knowledge always pays the best interest."',
  author: "– Benjamin Franklin",
}

const ZIGLAR_QUOTE = {
  line: '"Ace the clock and conquer your next big exam with Ultima"',
}

// FIX 2: Configurable carousel repeat count
const CAROUSEL_REPEAT = 2

const Home = () => {
  return (
    <div className={style.home}>

      {/* ── Banner ── */}
      <div className={style.bannerArea}>
        <div className={style.bannerContainer}>
          <div className={style.bubbles}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            </div> {/* NEW */}
          <motion.div
            className={`${style.bannerText} ${gideon.className}`}
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={style.floatingShape}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.h1 className={style.bannerHeading} variants={fadeUp}>
              Practice is the only force that
              <br />
              <span className={style.highlight}>transforms potential</span>
              <br />
              into identity.
            </motion.h1>

            <motion.p className={style.bannerSubText} variants={fadeUp}>
              From <strong>what you could do</strong> → to{" "}
              <strong>who you become</strong>.
            </motion.p>

            <motion.p className={style.bannerTagline} variants={fadeUp}>
              You are the sum of your repetitions.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/products" className={style.ctaButton}>
                Practice Now →
              </Link>
            </motion.div>

            <motion.blockquote
              className={style.quoteBlock}
              variants={fadeIn}
            >
              <p className={style.quoteLine}>
                "Ace the clock and conquer your next big exam with Ultima"
              </p>
            </motion.blockquote>

          </motion.div>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className={style.homeCarouselArea}>
        <div className={style.carouselContainer}>
          <div className={style.carouselTrack}>
            {/* FIX 2: Data-driven duplication via CAROUSEL_REPEAT */}
            {Array.from({ length: CAROUSEL_REPEAT }, () => images)
              .flat()
              .map((src, index) => (
                <div
                  className={style.carouselItem}
                  key={`${src}-${index}`}
                  // aria-hidden on all duplicated copies
                  aria-hidden={index >= images.length}
                >
                  <Image
                    src={src}
                    // FIX 3: Empty alt="" for purely decorative carousel images
                    alt=""
                    width={200}
                    height={200}
                    // FIX 7: Eager-load originals; lazy-load duplicates
                    loading={index < images.length ? "eager" : "lazy"}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── Growth / Quote Section ── */}
      <section className={style.growthMindSetArea}>
        <div className={style.container}>
          {/* FIX 6: Semantic <blockquote> instead of a single <p> with <br /> */}
          <blockquote className={`${style.growthText} ${gideon.className}`}>
            <p className={style.growthLine}>{FRANKLIN_QUOTE.line}</p>
            <span className={style.divider}></span>
            <p className={style.growthQuote}>{FRANKLIN_QUOTE.text}</p>
            <footer className={style.growthAuthor}>{FRANKLIN_QUOTE.author}</footer>
          </blockquote>
        </div>
      </section>

    </div>
  )
}

export default Home