"use client";
import { Order } from "./hooks/useOrders";
import OrderActions from "./OrderActions";

interface OrdersTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onUpdate: (order: Order) => void;
}

// Map status to colors
const statusStyles: Record<string, string> = {
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-indigo-50 text-indigo-700 border-indigo-200",
  failed: "bg-orange-50 text-orange-700 border-orange-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function OrdersTable({ orders, onView, onUpdate }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-y-auto max-h-[75vh]"> {/* scroll only table */}
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs tracking-wide sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const statusClass = statusStyles[order.status] || statusStyles.refunded;
              return (
                <tr
                  key={order._id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/40 transition-all border-b border-gray-100`}
                >
                  <td className="px-6 py-3 font-medium text-gray-800">#{order.orderId}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.customer?.email || "-"}</p>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-700">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusClass}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <OrderActions onView={() => onView(order)} onUpdate={() => onUpdate(order)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
