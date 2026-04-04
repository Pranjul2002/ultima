"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "../[product]/checkout.module.css"

const API_URL      = process.env.NEXT_PUBLIC_API_URL
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

const PRODUCTS = {
  jee: {
    name: "JEE Advanced Practice Pack",
    desc: "Full JEE Main + Advanced level practice — Physics, Chemistry & Mathematics",
    price: 999,
    originalPrice: 1999,
    emoji: "⚙️",
    color: "#7c3aed",
    features: [
      "Advanced Level Questions",
      "Full JEE Mock Tests",
      "Rank & Percentile Analysis",
      "Real Exam Simulation",
      "Reference Book MCQs (HCV, N. Avasthi, SL Loney)",
      "AI Study Assistant Access",
      "Previous Year Questions",
    ],
    tag: "🔥 Most Popular",
  },
  neet: {
    name: "NEET Complete Prep Pack",
    desc: "100% NCERT-focused NEET preparation — Biology, Physics & Chemistry",
    price: 999,
    originalPrice: 1999,
    emoji: "🧬",
    color: "#059669",
    features: [
      "Physics • Chemistry • Biology",
      "NCERT Focused Questions",
      "Full NEET Mock Tests",
      "Weak Area Analysis",
      "Reference Book MCQs (NCERT Bio, DC Pandey, VK Jaiswal)",
      "AI Study Assistant Access",
      "Previous Year Questions",
    ],
    tag: "🏥 NEET Focused",
  },
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script    = document.createElement("script")
    script.src      = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload   = () => resolve(true)
    script.onerror  = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CompetitiveCheckoutPage() {
  const { product } = useParams()
  const router      = useRouter()

  const [step,     setStep]     = useState("review")
  const [errorMsg, setErrorMsg] = useState("")
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })
  const orderId = useRef(null)

  const prod = PRODUCTS[product]

  useEffect(() => {
    const name  = localStorage.getItem("name")  || ""
    const token = localStorage.getItem("token") || ""
    if (!token) { router.push("/signIn-Register"); return }
    let email = ""
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      email = payload.sub || payload.email || ""
    } catch (_) {}
    setUserInfo({ name, email })
  }, [router])

  if (!prod) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link href="/products" className={styles.backLink}>← Browse Products</Link>
      </div>
    )
  }

  const handlePay = async () => {
    setStep("paying")
    setErrorMsg("")
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error("Failed to load Razorpay SDK. Check your internet connection.")

      const token    = localStorage.getItem("token")
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount:      prod.price,
          currency:    "INR",
          productId:   `competitive_${product}`,
          productName: prod.name,
          receipt:     `rcpt_${product}_${Date.now()}`,
        }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}))
        throw new Error(err.message || "Could not create payment order. Please try again.")
      }

      const orderData    = await orderRes.json()
      orderId.current    = orderData.orderId

      const options = {
        key:         RAZORPAY_KEY,
        amount:      prod.price * 100,
        currency:    "INR",
        name:        "Ultima",
        description: prod.name,
        order_id:    orderData.orderId,
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#362C93" },

        handler: async (response) => {
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
                productId:         `competitive_${product}`,
                amount:            prod.price,
              }),
            })
            if (!verifyRes.ok) throw new Error("Payment verification failed.")
            setStep("success")
            setTimeout(() => router.push("/dashboard"), 3000)
          } catch (err) {
            setErrorMsg(err.message)
            setStep("error")
          }
        },

        modal: { ondismiss: () => setStep("review") },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (r) => {
        setErrorMsg(r.error?.description || "Payment failed. Please try again.")
        setStep("error")
      })
      rzp.open()

    } catch (err) {
      setErrorMsg(err.message)
      setStep("error")
    }
  }

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

  const discount = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)

  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <div className={styles.wrapper}>

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

        <div className={styles.payPanel}>
          <h2 className={styles.panelTitle}>Complete your purchase</h2>

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
