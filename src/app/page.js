"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Gideon_Roman } from "next/font/google";
import style from "./page.module.css";

const gideon = Gideon_Roman({
  weight: "400",
  subsets: ["latin"],
});

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9 },
  },
};

const images = Object.freeze([
  "/homePage/carousel1.png",
  "/homePage/carousel2.png",
  "/homePage/carousel3.png",
  "/homePage/carousel4.png",
  "/homePage/carousel5.png",
  "/homePage/carousel6.png",
  "/homePage/carousel7.png",
]);

const FRANKLIN_QUOTE = {
  line: "Starting is essential for progress.",
  text: '"An investment in knowledge always pays the best interest."',
  author: "– Benjamin Franklin",
};

const CAROUSEL_REPEAT = 2;

const Home = () => {
  return (
    <div className={style.home}>
      <section className={style.heroSection}>
        <div className={style.heroShell}>
          <div className={style.orbOne}></div>
          <div className={style.orbTwo}></div>

          <div className={style.bubbles} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <motion.div
            className={`${style.heroContent} ${gideon.className}`}
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.p className={style.eyebrow} variants={fadeUp}>
              Ultima • Practice with purpose
            </motion.p>

            <motion.h1 className={style.heroTitle} variants={fadeUp}>
              Practice is the only force that
              <br />
              <span className={style.highlight}>transforms potential</span>
              <br />
              into identity.
            </motion.h1>

            <motion.p className={style.heroSubtitle} variants={fadeUp}>
              From <strong>what you could do</strong> to{" "}
              <strong>who you become</strong>.
            </motion.p>

            <motion.p className={style.heroTagline} variants={fadeUp}>
              You are the sum of your repetitions.
            </motion.p>

            <motion.div className={style.heroActions} variants={fadeUp}>
              <Link href="/products" className={style.primaryButton}>
                Practice Now
              </Link>

              <Link href="/upskilling" className={style.secondaryButton}>
                Explore More
              </Link>
            </motion.div>

            <motion.blockquote className={style.heroQuote} variants={fadeIn}>
              <p>
                “Ace the clock and conquer your next big exam with Ultima.”
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </section>

      <section className={style.brandStrip}>
        <div className={style.carouselContainer}>
          <div className={style.carouselTrack}>
            {Array.from({ length: CAROUSEL_REPEAT }, () => images)
              .flat()
              .map((src, index) => (
                <div
                  className={style.carouselItem}
                  key={`${src}-${index}`}
                  aria-hidden={index >= images.length}
                >
                  <Image
                    src={src}
                    alt=""
                    width={180}
                    height={180}
                    loading={index < images.length ? "eager" : "lazy"}
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className={style.quoteSection}>
        <div className={style.quoteContainer}>
          <blockquote className={`${style.quoteCard} ${gideon.className}`}>
            <p className={style.quoteLead}>{FRANKLIN_QUOTE.line}</p>
            <span className={style.quoteDivider}></span>
            <p className={style.quoteText}>{FRANKLIN_QUOTE.text}</p>
            <footer className={style.quoteAuthor}>{FRANKLIN_QUOTE.author}</footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default Home;