"use client";
import { useState } from "react";
import { Order } from "./hooks/useOrders";
import api from "@/utils/api";
import axios from "axios";

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function OrderModal({ order, onClose, onStatusUpdated }: OrderModalProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");

  if (!order) return null;

  const { orderId, status, total, currency, customer, items, createdAt, updatedAt, paymentMethod } = order;

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
      case "failed":
        return "bg-red-500";
      case "processing":
        return "bg-blue-500";
      case "delivered":
        return "bg-emerald-500";
      case "out for delivery":
        return "bg-indigo-500";
      default:
        return "bg-gray-400";
    }
  };

  const statusColor = getStatusColor(status);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderId) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in again");
        setLoading(false);
        return;
      }

      await api.put(
        "/api/orders/update",
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedStatus(newStatus);
      setShowStatusDropdown(false);
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Unauthorized: Please log in again");
        } else if (err.response?.status === 403) {
          setError("Access denied: You don’t have permission");
        } else {
          setError("Failed to update order status");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Status update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    "pending",
    "processing",
    "on-hold",
    "completed",
    "cancelled",
    "refunded",
    "failed",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-[95%] max-w-3xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-3 h-3 rounded-full ${statusColor}`} />
          <h2 className="text-2xl font-semibold text-gray-900">
            Order - #{orderId ?? "No data"}
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Order Info */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">🧾 Order Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <b>Status:</b>
                {status ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-light capitalize border ${statusColor} bg-opacity-15`}
                  >
                    {selectedStatus || status}
                  </span>
                ) : (
                  "No data"
                )}
              </p>
              <p><b>Total:</b> {total ? `₹${total}` : "No data"}</p>
              <p><b>Currency:</b> {currency ?? "No data"}</p>
              <p><b>Payment Method:</b> {paymentMethod ?? "No data"}</p>
              <p><b>Placed:</b> {createdAt ? new Date(createdAt).toLocaleString() : "No data"}</p>
              <p><b>Updated:</b> {updatedAt ? new Date(updatedAt).toLocaleString() : "No data"}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">👤 Customer Info</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><b>Name:</b> {customer?.name || "No data"}</p>
              <p><b>Email:</b> {customer?.email || "No data"}</p>
              <p><b>Phone:</b> {customer?.phone || "No data"}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">📦 Order Items</h3>
            {items && items.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-100 text-gray-800">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium">Item</th>
                      <th className="py-2 px-3 text-center font-medium">Qty</th>
                      <th className="py-2 px-3 text-right font-medium">Price</th>
                      <th className="py-2 px-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-2 px-3">{item?.name || "No data"}</td>
                        <td className="py-2 px-3 text-center">{item?.quantity ?? "No data"}</td>
                        <td className="py-2 px-3 text-right">
                          {item?.price ? `₹${item.price}` : "No data"}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {item?.total ? `₹${item.total}` : "No data"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No items found</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 mt-6 relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-sm"
          >
            Close
          </button>

          {showStatusDropdown && (
            <div className="absolute bottom-14 bg-white border border-gray-200 rounded-lg shadow-lg w-56 p-2 z-50">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-center text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
}
