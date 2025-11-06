"use client";

import Sidebar from "@/components/Sidebar";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendorMenu = [{ name: "Orders", path: "/vendor/dashboard/orders" }];

  return (
    <div className="flex h-screen overflow-hidden text-gray-900 bg-gray-50">
      <Sidebar title="Dloklz Owner" menuItems={vendorMenu} />
      <main className="flex-1 p-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
