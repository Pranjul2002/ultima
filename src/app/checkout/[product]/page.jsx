"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./checkout.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

// ── Product catalogue ──────────────────────────────────────────
const PRODUCTS = {
  class_10: {
    name: "Class 10 Complete Prep",
    desc: "Full access to all Class 10 subjects — Physics, Chemistry, Maths & Social Science",
    price: 499,
    originalPrice: 999,
    emoji: "📘",
    color: "#2563eb",
    features: [
      "500+ Practice Questions",
      "Chapter-wise + Mock Tests",
      "Real CBSE Exam Pattern",
      "Instant Performance Analysis",
      "Reference Book MCQs (Lakhmir, RD Sharma, NCERT)",
      "AI Study Assistant Access",
    ],
    tag: "🔥 Most Popular",
  },
  class_12: {
    name: "Class 12 Master Prep",
    desc: "Complete Class 12 PCM + Biology — boards and competitive exam level",
    price: 699,
    originalPrice: 1299,
    emoji: "📗",
    color: "#059669",
    features: [
      "Full PCM + Biology Coverage",
      "Chapter-wise + Mock Tests",
      "Board Pattern Questions",
      "Accuracy Tracking",
      "Reference Book MCQs (HCV, OP Tandon, RD Sharma)",
      "AI Study Assistant Access",
    ],
    tag: "💪 Board + JEE Ready",
  },
}

// Competitive products are handled by the competetive/[product] route
// But just in case someone lands here with jee/neet directly:
const COMPETITIVE_REDIRECT = {
  jee:  "/checkout/competetive/jee",
  neet: "/checkout/competetive/neet",
}

