"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { Order } from "./hooks/useOrders";
import OrderFilter from "./OrderFilter";
import OrdersTable from "./OrdersTable";
import OrderModal from "./OrderModal";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 🔍 Fetch orders with optional filters
  const fetchOrders = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟢 Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 🧾 Sticky Header + Filter */}
      <div className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 px-8 pt-4 pb-2">
        <h2 className="text-2xl font-semibold text-gray-800">All Orders</h2>
        <p className="text-gray-500 text-sm mt-1 mb-3">
          Manage and review all recent orders
        </p>
        <OrderFilter onFilter={fetchOrders} />
      </div>

      {/* 📜 Scrollable Table Area */}
      <div className="flex-1 overflow-y-hidden pt-6 px-8">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Try adjusting filters or refresh the page</p>
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onView={setSelectedOrder}
            onUpdate={setSelectedOrder}
          />
        )}
      </div>

      {/* 🪟 Order Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={() => fetchOrders()}
        />
      )}
    </div>
  );
}
