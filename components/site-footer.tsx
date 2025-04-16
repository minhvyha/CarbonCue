import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-carbon-charcoal text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="hover:text-carbon-sand">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-carbon-sand">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-carbon-sand">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-carbon-sand">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex flex-col md:flex-row md:gap-8 mb-4">
            <Link href="/about" className="hover:text-carbon-sand text-sm">
              About
            </Link>
            <Link href="/privacy" className="hover:text-carbon-sand text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-carbon-sand text-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-carbon-sand text-sm">
              Contact
            </Link>
          </div>
          <p className="text-center text-xs leading-5 text-carbon-sand">
            &copy; {new Date().getFullYear()} CarbonCue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
