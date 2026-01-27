"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <>
      {status !== "loading" && !isLoggedIn && <Navbar />}
      {children}
      {status !== "loading" && !isLoggedIn && <Footer />}
    </>
  );
}
