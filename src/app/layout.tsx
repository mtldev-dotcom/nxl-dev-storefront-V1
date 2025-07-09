import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Mona_Sans, Playfair_Display, Cinzel } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

import "../styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const monaSans = Mona_Sans({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: "variable",
  variable: "--font-mona-sans",
})

const playfairDisplay = Playfair_Display({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-playfair-display",
})

const cinzel = Cinzel({
  preload: true,
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-cinzel",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  // Use default locale for root layout - specific locale will be handled in [locale] layout
  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.className} ${playfairDisplay.variable} ${cinzel.variable}`}>
        <main className="relative">{props.children}</main>
        <SpeedInsights />
      </body>
    </html>
  )
}
