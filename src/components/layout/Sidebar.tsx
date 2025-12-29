"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar({ role }: { role: string[] }) {
  const pathname = usePathname();
  const isAdmin = role.includes("owner");
  const isVendor = role.includes("vendor");

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={clsx(
          "group relative flex items-center rounded-md transition-all",
          "py-2 px-3 text-sm tracking-wide",
          isActive
            ? "bg-black/5 text-black font-medium"
            : "text-muted-foreground hover:bg-black/5 hover:text-black"
        )}
      >
        {/* Active indicator */}
        <span
          className={clsx(
            "absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-black transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
          )}
        />

        <span className={clsx(isActive && "translate-x-1 transition-transform")}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-background border-r shadow-[2px_0_12px_rgba(0,0,0,0.04)]">
      {/* Brand */}
      <div className="px-8 pt-10 pb-8 mb-10 border-b">
        <h1 className="text-xl tracking-widest uppercase font-brand">
          Dloklz Store
        </h1>
        <p className="text-xs tracking-wider text-muted-foreground">
          Since 2025
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-6 space-y-8">
        <div>
          <p className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
            Overview
          </p>
          {navItem("/dashboard", "Dashboard")}
        </div>

        <div>
          <p className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
            Commerce
          </p>
          {navItem("/dashboard/products", "Products")}
          {navItem("/dashboard/orders", "Orders")}
        </div>

        {isVendor && (
          <div>
            <p className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
              Logistics
            </p>
            {navItem("/dashboard/pickup_locations", "Pickup Location")}
          </div>
        )}

        {isAdmin && (
          <div>
            <p className="mb-3 text-xs tracking-widest uppercase text-muted-foreground">
              Management
            </p>
            {navItem("/dashboard/users", "Users")}
            {navItem("/dashboard/vendors", "Vendors")}
          </div>
        )}
      </nav>
    </aside>
  );
}
