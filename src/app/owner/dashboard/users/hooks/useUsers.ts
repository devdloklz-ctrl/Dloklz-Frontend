"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api"; // Use your axios instance, adjust path as needed
import { AxiosError } from "axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "vendor";
  vendorId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  name?: string;
  role?: "owner" | "vendor";
  vendorId?: number;
  password?: string;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, updates: UserUpdate) => Promise<User>;
}

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get<User[]>("/api/users", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setUsers(data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        setError(data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, updates: UserUpdate): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put<{ user: User }>(`/api/users/${id}`, updates, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setUsers((prev) => prev.map((user) => (user._id === id ? data.user : user)));
      return data.user;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        setError(data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, updateUser };
};
