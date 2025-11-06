"use client";

import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import api from "@/utils/api";

// Nested item details inside WooCommerce order
export interface OrderItem {
  id?: number;
  name: string;
  productId?: number;
  quantity: number;
  price?: string;
  total: string;
  sku?: string;
  image?: {
    id?: string;
    src?: string;
  };
  meta_data?: {
    id?: number;
    key: string;
    value: unknown; // ✅ replaced any
  }[];
}

// The complete WooCommerce order data stored under "fullData"
export interface FullData {
  id: number;
  status: string;
  currency: string;
  total: string;
  payment_method: string;
  payment_method_title?: string;
  date_created?: string;
  date_modified?: string;
  line_items?: OrderItem[];
  billing?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
  store?: {
    id: number;
    name: string;
    shop_name: string;
    url: string;
  };
  meta_data?: {
    id: number;
    key: string;
    value: unknown; // ✅ replaced any
  }[];
  [key: string]: unknown; // ✅ replaced any
}

// Main Order structure stored in MongoDB
export interface Order {
  _id?: string;
  orderId: number;
  status: string;
  total: string;
  currency?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  vendorId?: number | string;
  dateCreated?: string;
  dateModified?: string;
  createdAt?: string;
  updatedAt?: string;
  webhookTopic?: string;
  webhookDeliveryId?: string;
  notes?: string;

  customer?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };

  fullData?: FullData;
  items?: OrderItem[];
}

interface ApiError {
  message?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const vendorId =
        typeof window !== "undefined" ? localStorage.getItem("vendorId") : null;

      if (!vendorId) {
        setError("Vendor ID not found. Please log in again.");
        return;
      }

      console.log("📦 Fetching orders for vendorId:", vendorId);

      const res = await api.get(`/api/orders`, {
        headers: getAuthHeader(),
        params: { vendorId },
      });

      // Handle both array and wrapped object response formats
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data.orders as Order[]) || [];

      console.log("✅ Orders fetched:", data.length);
      setOrders(data);
    } catch (error: unknown) { // ✅ no any here
      const err = error as AxiosError<ApiError>;
      console.error("❌ Error fetching vendor orders:", err);
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
