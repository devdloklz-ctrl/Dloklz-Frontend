"use client";

import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import api from "@/utils/api";

export interface Vendor {
  _id?: string;
  id: number;
  store_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  banner?: string;
  shop_url?: string;
  enabled?: boolean;
  rating?: {
    rating: string;
    count: number;
  };
  registered?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  vendor?: Vendor;
  vendors?: Vendor[];
}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔒 Helper to add auth header if token exists */
  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /** 📦 Fetch all vendors */
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<ApiResponse>("/api/vendors", {
        headers: getAuthHeader(),
      });
      if (res.data.success && res.data.vendors) {
        setVendors(res.data.vendors);
      } else {
        setError(res.data.message || "Failed to fetch vendors.");
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse>;
      console.error("❌ Error fetching vendors:", err);
      setError(err.response?.data?.message || "Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔄 Sync vendors from Dokan API */
  const syncVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<ApiResponse>("/api/vendors/sync", {
        headers: getAuthHeader(),
      });
      if (res.data.success) {
        await fetchVendors(); // Refresh list after sync
        return res.data.message || "Vendors synced successfully.";
      } else {
        throw new Error(res.data.message || "Vendor sync failed.");
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse>;
      console.error("❌ Error syncing vendors:", err);
      const message = err.response?.data?.message || "Failed to sync vendors.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchVendors]);

  /** ✏️ Update vendor */
  const updateVendor = useCallback(
    async (id: number, updates: Partial<Vendor>) => {
      try {
        const res = await api.put<ApiResponse>(
          `/api/vendors/${id}`,
          updates,
          { headers: getAuthHeader() }
        );
        if (res.data.success && res.data.vendor) {
          setVendors((prev) =>
            prev.map((v) => (v.id === id ? res.data.vendor! : v))
          );
          return res.data.vendor;
        } else {
          throw new Error(res.data.message || "Failed to update vendor.");
        }
      } catch (error) {
        const err = error as AxiosError<ApiResponse>;
        console.error("❌ Error updating vendor:", err);
        throw new Error(err.response?.data?.message || "Update failed.");
      }
    },
    []
  );

  /** 🗑️ Delete vendor */
  const deleteVendor = useCallback(async (id: number) => {
    try {
      const res = await api.delete<ApiResponse>(`/api/vendors/${id}`, {
        headers: getAuthHeader(),
      });
      if (res.data.success) {
        setVendors((prev) => prev.filter((v) => v.id !== id));
      } else {
        throw new Error(res.data.message || "Failed to delete vendor.");
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse>;
      console.error("❌ Error deleting vendor:", err);
      throw new Error(err.response?.data?.message || "Delete failed.");
    }
  }, []);

  /** 🧩 Auto-fetch on mount */
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    syncVendors,
    updateVendor,
    deleteVendor,
  };
}
