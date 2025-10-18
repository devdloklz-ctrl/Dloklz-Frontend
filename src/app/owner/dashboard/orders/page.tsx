"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/utils/api"; // ✅ import your axios instance

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email?: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetched token:", token); // Debugging line

        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        // ✅ Use centralized axios instance with baseURL
        const response = await api.get<Order[]>("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Orders</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage and review all recent customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 rounded-xl text-center text-gray-500 shadow-sm">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50/40 transition-all border-b border-gray-100`}
                >
                  <td className="px-6 py-3 font-medium text-gray-800">
                    #{order.orderId}
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">
                      {order.customer?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer?.email || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-700">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === "completed"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : order.status === "cancelled"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : order.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
