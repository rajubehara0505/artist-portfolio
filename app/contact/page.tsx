import { Suspense } from "react"
import ContactClientPage from "./contact-client"

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ContactClientPage />
    </Suspense>
  )
}
