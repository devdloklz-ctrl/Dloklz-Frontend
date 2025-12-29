"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface RecentOrder {
  _id: string;
  orderId?: string;
  customerName: string;
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
}

interface DashboardData {
  totalRevenue: number;
  ordersCount: number;
  activeProducts: number;
  recentOrders: RecentOrder[];
}


export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    api.get<DashboardData>("/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);


  if (!data) return <div>Loading...</div>;

  return (
    <div className="px-8 py-10 space-y-10">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={formatINR(data.totalRevenue)}
          hint="All time"
        />
        <StatCard
          label="Orders"
          value={data.ordersCount.toString()}
          hint="Total orders"
        />
        <StatCard
          label="Active Products"
          value={data.activeProducts.toString()}
          hint="Currently listed"
        />
      </div>

      {/* Recent Orders */}
      <div className="border rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-sm font-medium tracking-wide">
            Recent Orders
          </h2>
        </div>

        <div className="divide-y">
          {data.recentOrders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between px-6 py-4 text-sm"
            >
              <div>
                <p className="font-medium">
                  #{order.orderId || order._id.slice(-6)}
                </p>
                <p className="text-muted-foreground">
                  {order.customerName}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <p>{formatINR(order.totalAmount)}</p>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          ))}

          {data.recentOrders.length === 0 && (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              No orders yet
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

/* -------------------- Components -------------------- */

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="p-6 border rounded-lg">
      <p className="text-xs tracking-widest uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-medium">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "Paid";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${isPaid
        ? "bg-black/5 text-black"
        : "bg-yellow-500/10 text-yellow-700"
        }`}
    >
      {status}
    </span>
  );
}
