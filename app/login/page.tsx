import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login - CarbonCue",
  description:
    "Log in to your CarbonCue account to track and reduce your carbon footprint",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] w-full">
      <div className="relative hidden lg:flex lg:w-1/2 bg-carbon-charcoal">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/login.jpg')",
          }}
        />

        {/* Dark overlay to increase contrast */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        {/* Content Overlay (bring it above the image+overlay) */}
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

          <blockquote className="space-y-2 text-white">
            <p className="text-lg drop-shadow-lg">
              "CarbonCue has transformed how our organization tracks and reduces
              our carbon footprint. The insights and tools have been invaluable
              in our sustainability journey."
            </p>
            <footer className="text-sm opacity-90 drop-shadow-sm">
              Sofia Chen, Sustainability Director at GreenTech
            </footer>
          </blockquote>
        </div>

        {/* Bottom gradient — keep below content so it doesn't cover text */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-carbon-deep-red/60 to-transparent" />
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-4 sm:p-8 h-full">
        <div className="w-full max-w-md space-y-4 flex flex-col">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to access your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By logging in, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
