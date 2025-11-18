import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import Navigation from "@/app/components/Navigation";

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
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <NextAuthProvider>
          <Navigation />
          <main>{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
