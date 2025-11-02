"use client";
import React, { useState } from "react";
import { Vendor } from "./hooks/useVendors";

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Vendor>) => void;
}

export default function VendorDetailsModal({ vendor, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<Partial<Vendor>>(vendor || {});

  if (!vendor) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(vendor.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Vendor Details</h2>

        <div className="space-y-3">
          <input
            name="store_name"
            value={form.store_name || ""}
            onChange={handleChange}
            placeholder="Store Name"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
