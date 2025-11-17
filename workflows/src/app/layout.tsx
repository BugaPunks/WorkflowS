import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // <--- ADD THIS IMPORT
import "./globals.css";
import { NextAuthProvider } from "./providers";
import NotificationsBell from "@/app/components/NotificationsBell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WorkflowS",
  description: "A project management tool for students and teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <NextAuthProvider>
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  WorkflowS
                </Link>
                <div className="flex items-center">
                  <NotificationsBell />
                </div>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
