"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import type { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import { useEffect, useState } from "react";
import ShipmentTimeline from "./ShipmentTimeline";

const ORDER_STATUSES = [
  "pending",
  "on-hold",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
];

type OrderStatusUpdatePayload = {
  status: Order["status"];
  needs_payment?: boolean;
};

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { user } = useAuth();

  const [status, setStatus] = useState<Order["status"]>(
    order?.status ?? "pending"
  );
  const [needsPayment, setNeedsPayment] = useState(order?.needs_payment);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setNeedsPayment(order.needs_payment);
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${order._id}`);
        setStatus(res.data.status);
      } catch { }
    }, 15000); // every 15s

    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const isOwner = user?.roles?.includes("owner");
  const isVendor = user?.roles?.includes("vendor");

  const hasChanges =
    status !== order.status ||
    (isOwner && needsPayment !== order.needs_payment);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";

      const payload: OrderStatusUpdatePayload = { status };

      if (isOwner) {
        payload.needs_payment = needsPayment;
      }

      await api.patch(`/orders/${order._id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl">
        {order.shipment?.status === "rto" && (
          <div className="px-6 py-3 text-sm text-red-700 bg-red-100 border-b">
            🚨 Shipment marked as RTO (Return to Origin). Immediate action required.
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Order #{order.orderNumber}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(order.date_created).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* 🔥 synced badge */}
            <OrderStatusBadge status={status!} />

            <button
              onClick={onClose}
              className="text-gray-400 transition hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-12 gap-8 px-8 py-6 max-h-[70vh] overflow-y-auto">

          {/* LEFT */}
          <div className="col-span-7 space-y-8">

            {/* Status Control */}
            <div>
              <h4 className="mb-3 text-xs font-semibold text-gray-400 uppercase">
                Order Control
              </h4>

              <div className="flex gap-4">
                <select
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== status) setStatus(val);
                  }}
                  className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Payment Status */}
                <div className="w-1/2">
                  <select
                    value={needsPayment ? "pending" : "paid"}
                    disabled={!isOwner}
                    onChange={(e) =>
                      setNeedsPayment(e.target.value === "pending")
                    }
                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${isOwner
                      ? "focus:ring-2 focus:ring-black"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Payment Pending</option>
                  </select>

                  {isVendor && (
                    <p className="mt-1 text-xs text-gray-400">
                      Payment status is view-only
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="mb-4 text-xs font-semibold text-gray-400 uppercase">
                Items
              </h4>

              <div className="space-y-3">
                {order.line_items && order.line_items.length > 0 ? (
                  order.line_items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-sm text-center text-gray-500">No items found in this order.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-5 space-y-8">

            {/* Customer */}
            <div className="p-5 border rounded-xl bg-gray-50">
              <h4 className="mb-3 text-xs font-semibold text-gray-400 uppercase">
                Customer
              </h4>

              <p className="text-sm font-medium">
                <span className="font-semibold">Name : </span>{order.billing.first_name} {order.billing.last_name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Email : </span>{order.billing.email}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Phone : </span>{order.billing.phone}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Address : </span>{order.billing.address_1}, {order.billing.city}, {order.billing.state} - {order.billing.postcode}
              </p>
            </div>

            {/* Shipment */}
            {order.shipment && (
              <div className="p-5 border rounded-xl bg-gray-50">
                <h4 className="mb-3 text-xs font-semibold text-gray-400 uppercase">
                  Shipment
                </h4>

                <div className="flex items-center gap-2 mb-2">
                  <OrderStatusBadge status={order.shipment.status} />
                  <span className="text-xs text-gray-500">
                    via {order.shipment.provider}
                  </span>
                </div>

                {order.shipment.waybills?.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Waybill:</span>{" "}
                    {order.shipment.waybills.join(", ")}
                  </p>
                )}

                {order.shipment.lastStatusAt && (
                  <p className="mt-1 text-xs text-gray-500">
                    Updated:{" "}
                    {new Date(order.shipment.lastStatusAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Total */}
            <div className="px-6 py-5 text-white bg-black rounded-xl">
              <div className="flex justify-between text-sm opacity-70">
                <span>Total Amount</span>
                <span>INR</span>
              </div>
              <div className="mt-2 text-2xl font-semibold">
                ₹{order.total}
              </div>
            </div>

            {order.shipment?.status && (
              <>
                <h4 className="mt-6 text-xs font-semibold text-gray-400 uppercase">
                  Shipment Progress
                </h4>
                <ShipmentTimeline status={order.shipment.status} />
              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading || !hasChanges}
            className="px-6 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-40"
          >
            {loading ? "Updating…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
