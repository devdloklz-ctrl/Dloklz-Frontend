"use client";

import { useAuth } from "@/context/AuthContext";

type TopbarProps = {
  role?: string[];
};

export default function Topbar({ role = [] }: TopbarProps) {
  const { logout } = useAuth();

  const isAdmin = role.includes("owner");
  const isVendor = role.includes("vendor");

  const panelTitle = isAdmin
    ? "Admin Panel"
    : isVendor
    ? "Vendor Panel"
    : "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 border-b border-ui-border bg-background/95 backdrop-blur">
      {/* Left */}
      <div>
        <h2 className="text-sm font-medium tracking-widest uppercase text-text-secondary">
          {panelTitle}
        </h2>
      </div>

      {/* Right */}
      <button
        onClick={logout}
        className="text-xs tracking-widest uppercase transition text-text-secondary hover:text-brand-primary"
      >
        Logout
      </button>
    </header>
  );
}
