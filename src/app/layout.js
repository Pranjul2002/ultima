import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "./components/header/header"
import Footer from "./components/footer/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "EduTech — Learn, Practice, Grow",
  description: "EduTech is an online learning platform for students to practice tests, track progress, and build skills for JEE, NEET, and board exams.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}