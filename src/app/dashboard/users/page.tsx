"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  roles: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users"); // Adjust endpoint if needed
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="mb-8 text-3xl font-bold text-brand-primary">Users</h1>

      {loading && (
        <p className="text-gray-500">Loading users...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg shadow-sm border-border bg-surface">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-900">Username</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-100 hover:bg-background"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4">{user.email ?? "-"}</td>
                  <td className="px-6 py-4">{user.phone ?? "-"}</td>
                  <td className="px-6 py-4">
                    {user.roles.length > 0
                      ? user.roles.join(", ")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
