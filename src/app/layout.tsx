import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Church Growth Tracker",
  description: "Track and follow up with first timers to boost church growth.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutClient from "@/components/LayoutClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LayoutClient>
            {children}
          </LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
