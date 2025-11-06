"use client";

import React from "react";
import { User } from "./hooks/useUsers";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UsersTable({ users, onEdit }: UsersTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-y-auto max-h-[75vh]">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs tracking-wide sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Vendor ID</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/40 transition-all`}
              >
                <td className="px-6 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3 capitalize">{user.role}</td>
                <td className="px-6 py-3">{user.vendorId ?? "-"}</td>
                <td className="px-6 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
