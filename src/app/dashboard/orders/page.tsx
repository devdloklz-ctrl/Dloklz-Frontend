"use client";

import { useCallback, useEffect, useState } from "react"; // Fixed: removed unused useCallback if not needed, but here we will use it correctly
import api from "@/lib/axios";
import type { Order } from "@/types/order";
import OrdersTable from "@/components/orders/OrdersTable";
import Pagination from "@/components/common/Pagination";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm); // This triggers the fetchOrders useEffect
      setPage(1);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 1. Define fetchOrders with useCallback so it can be passed to the Modal
  // and used in the useEffect without causing infinite loops.
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders", {
        params: { page, limit, search, status }
      });
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages); // Fixed: setTotalPages is now used
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]); // Only changes when filters change

  // 2. Trigger fetch on filter change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <section className="px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          placeholder="Search..."
          value={searchTerm} // Use local term
          onChange={(e) => setSearchTerm(e.target.value)} // Update local term
          className="w-full px-4 py-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1); // Reset to page 1 on status change
          }}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : (
        <OrdersTable orders={orders} onView={setSelectedOrder} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* 3. fetchOrders is now available to pass to the modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={fetchOrders}
      />
    </section>
  );
}