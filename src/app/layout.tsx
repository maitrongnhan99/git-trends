import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth/auth-context";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
// Initialize database
import "./initialize";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitTrends",
  description: "GitHub Repository Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={twMerge(
          geistSans.variable,
          geistMono.variable,
          "antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        )}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
