"use client";

import React, { useState } from "react";
import { User, UserUpdate } from "./hooks/useUsers";

interface UserModalProps {
  user: User;
  onClose: () => void;
  onSave: (id: string, updates: UserUpdate) => Promise<void>;
}

export default function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<User["role"]>(user.role);
  const [vendorId, setVendorId] = useState<string>(user.vendorId?.toString() ?? "");
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updates: UserUpdate = { 
        name, 
        role,
        // Only add vendorId if not empty and convert to number
        ...(vendorId.trim() !== "" ? { vendorId: Number(vendorId) } : {}),
      };
      if (password.trim() !== "") {
        updates.password = password;
      }
      await onSave(user._id, updates);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-[95%] max-w-md relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit User</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as User["role"])}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="vendor">Vendor</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Vendor ID</label>
            <input
              type="number"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Vendor ID"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Password (leave blank to keep unchanged)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
