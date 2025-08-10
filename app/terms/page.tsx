import type { Metadata } from "next"
import { TermsPageClient } from "./TermsPageClient"

export const metadata: Metadata = {
  title: "Terms of Service - CarbonCue",
  description:
    "Read CarbonCue's Terms of Service to understand your rights and responsibilities when using our sustainability platform.",
}

export default function TermsPage() {
  return <TermsPageClient />
}
