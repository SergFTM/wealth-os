"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { Header } from "@/components/shell/Header";
import { CreateModal } from "@/components/shell/CreateModal";
import { CopilotDrawer } from "@/components/shell/CopilotDrawer";
import { useApp } from "@/lib/store";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-stone-50 via-emerald-50/10 to-amber-50/10 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-transparent dark:bg-stone-900/50">
          {children}
        </main>
      </div>
      <CreateModal />
      <CopilotDrawer />
    </div>
  );
}
