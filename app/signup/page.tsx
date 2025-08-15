import Link from "next/link"
import type { Metadata } from "next"
import { SignupForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - CarbonCue",
  description: "Create your CarbonCue account to start tracking and reducing your carbon footprint",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))]">
      <div className="relative hidden lg:flex lg:w-1/2 bg-carbon-charcoal">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/signup.jpg')",
          }}
        />

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center text-lg font-medium text-white">
            <div className="h-12 w-12 rounded-full bg-white mr-2 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="CarbonCue logo"
                className="h-8 w-8 object-cover rounded-full"
              />
            </div>
            CarbonCue
          </div>
          <div className="space-y-6 text-white">
            <h2 className="text-2xl font-bold drop-shadow-lg">Join the climate action movement</h2>
            <ul className="space-y-3">
              <li className="flex items-start drop-shadow-sm">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-carbon-red flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Track your personal carbon footprint</span>
              </li>
              <li className="flex items-start drop-shadow-sm">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-carbon-purple flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Calculate website and AI emissions</span>
              </li>
              <li className="flex items-start drop-shadow-sm">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-carbon-magenta flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Connect with volunteer opportunities</span>
              </li>
              <li className="flex items-start drop-shadow-sm">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-carbon-deep-red flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Access educational resources and tools</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-carbon-deep-red/60 to-transparent" />
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-4 sm:p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to start tracking and reducing your carbon footprint
            </p>
          </div>
          <SignupForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
