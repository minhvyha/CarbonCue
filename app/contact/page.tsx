import type { Metadata } from "next"
import { ContactPageClient } from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - CarbonCue",
  description:
    "Get in touch with CarbonCue. We're here to help with your sustainability journey and answer any questions about our platform.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
