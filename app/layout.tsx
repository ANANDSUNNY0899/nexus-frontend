import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-gateway.org'),
  title: "Nexus Gateway | High-Performance AI Infrastructure",
  description: "Enterprise-grade AI gateway with semantic caching, multi-model routing, and sovereign governance. Reduce costs by 90%.",
  keywords: ["AI Gateway", "OpenAI Cache", "LLM Infrastructure", "Sovereign AI", "Vector Database", "Nexus Gateway"],
  
  // 🚀 THE LOGO FIX: Hard-pointing every icon to LOGO.png
  icons: {
    icon: [
      { url: "/LOGO.png", sizes: "32x32" },    // Standard Favicon
      { url: "/LOGO.png", sizes: "192x192" },  // Android Icon
    ],
    shortcut: "/LOGO.png", 
    apple: "/LOGO.png",                        // iOS Icon
  },


  // Social Media Previews (OpenGraph)
  openGraph: {
    title: "Nexus Gateway | The AI Control Plane",
    description: "Infrastructure protocol for high-performance AI engineering.",
    url: "https://nexus-gateway.org",
    siteName: "Nexus Gateway",
    images: [
      {
         url: "/LOGO.png",
        width: 1200,      // 🚀 Standard Large Size
        height: 630,
        alt: "Nexus Gateway Console",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter/X Previews
  twitter: {
    card: "summary_large_image",
    title: "Nexus Gateway",
    description: "Sovereign AI Infrastructure Protocol",
    images: ["/LOGO.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#020617] text-slate-200`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}