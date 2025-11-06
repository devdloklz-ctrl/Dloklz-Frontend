"use client";

import { useState } from "react";
import { useOrders, Order } from "./hooks/useOrders";
import OrdersTable from "./OrdersTable";
import OrderFilter from "./OrderFilter";
import OrderModal from "./OrderModal";

export default function VendorOrdersPage() {
  const { orders, loading, error } = useOrders();
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) =>
    filter ? o.status === filter : true
  );

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <OrderFilter filter={filter} setFilter={setFilter} />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <OrdersTable orders={filteredOrders} onView={setSelectedOrder} />
      )}

      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
