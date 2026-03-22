// Server Component — no "use client" needed
import React from "react"
import Image from "next/image"
import { Gideon_Roman } from "next/font/google"
import style from "./page.module.css"
import Link from "next/link"

const gideon = Gideon_Roman({
  weight: "400",
  subsets: ["latin"],
})

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
  line: "You don't have to be great to start, but you have to start to be great.",
  author: "– Zig Ziglar",
}

// FIX 2: Configurable carousel repeat count
const CAROUSEL_REPEAT = 2

const Home = () => {
  return (
    <div className={style.home}>

      {/* ── Banner ── */}
      <div className={style.bannerArea}>
        <div className={style.bannerContainer}>
          <div className={`${style.bannerText} ${gideon.className}`}>

            <h1 className={style.bannerHeading}>
              Welcome to the{" "}
              <span className={style.highlight}>Ultimate</span> Platform.
              <br />
              <span className={style.divider}></span>
              Practice is the only force that
              <br />
              <span className={style.highlight}>transforms potential</span>
              <br />
              into identity.
            </h1>

            <p className={style.bannerSubText}>
              From <strong>what you could do</strong> → to{" "}
              <strong>who you become</strong>.
            </p>

            <p className={style.bannerTagline}>
              You are the sum of your repetitions.
            </p>

            {/* FIX 5: <Link> styled directly — no nested <button> inside <Link> */}
            <Link href="/products" className={style.ctaButton}>
              Practice Now →
            </Link>

            {/* FIX 6: Semantic <blockquote> for the Ziglar quote */}
            <blockquote className={style.quoteBlock}>
              <p className={style.quoteLine}>{ZIGLAR_QUOTE.line}</p>
              <footer className={style.quoteAuthor}>{ZIGLAR_QUOTE.author}</footer>
            </blockquote>

          </div>
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