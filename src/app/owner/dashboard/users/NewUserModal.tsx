"use client";

import React from "react";

interface NewUserModalProps {
  user: {
    name: string;
    email: string;
    role: "owner" | "vendor";
    vendorId?: number;
    password: string;
  };
  onClose: () => void;
  onChange: (field: string, value: string | number | undefined) => void;
  onSave: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function NewUserModal({
  user,
  onClose,
  onChange,
  onSave,
  loading,
  error,
}: NewUserModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <h2
          id="modal-title"
          className="text-2xl font-semibold text-gray-900 mb-6 select-none"
        >
          Add New User
        </h2>

        {/* Error message */}
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={user.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={user.role}
              onChange={(e) => onChange("role", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
              disabled={loading}
            >
              <option value="vendor">Vendor</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="vendorId"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Vendor ID
            </label>
            <input
              id="vendorId"
              type="number"
              value={user.vendorId ?? ""}
              onChange={(e) =>
                onChange(
                  "vendorId",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              placeholder="Optional"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => onChange("password", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
