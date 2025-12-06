'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SessionProvider, useSession } from "next-auth/react"; // 🧠 for session
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Props type
interface RootLayoutProps {
  children: ReactNode;
}

// ✅ Layout Content wrapped with Session Check
function LayoutContent({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user; // ✅ true if logged in

  return (
    <>
      {!isLoggedIn && <Navbar />}
      {children}
      {!isLoggedIn && <Footer />}
    </>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster position="bottom-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
