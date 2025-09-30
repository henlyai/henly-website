import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Henly AI - Enterprise AI Automation Platform",
  description: "Transform your business with secure AI agents and chatbots. Custom enterprise solutions that integrate seamlessly with your existing systems and workflows.",
  keywords: "AI automation, enterprise chatbots, AI agents, business automation, custom AI solutions, secure AI platform",
  authors: [{ name: "Henly AI" }],
  creator: "Henly AI",
  publisher: "Henly AI",
  openGraph: {
    title: "Henly AI - Enterprise AI Automation Platform",
    description: "Transform your business with secure AI agents and chatbots. Custom enterprise solutions that integrate seamlessly with your existing systems and workflows.",
    url: "https://henly.ai",
    siteName: "Henly AI",
    images: [
      {
        url: "/henly_ai_logo.png",
        width: 1200,
        height: 630,
        alt: "Henly AI - Enterprise AI Automation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henly AI - Enterprise AI Automation Platform",
    description: "Transform your business with secure AI agents and chatbots. Custom enterprise solutions that integrate seamlessly with your existing systems and workflows.",
    images: ["/henly_ai_logo.png"],
    creator: "@henlyai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://henly.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#595F39" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
