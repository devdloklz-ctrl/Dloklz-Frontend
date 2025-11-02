"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api";
import { AxiosError } from "axios";

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
  vendor?: string;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  _id: string;
  orderId: number;
  status: string;
  total?: string;
  currency?: string;
  customer?: CustomerInfo;
  items?: OrderItem[];
  paymentMethod?: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

interface OrdersApiResponse {
  orders?: Order[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await api.get<OrdersApiResponse | Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: Order[] = Array.isArray(response.data)
          ? response.data
          : response.data?.orders || [];

        if (!Array.isArray(data)) {
          console.warn("⚠️ Unexpected orders response:", response.data);
          throw new Error("Invalid response format: expected an array.");
        }

        // ✅ ensure backward compatibility — if API response has nested structure
        const mapped = data.map((o) => ({
          ...o,
          paymentMethod: o.paymentMethod || "Not specified",
          shippingMethod: o.shippingMethod || "Not specified",
        }));

        setOrders(mapped);
        setFilteredOrders(mapped);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            (axiosError.message === "Network Error"
              ? "Cannot connect to server."
              : axiosError.message || "Failed to load orders")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = useCallback(
    (query: string, status?: string, startDate?: string, endDate?: string) => {
      let result = [...orders];
      const q = query.trim().toLowerCase();

      if (q) {
        result = result.filter((o) => {
          const orderIdStr = String(o.orderId || "").toLowerCase();
          const name = o.customer?.name?.toLowerCase() || "";
          const email = o.customer?.email?.toLowerCase() || "";
          const payment = o.paymentMethod?.toLowerCase() || "";
          return (
            name.includes(q) ||
            email.includes(q) ||
            orderIdStr.includes(q) ||
            payment.includes(q)
          );
        });
      }

      if (status && status !== "all") {
        result = result.filter(
          (o) => o.status?.toLowerCase() === status.toLowerCase()
        );
      }

      if (startDate) {
        const from = new Date(startDate);
        result = result.filter((o) => new Date(o.createdAt) >= from);
      }

      if (endDate) {
        const to = new Date(endDate);
        result = result.filter((o) => new Date(o.createdAt) <= to);
      }

      setFilteredOrders(result);
    },
    [orders]
  );

  return { orders: filteredOrders, loading, error, filterOrders };
}
