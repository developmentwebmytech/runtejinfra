import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/components/session-provider";
import LayoutContent from "@/components/layout-content";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Runtej Infra",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppSessionProvider>
          <LayoutContent>
            {children}
            <Toaster position="bottom-right" closeButton />
          </LayoutContent>
        </AppSessionProvider>
      </body>
    </html>
  );
}
