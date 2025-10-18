"use client";

import Sidebar from "@/components/Sidebar";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendorMenu = [{ name: "Orders", path: "/vendor/dashboard/orders" }];

  return (
    <div className="flex min-h-screen">
      <Sidebar title="Vendor Dashboard" menuItems={vendorMenu} />
      <main className="flex-1 bg-gray-100 p-6 ml-64">{children}</main>
    </div>
  );
}
