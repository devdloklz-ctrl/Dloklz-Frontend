"use client";

import type { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import { getDelhiveryTrackingUrl } from "../../../utils/delhivery";

export default function OrdersTable({
  orders,
  onView,
  loading,
  error,
}: {
  orders: Order[];
  onView: (order: Order) => void;
  loading?: boolean;
  error?: string;
}) {
  if (loading) {
    return <p className="py-6 text-center text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="py-6 text-center text-red-600">{error}</p>;
  }

  if (!orders.length) {
    return <p className="py-6 text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-surface">
      <table className="w-full text-sm text-left min-w-150">
        <thead className="border-b border-gray-200 bg-border">
          <tr>
            <th className="px-4 py-3 font-medium text-text-primary">Order</th>
            <th className="px-4 py-3 font-medium text-text-primary">Customer</th>
            <th className="px-4 py-3 font-medium text-text-primary">Status</th>
            <th className="px-4 py-3 font-medium text-text-primary">Payment</th>
            <th className="px-4 py-3 font-medium text-text-primary">Total</th>
            <th className="px-4 py-3 font-medium text-right text-text-primary">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="border-b border-gray-100 hover:bg-background"
            >
              {/* ORDER */}
              <td className="px-4 py-3 font-semibold text-gray-800">
                #{order.orderNumber}
              </td>

              {/* CUSTOMER */}
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-50">
                  {order.billing.email}
                </p>
              </td>

              {/* STATUS */}
              <td className="px-4 py-3 space-y-1">
                {/* Order Status */}
                <OrderStatusBadge status={order.status} />

                {/* Shipment Status (auto-updated via webhook) */}
                {order.shipment?.status && (
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.shipment.status} />
                    {order.shipment?.waybills?.length ? (
                      <span className="text-xs text-gray-500">
                        WB: {order.shipment.waybills[0]}
                      </span>
                    ) : null}
                  </div>
                )}
              </td>

              {/* PAYMENT */}
              <td className="px-4 py-3 font-medium">
                {order.needs_payment ? (
                  <span className="text-red-600">Pending</span>
                ) : (
                  <span className="text-green-600">Paid</span>
                )}
              </td>

              {/* TOTAL */}
              <td className="px-4 py-3 font-semibold text-gray-900">
                ₹{order.total}
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 space-x-3 text-right">
                <button
                  onClick={() => onView(order)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>

                {order.shipment?.waybills?.length ? (
                  <a
                    href={getDelhiveryTrackingUrl(order.shipment.waybills[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Track
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
