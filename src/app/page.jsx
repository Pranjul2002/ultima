// No "use client" — Server Component
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

const QUOTE = {
  line: "Starting is essential for progress.",
  text: '"An investment in knowledge always pays the best interest."',
  author: "– Benjamin Franklin",
}
const QUOTE2 = {
  line: "You don't have to be great to start, but you have to start to be great." ,
  author: "– Zig Ziglar",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Home = () => {
  return (
    <div className={style.home}>

      {/* Banner */}
      <div className={style.bannerArea}>
        <div className={style.bannerContainer}>
          <div className={`${style.bannerText} ${gideon.className}`}>
            <h1 className={style.bannerHeading}>
              Welcome to the <span className={style.highlight}>Ultimate</span>  practice Platform.<br/>
              <span className={style.divider}></span>
              Practice is the only force that
              <br />
              <span className={style.highlight}>transforms potential</span>
              <br />
              into identity.
            </h1>

            <p className={style.bannerSubText}>
              From <strong>what you could do</strong> → to <strong>who you become</strong>.
            </p>

            <p className={style.bannerTagline}>
              You are the sum of your repetitions.
            </p>
            <Link href="/products">
              <button className={style.ctaButton}>
                Practice Now →
              </button>
            </Link>
            <div className={style.quoteBlock}>
              <p className={style.quoteLine}>{QUOTE2.line}</p>
              <p className={style.quoteAuthor}>{QUOTE2.author}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className={style.homeCarouselArea}>
        <div className={style.carouselContainer}>
          <div className={style.carouselTrack}>
            {[...images, ...images].map((src, index) => (
              <div
                className={style.carouselItem}
                key={`${src}-${index}`}
                aria-hidden={index >= images.length}
              >
                <Image
                  src={src}
                  alt={`slide-${index}`}
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Section */}
      <section className={style.growthMindSetArea}>
        <div className={style.container}>
          <p className={`${style.growthText} ${gideon.className}`}>
            {QUOTE.line}
            <span className={style.divider}></span>
            {QUOTE.text}
            <br />
            {QUOTE.author}
          </p>
        </div>
      </section>

    </div>
  )
}

export default Home