// ── Razorpay script loader ─────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { product } = useParams()
  const router      = useRouter()

  const [step,       setStep]       = useState("review")  // review | paying | success | error
  const [errorMsg,   setErrorMsg]   = useState("")
  const [userInfo,   setUserInfo]   = useState({ name: "", email: "" })
  const orderId = useRef(null)

  const prod = PRODUCTS[product]

  // ── Redirect competitive products ───────────────────────────
  useEffect(() => {
    if (COMPETITIVE_REDIRECT[product]) {
      router.replace(COMPETITIVE_REDIRECT[product])
    }
  }, [product, router])

  // ── Load user info from localStorage ───────────────────────
  useEffect(() => {
    const name  = localStorage.getItem("name")  || ""
    const token = localStorage.getItem("token") || ""
    if (!token) { router.push("/signIn-Register"); return }

    // Decode email from JWT payload
    let email = ""
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      email = payload.sub || payload.email || ""
    } catch (_) {}

    setUserInfo({ name, email })
  }, [router])

  // ── 404 for unknown product ──────────────────────────────────
  if (!prod) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link href="/products" className={styles.backLink}>← Browse Products</Link>
      </div>
    )
  }

  // ── Payment handler ──────────────────────────────────────────
  const handlePay = async () => {
    setStep("paying")
    setErrorMsg("")

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error("Failed to load Razorpay SDK. Check your internet connection.")

      // 2. Create order on Spring Boot backend
      const token = localStorage.getItem("token")
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: prod.price,          // in ₹ — backend multiplies by 100 for paise
          currency: "INR",
          productId: product,
          productName: prod.name,
          receipt: `rcpt_${product}_${Date.now()}`,
        }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}))
        throw new Error(err.message || "Could not create payment order. Please try again.")
      }

      const orderData = await orderRes.json()
      orderId.current = orderData.orderId

      // 3. Open Razorpay checkout
      const options = {
        key:          RAZORPAY_KEY,
        amount:       prod.price * 100,          // paise
        currency:     "INR",
        name:         "Ultima",
        description:  prod.name,
        order_id:     orderData.orderId,
        prefill: {
          name:  userInfo.name,
          email: userInfo.email,
        },
        theme: { color: "#362C93" },             // brand color

        handler: async (response) => {
          // 4. Verify on backend
          try {
            const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                productId:         product,
                amount:            prod.price,
              }),
            })

            if (!verifyRes.ok) throw new Error("Payment verification failed.")

            setStep("success")
            // Redirect to dashboard after 3s
            setTimeout(() => router.push("/dashboard"), 3000)

          } catch (err) {
            setErrorMsg(err.message)
            setStep("error")
          }
        },

        modal: {
          ondismiss: () => {
            // User closed the modal without paying
            setStep("review")
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (response) => {
        setErrorMsg(response.error?.description || "Payment failed. Please try again.")
        setStep("error")
      })
      rzp.open()

    } catch (err) {
      setErrorMsg(err.message)
      setStep("error")
    }
  }

  // ── Success screen ───────────────────────────────────────────
  if (step === "success") {
    return (
      <div className={styles.resultScreen}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Payment Successful!</h2>
          <p className={styles.successDesc}>
            You now have full access to <strong>{prod.name}</strong>.
          </p>
          <p className={styles.successSub}>Redirecting to your dashboard…</p>
          <div className={styles.successBar}>
            <div className={styles.successBarFill} />
          </div>
        </div>
      </div>
    )
  }

  // ── Error screen ─────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className={styles.resultScreen}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorDesc}>{errorMsg}</p>
          <div className={styles.errorActions}>
            <button className={styles.retryBtn} onClick={() => setStep("review")}>Try Again</button>
            <Link href="/products" className={styles.backLink}>← Back to Products</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Main checkout UI ─────────────────────────────────────────
  const discount = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)

  return (
    <div className={styles.page}>

      {/* bg blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <div className={styles.wrapper}>

        {/* ── LEFT: Order summary ── */}
        <div className={styles.summary}>

          <Link href="/products" className={styles.backNav}>← Back to Products</Link>

          <div className={styles.productCard} style={{ "--prod-color": prod.color }}>
            <div className={styles.productTag}>{prod.tag}</div>
            <div className={styles.productEmoji}>{prod.emoji}</div>
            <h2 className={styles.productName}>{prod.name}</h2>
            <p className={styles.productDesc}>{prod.desc}</p>

            <ul className={styles.featureList}>
              {prod.features.map((f, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.featureTick}>✔</span> {f}
                </li>
              ))}
            </ul>

            <div className={styles.priceRow}>
              <span className={styles.originalPrice}>₹{prod.originalPrice}</span>
              <span className={styles.finalPrice}>₹{prod.price}</span>
              <span className={styles.discountBadge}>{discount}% OFF</span>
            </div>

            <p className={styles.offerNote}>⏳ Limited time price — lock it in now</p>
          </div>

          <div className={styles.trustRow}>
            <span>🔒 Secure Payment</span>
            <span>📱 Razorpay</span>
            <span>✅ Instant Access</span>
          </div>
        </div>

        {/* ── RIGHT: Payment panel ── */}
        <div className={styles.payPanel}>

          <h2 className={styles.panelTitle}>Complete your purchase</h2>

          {/* Order breakdown */}
          <div className={styles.orderBreakdown}>
            <div className={styles.breakdownRow}>
              <span>{prod.name}</span>
              <span>₹{prod.originalPrice}</span>
            </div>
            <div className={`${styles.breakdownRow} ${styles.discountRow}`}>
              <span>Discount</span>
              <span>− ₹{prod.originalPrice - prod.price}</span>
            </div>
            <div className={styles.breakdownDivider} />
            <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{prod.price}</span>
            </div>
          </div>

          {/* Account info */}
          <div className={styles.accountInfo}>
            <p className={styles.accountLabel}>Purchasing as</p>
            <div className={styles.accountBox}>
              <div className={styles.accountAvatar}>
                {(userInfo.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={styles.accountName}>{userInfo.name || "Student"}</p>
                <p className={styles.accountEmail}>{userInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Razorpay button */}
          <button
            className={styles.payBtn}
            onClick={handlePay}
            disabled={step === "paying"}
          >
            {step === "paying"
              ? <><span className={styles.spinner} /> Opening payment…</>
              : <>Pay ₹{prod.price} with Razorpay</>
            }
          </button>

          <p className={styles.disclaimer}>
            By completing this purchase you agree to our{" "}
            <Link href="/terms" className={styles.termsLink}>Terms & Conditions</Link>.
            All payments are processed securely by Razorpay.
          </p>

          <div className={styles.methodIcons}>
            <span>💳 Cards</span>
            <span>📲 UPI</span>
            <span>🏦 Net Banking</span>
            <span>👛 Wallets</span>
          </div>

        </div>
      </div>
    </div>
  )
}
