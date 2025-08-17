import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Providers from "./providers"; // ✅ CartProvider + other global providers

// ✅ Load Google Font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Sasya Mantra - Organic Farming Solutions",
    template: "%s | Sasya Mantra",
  },
  description:
    "Premium organic farming products and services. Sustainable agriculture solutions for modern farmers.",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sasya Mantra",
    title: "Sasya Mantra - Organic Farming Solutions",
    description:
      "Premium organic farming products and services. Sustainable agriculture solutions for modern farmers.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sasya Mantra - Organic Farming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sasya Mantra - Organic Farming Solutions",
    description:
      "Premium organic farming products and services. Sustainable agriculture solutions for modern farmers.",
    images: ["/og-image.jpg"],
    creator: "@sasyamantra",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        {/* ✅ Global providers (CartProvider, ThemeProvider, etc.) */}
        <Providers>
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
