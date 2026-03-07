import { Suspense } from "react"
import TestPage from "./TestPage"
import styles from "./page.module.css"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className={styles.pageBackground}>
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
            <p>Loading test...</p>
          </div>
        </div>
      }
    >
      <TestPage />
    </Suspense>
  )
}