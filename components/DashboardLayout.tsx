import type React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserNav } from "@/components/user-nav";
import { ResizableSidebar } from "@/components/resizable-sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4  bg-gray-50">
            <div className="flex items-center gap-2 ">
              <MobileSidebar />
              <Link href="/dashboard" className="hidden sm:inline-block">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <h1 className="text-base font-semibold">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Construction Co.</p>
                  </div>
                </div>
              </Link>

              {/* <Link href="/dashboard">
                <span className="hidden font-bold sm:inline-block">
                  Admin Dashboard
                </span>
              </Link> */}
            </div>
            <div className="flex items-center gap-2">
              <UserNav user={session.user} />
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* Sticky Sidebar */}
          <div className="sticky top-16 h-[calc(100vh-4rem)] z-30">
            <ResizableSidebar />
          </div>

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-hidden p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
