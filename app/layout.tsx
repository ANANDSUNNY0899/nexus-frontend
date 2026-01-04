import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🚀 THIS IS THE SEO MAGIC
export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-gateway.org'), // Your new domain
  title: "Nexus Gateway | High-Performance AI Caching Layer",
  description: "Reduce OpenAI costs by 90% and speed up LLM responses with semantic caching. The open-source AI Gateway for developers.",
  keywords: ["AI Gateway", "OpenAI Cache", "LLM Proxy", "Vector Database", "Pinecone", "Golang"],
  authors: [{ name: "Sunny Anand", url: "https://github.com/ANANDSUNNY0899" }],
  
  // Facebook / LinkedIn Preview
  openGraph: {
    title: "Nexus Gateway - The AI Cache",
    description: "Stop paying for the same API call twice. Cache your AI requests.",
    url: "https://nexus-gateway.org",
    siteName: "Nexus Gateway",
    locale: "en_US",
    type: "website",
  },

  // Twitter Preview
  twitter: {
    card: "summary_large_image",
    title: "Nexus Gateway",
    description: "High-Performance AI Semantic Caching Layer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
         <Analytics />
      </body>
    </html>
  );
}