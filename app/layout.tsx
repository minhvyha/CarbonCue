import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LoadingProvider } from "@/contexts/loading"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CarbonCue",
  description: "Track, reduce, and take action on your carbon footprint",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LoadingProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <Toaster richColors />
            </ThemeProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
