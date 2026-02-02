import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";

const manrope = Manrope({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wealth OS - Multi Family Office",
  description: "Premium wealth management platform for multi-family offices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="font-sans antialiased bg-gradient-to-br from-stone-50 via-white to-amber-50/30 min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
