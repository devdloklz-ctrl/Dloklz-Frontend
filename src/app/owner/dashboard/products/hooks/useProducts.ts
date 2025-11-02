"use client";

import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import api from "@/utils/api";

export interface Product {
  _id?: string;
  wooId?: number;
  name: string;
  sku?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  description?: string;
  short_description?: string;
  categories?: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  images?: { id: number; src: string; name: string; alt: string }[];
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  type?: string; // 🆕 e.g. "simple", "variable"
  on_sale?: boolean; // 🆕 whether the product is currently on sale
  rating_count?: number; // 🆕 total number of ratings
  average_rating?: string; // 🆕 average rating (WooCommerce gives it as string)
  store?: {
    id?: number;
    name?: string;
    shop_name?: string;
    url?: string;
  }; // 🆕 vendor store info (from Dokan or similar)

  meta_data?: {
    id: number;
    key: string;
    value: string | number | boolean | Record<string, unknown> | null;
  }[];

  createdAt?: string;
  updatedAt?: string;
}

interface ApiError {
  message?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔒 Auth header helper */
  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /** 🟢 Fetch all products */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<Product[]>("/api/products", {
        headers: getAuthHeader(),
      });

      // ✅ Your backend sends a plain array, not an object
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.error("❌ Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔄 Sync with WooCommerce */
  const syncProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post(
        "/api/products/sync",
        {},
        { headers: getAuthHeader() }
      );

      console.log("✅ Sync completed:", res.data);
      await fetchProducts();
      return res.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.error("❌ Error syncing products:", err);
      setError(err.response?.data?.message || "Failed to sync products.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  /** ➕ Add new product */
  const addProduct = useCallback(
    async (data: Partial<Product>) => {
      try {
        const res = await api.post<{ product: Product }>(
          "/api/products",
          data,
          { headers: getAuthHeader() }
        );
        setProducts((prev) => [res.data.product, ...prev]);
        return res.data.product;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        console.error("❌ Error adding product:", err);
        throw new Error(
          err.response?.data?.message || "Failed to add product."
        );
      }
    },
    []
  );

  /** ✏️ Update product */
  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      try {
        const res = await api.put<{ product: Product }>(
          `/api/products/${id}`,
          updates,
          { headers: getAuthHeader() }
        );
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? res.data.product : p))
        );
        return res.data.product;
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        console.error("❌ Error updating product:", err);
        throw new Error(
          err.response?.data?.message || "Failed to update product."
        );
      }
    },
    []
  );

  /** 🗑️ Delete product */
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/products/${id}`, {
        headers: getAuthHeader(),
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.error("❌ Error deleting product:", err);
      throw new Error(
        err.response?.data?.message || "Failed to delete product."
      );
    }
  }, []);

  /** 🔁 Auto-fetch products */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    syncProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
