import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wealth OS - Multi Family Office",
  description: "Premium wealth management platform for multi-family offices",
  manifest: "/manifest.webmanifest",
  themeColor: "#10B981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wealth OS",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans antialiased bg-gradient-to-br from-stone-50 via-white to-amber-50/30 min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
