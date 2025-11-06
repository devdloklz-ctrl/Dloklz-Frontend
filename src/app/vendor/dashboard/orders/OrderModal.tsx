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
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");
  const [error, setError] = useState("");

  if (!order) return null;

  const {
    orderId,
    total,
    status,
    customer,
    items,
    currency,
    paymentMethod,
    dateCreated,
    dateModified,
  } = order;

  const statuses = [
    "pending",
    "processing",
    "on-hold",
    "completed",
    "cancelled",
    "refunded",
    "failed",
  ];

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700 border-red-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "refunded":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-[95%] max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Order #{orderId}
        </h2>

        {/* Status & Update */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedStatus)}`}
            >
              {selectedStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleStatusUpdate(selectedStatus)}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save"}
            </button>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">🧾 Order Details</h3>
            <p><b>Total:</b> {total ? `₹${total}` : "N/A"}</p>
            <p><b>Currency:</b> {currency || "N/A"}</p>
            <p><b>Payment:</b> {paymentMethod || "N/A"}</p>
            <p>
              <b>Placed:</b>{" "}
              {dateCreated
                ? new Date(dateCreated).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <b>Updated:</b>{" "}
              {dateModified
                ? new Date(dateModified).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">👤 Customer Info</h3>
            <p><b>Name:</b> {customer?.name || "N/A"}</p>
            <p><b>Email:</b> {customer?.email || "N/A"}</p>
            <p><b>Phone:</b> {customer?.phone || "N/A"}</p>
          </div>
        </div>

        {/* Items */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">📦 Order Items</h3>
          {items && items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left font-medium">Item</th>
                    <th className="py-2 px-3 text-center font-medium">Qty</th>
                    <th className="py-2 px-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No items found</p>
          )}
        </div>

        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
