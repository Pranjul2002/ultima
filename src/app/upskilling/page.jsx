import { Suspense } from "react"
import UpskillingPage from "./UpskillingPage"

export const metadata = {
  title: "Upskilling — AI Study Assistant | Ultima",
  description:
    "Upload any chapter or notes and let AI quiz you, summarise it, or evaluate your answers.",
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "200px 8%", fontSize: "1.1rem", color: "#64748b" }}>Loading…</div>}>
      <UpskillingPage />
    </Suspense>
  )
}
