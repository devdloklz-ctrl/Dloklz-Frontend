"use client";

import Sidebar from "@/components/Sidebar";
import { FiShoppingBag, FiBox, FiUsers, FiUser } from "react-icons/fi";

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ownerMenu = [
    { name: "Orders", path: "/owner/dashboard/orders", icon: <FiShoppingBag /> },
    { name: "Products", path: "/owner/dashboard/products", icon: <FiBox /> },
    { name: "Vendors", path: "/owner/dashboard/vendors", icon: <FiUsers /> },
    { name: "Users", path: "/owner/dashboard/users", icon: <FiUser /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-gray-900 bg-gray-50">
      <Sidebar title="Dloklz Owner" menuItems={ownerMenu}/>
      <main className="flex-1 p-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
