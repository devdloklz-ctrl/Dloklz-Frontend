"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return null; // or skeleton loader
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      <aside className="fixed top-0 left-0 z-30 w-64 h-screen bg-white shadow-md">
        <Sidebar role={user.roles} />
      </aside>

      <div className="flex flex-col flex-1 h-screen ml-64">
        <header className="fixed top-0 right-0 z-20 bg-white shadow left-64">
          <Topbar role={user.roles}/>
        </header>

        <main className="flex-1 pt-16 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
