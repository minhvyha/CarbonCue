// app/not-found.tsx
'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-7xl font-extrabold">404</h1>
      <p className="mt-2 text-lg">We couldn’t find that page.</p>
      <Link href="/" className="mt-4 underline">
        Go back home
      </Link>
    </div>
  )
}
